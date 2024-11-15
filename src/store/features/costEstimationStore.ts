import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface CostBreakdown {
  category: string;
  amount: number;
  description: string;
  frequency: 'one-time' | 'monthly' | 'yearly';
}

interface CostEstimate {
  id: string;
  projectName: string;
  description: string;
  timeline: number;
  teamSize: number;
  analysis: {
    totalCost: number;
    monthlyBurn: number;
    breakdown: CostBreakdown[];
    assumptions: string[];
    risks: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface CostEstimationState {
  estimates: CostEstimate[];
  isLoading: boolean;
  error: string | null;
  generateEstimate: (
    projectName: string,
    description: string,
    timeline: number,
    teamSize: number
  ) => Promise<void>;
  removeEstimate: (id: string) => void;
}

const validateAnalysisResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.analysis === 'object' &&
    typeof data.analysis.totalCost === 'number' &&
    typeof data.analysis.monthlyBurn === 'number' &&
    Array.isArray(data.analysis.breakdown) &&
    Array.isArray(data.analysis.assumptions) &&
    Array.isArray(data.analysis.risks) &&
    Array.isArray(data.recommendations)
  );
};

export const useCostEstimationStore = create<CostEstimationState>()(
  persist(
    (set) => ({
      estimates: [],
      isLoading: false,
      error: null,

      generateEstimate: async (
        projectName: string,
        description: string,
        timeline: number,
        teamSize: number
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert cost analyst and project estimator. Analyze the given project details and provide a comprehensive cost estimate. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Generate a detailed cost estimate for this project:
                  Project Name: ${projectName}
                  Description: ${description}
                  Timeline (months): ${timeline}
                  Team Size: ${teamSize}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "totalCost": <total project cost in USD>,
                      "monthlyBurn": <monthly burn rate in USD>,
                      "breakdown": [
                        {
                          "category": <string>,
                          "amount": <number in USD>,
                          "description": <string>,
                          "frequency": <"one-time" | "monthly" | "yearly">
                        }
                      ],
                      "assumptions": <array of strings>,
                      "risks": <array of strings>
                    },
                    "recommendations": <array of strings with cost optimization suggestions>
                  }`
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          });

          const responseContent = completion.choices[0].message.content;
          if (!responseContent) {
            throw new Error('Empty response from AI');
          }

          let analysisData;
          try {
            analysisData = JSON.parse(responseContent);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Failed to parse AI response');
          }

          if (!validateAnalysisResponse(analysisData)) {
            throw new Error('Invalid analysis data structure');
          }

          const newEstimate: CostEstimate = {
            id: crypto.randomUUID(),
            projectName,
            description,
            timeline,
            teamSize,
            analysis: {
              totalCost: Math.max(0, analysisData.analysis.totalCost),
              monthlyBurn: Math.max(0, analysisData.analysis.monthlyBurn),
              breakdown: analysisData.analysis.breakdown,
              assumptions: analysisData.analysis.assumptions,
              risks: analysisData.analysis.risks
            },
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            estimates: [newEstimate, ...state.estimates],
            isLoading: false 
          }));

          toast.success('Cost estimate generated successfully!');
        } catch (error: any) {
          console.error('Error generating estimate:', error);
          const errorMessage = error.message || 'Failed to generate estimate. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removeEstimate: (id) => set((state) => ({
        estimates: state.estimates.filter((estimate) => estimate.id !== id)
      }))
    }),
    {
      name: 'cost-estimation-storage',
      partialize: (state) => ({ 
        estimates: state.estimates.map(estimate => ({
          ...estimate,
          createdAt: estimate.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.estimates) {
          state.estimates = state.estimates.map(estimate => ({
            ...estimate,
            createdAt: new Date(estimate.createdAt)
          }));
        }
      }
    }
  )
);