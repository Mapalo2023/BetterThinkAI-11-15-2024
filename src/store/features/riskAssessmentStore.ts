import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Risk {
  id: string;
  name: string;
  description: string;
  category: string;
  analysis: {
    probability: number;
    impact: number;
    severity: 'high' | 'medium' | 'low';
    urgency: number;
    mitigation: string[];
    contingency: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface RiskAssessmentState {
  risks: Risk[];
  isLoading: boolean;
  error: string | null;
  analyzeRisk: (name: string, description: string, category: string) => Promise<void>;
  removeRisk: (id: string) => void;
}

const validateAnalysisResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.analysis === 'object' &&
    typeof data.analysis.probability === 'number' &&
    typeof data.analysis.impact === 'number' &&
    typeof data.analysis.urgency === 'number' &&
    ['high', 'medium', 'low'].includes(data.analysis.severity) &&
    Array.isArray(data.analysis.mitigation) &&
    Array.isArray(data.analysis.contingency) &&
    Array.isArray(data.recommendations)
  );
};

export const useRiskAssessmentStore = create<RiskAssessmentState>()(
  persist(
    (set) => ({
      risks: [],
      isLoading: false,
      error: null,

      analyzeRisk: async (name: string, description: string, category: string) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert risk analyst. Analyze the given risk and provide detailed insights. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Analyze this risk and provide a detailed assessment:
                  Name: ${name}
                  Description: ${description}
                  Category: ${category}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "probability": <number between 1-100>,
                      "impact": <number between 1-100>,
                      "severity": <"high" | "medium" | "low">,
                      "urgency": <number between 1-100>,
                      "mitigation": <array of strings with mitigation strategies>,
                      "contingency": <array of strings with contingency plans>
                    },
                    "recommendations": <array of strings with actionable recommendations>
                  }
                  
                  Ensure all number values are between 1-100 and all arrays contain at least one item.`
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

          const newRisk: Risk = {
            id: crypto.randomUUID(),
            name,
            description,
            category,
            analysis: {
              probability: Math.min(100, Math.max(1, analysisData.analysis.probability)),
              impact: Math.min(100, Math.max(1, analysisData.analysis.impact)),
              severity: analysisData.analysis.severity,
              urgency: Math.min(100, Math.max(1, analysisData.analysis.urgency)),
              mitigation: analysisData.analysis.mitigation,
              contingency: analysisData.analysis.contingency
            },
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            risks: [newRisk, ...state.risks],
            isLoading: false 
          }));

          toast.success('Risk analysis completed successfully!');
        } catch (error: any) {
          console.error('Error analyzing risk:', error);
          const errorMessage = error.message || 'Failed to analyze risk. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removeRisk: (id) => set((state) => ({
        risks: state.risks.filter((risk) => risk.id !== id)
      }))
    }),
    {
      name: 'risk-assessment-storage',
      partialize: (state) => ({ 
        risks: state.risks.map(risk => ({
          ...risk,
          createdAt: risk.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.risks) {
          state.risks = state.risks.map(risk => ({
            ...risk,
            createdAt: new Date(risk.createdAt)
          }));
        }
      }
    }
  )
);