import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ResourceRequirement {
  role: string;
  count: number;
  skills: string[];
  experience: string;
  cost: number;
  availability: string;
}

interface ResourcePlan {
  id: string;
  projectName: string;
  description: string;
  duration: number;
  budget: number;
  analysis: {
    totalCost: number;
    monthlyBurn: number;
    requirements: ResourceRequirement[];
    timeline: {
      phase: string;
      resources: string[];
      duration: string;
    }[];
    risks: string[];
    constraints: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface ResourcePlanningState {
  plans: ResourcePlan[];
  isLoading: boolean;
  error: string | null;
  generatePlan: (
    projectName: string,
    description: string,
    duration: number,
    budget: number,
    skills: string[]
  ) => Promise<void>;
  removePlan: (id: string) => void;
}

const validateAnalysisResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.analysis === 'object' &&
    typeof data.analysis.totalCost === 'number' &&
    typeof data.analysis.monthlyBurn === 'number' &&
    Array.isArray(data.analysis.requirements) &&
    Array.isArray(data.analysis.timeline) &&
    Array.isArray(data.analysis.risks) &&
    Array.isArray(data.analysis.constraints) &&
    Array.isArray(data.recommendations)
  );
};

export const useResourcePlanningStore = create<ResourcePlanningState>()(
  persist(
    (set) => ({
      plans: [],
      isLoading: false,
      error: null,

      generatePlan: async (
        projectName: string,
        description: string,
        duration: number,
        budget: number,
        skills: string[]
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert resource planner and project manager. Create detailed resource allocation plans with cost analysis. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Generate a detailed resource plan:
                  Project Name: ${projectName}
                  Description: ${description}
                  Duration (months): ${duration}
                  Budget: $${budget}
                  Required Skills: ${skills.join(', ')}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "totalCost": <total cost in USD>,
                      "monthlyBurn": <monthly burn rate in USD>,
                      "requirements": [
                        {
                          "role": <string>,
                          "count": <number>,
                          "skills": <array of strings>,
                          "experience": <string>,
                          "cost": <monthly cost in USD>,
                          "availability": <string>
                        }
                      ],
                      "timeline": [
                        {
                          "phase": <string>,
                          "resources": <array of strings>,
                          "duration": <string>
                        }
                      ],
                      "risks": <array of strings>,
                      "constraints": <array of strings>
                    },
                    "recommendations": <array of strings with resource optimization suggestions>
                  }`
              }
            ],
            temperature: 0.7,
            max_tokens: 1500
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

          const newPlan: ResourcePlan = {
            id: crypto.randomUUID(),
            projectName,
            description,
            duration,
            budget,
            analysis: {
              totalCost: Math.max(0, analysisData.analysis.totalCost),
              monthlyBurn: Math.max(0, analysisData.analysis.monthlyBurn),
              requirements: analysisData.analysis.requirements,
              timeline: analysisData.analysis.timeline,
              risks: analysisData.analysis.risks,
              constraints: analysisData.analysis.constraints
            },
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            plans: [newPlan, ...state.plans],
            isLoading: false 
          }));

          toast.success('Resource plan generated successfully!');
        } catch (error: any) {
          console.error('Error generating plan:', error);
          const errorMessage = error.message || 'Failed to generate resource plan. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removePlan: (id) => set((state) => ({
        plans: state.plans.filter((plan) => plan.id !== id)
      }))
    }),
    {
      name: 'resource-planning-storage',
      partialize: (state) => ({ 
        plans: state.plans.map(plan => ({
          ...plan,
          createdAt: plan.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.plans) {
          state.plans = state.plans.map(plan => ({
            ...plan,
            createdAt: new Date(plan.createdAt)
          }));
        }
      }
    }
  )
);