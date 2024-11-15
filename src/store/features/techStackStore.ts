import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Technology {
  name: string;
  category: string;
  description: string;
  pros: string[];
  cons: string[];
  cost: 'free' | 'paid' | 'enterprise';
  learningCurve: 'low' | 'medium' | 'high';
  alternatives: string[];
}

interface TechStack {
  id: string;
  projectType: string;
  requirements: {
    scale: string;
    budget: string;
    teamExperience: string;
  };
  analysis: {
    frontend: Technology[];
    backend: Technology[];
    database: Technology[];
    devops: Technology[];
    testing: Technology[];
    monitoring: Technology[];
    considerations: string[];
    risks: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface TechStackState {
  stacks: TechStack[];
  isLoading: boolean;
  error: string | null;
  generateStack: (
    projectType: string,
    scale: string,
    budget: string,
    teamExperience: string
  ) => Promise<void>;
  removeStack: (id: string) => void;
}

const validateAnalysisResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.analysis === 'object' &&
    Array.isArray(data.analysis.frontend) &&
    Array.isArray(data.analysis.backend) &&
    Array.isArray(data.analysis.database) &&
    Array.isArray(data.analysis.devops) &&
    Array.isArray(data.analysis.testing) &&
    Array.isArray(data.analysis.monitoring) &&
    Array.isArray(data.analysis.considerations) &&
    Array.isArray(data.analysis.risks) &&
    Array.isArray(data.recommendations)
  );
};

export const useTechStackStore = create<TechStackState>()(
  persist(
    (set) => ({
      stacks: [],
      isLoading: false,
      error: null,

      generateStack: async (
        projectType: string,
        scale: string,
        budget: string,
        teamExperience: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert software architect and tech stack advisor. Analyze project requirements and provide comprehensive technology recommendations. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Recommend a tech stack for this project:
                  Project Type: ${projectType}
                  Scale & Performance: ${scale}
                  Budget: ${budget}
                  Team Experience: ${teamExperience}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "frontend": [
                        {
                          "name": <string>,
                          "category": <string>,
                          "description": <string>,
                          "pros": <array of strings>,
                          "cons": <array of strings>,
                          "cost": <"free" | "paid" | "enterprise">,
                          "learningCurve": <"low" | "medium" | "high">,
                          "alternatives": <array of strings>
                        }
                      ],
                      "backend": <array of technology objects>,
                      "database": <array of technology objects>,
                      "devops": <array of technology objects>,
                      "testing": <array of technology objects>,
                      "monitoring": <array of technology objects>,
                      "considerations": <array of strings>,
                      "risks": <array of strings>
                    },
                    "recommendations": <array of strings with implementation suggestions>
                  }`
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
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

          const newStack: TechStack = {
            id: crypto.randomUUID(),
            projectType,
            requirements: {
              scale,
              budget,
              teamExperience
            },
            analysis: analysisData.analysis,
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            stacks: [newStack, ...state.stacks],
            isLoading: false 
          }));

          toast.success('Tech stack recommendations generated successfully!');
        } catch (error: any) {
          console.error('Error generating tech stack:', error);
          const errorMessage = error.message || 'Failed to generate tech stack recommendations. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removeStack: (id) => set((state) => ({
        stacks: state.stacks.filter((stack) => stack.id !== id)
      }))
    }),
    {
      name: 'tech-stack-storage',
      partialize: (state) => ({ 
        stacks: state.stacks.map(stack => ({
          ...stack,
          createdAt: stack.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.stacks) {
          state.stacks = state.stacks.map(stack => ({
            ...stack,
            createdAt: new Date(stack.createdAt)
          }));
        }
      }
    }
  )
);