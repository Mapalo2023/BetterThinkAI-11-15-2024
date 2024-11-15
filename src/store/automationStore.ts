import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import { AutomationState, BusinessInfo, AutomationResult } from '../types/automation';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const useAutomationStore = create<AutomationState>()(
  persist(
    (set) => ({
      results: [],
      isLoading: false,
      error: null,

      generateAnalysis: async (info: BusinessInfo) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert business analyst and automation consultant. Analyze the business and provide detailed recommendations for automation and improvement opportunities."
              },
              {
                role: "user",
                content: `Analyze this business and provide automation recommendations:
                  Business Name: ${info.name}
                  Industry: ${info.industry}
                  Description: ${info.description}
                  Challenges: ${info.challenges.join(', ')}
                  Goals: ${info.goals.join(', ')}
                  
                  Provide the response in JSON format with the following structure:
                  {
                    "analysis": {
                      "efficiency": 1-100,
                      "potential": 1-100,
                      "risk": 1-100,
                      "roi": 1-100
                    },
                    "recommendations": [
                      {
                        "title": "string",
                        "description": "string",
                        "priority": "high" | "medium" | "low",
                        "impact": 1-100,
                        "timeframe": "string"
                      }
                    ],
                    "opportunities": [
                      {
                        "title": "string",
                        "description": "string",
                        "potentialValue": "string",
                        "requirements": ["string"]
                      }
                    ]
                  }`
              }
            ]
          });

          const analysisData = JSON.parse(completion.choices[0].message.content || '{}');
          
          const newResult: AutomationResult = {
            id: crypto.randomUUID(),
            businessInfo: info,
            ...analysisData,
            createdAt: new Date()
          };

          set((state) => ({ 
            results: [newResult, ...state.results],
            isLoading: false 
          }));

          toast.success('Business analysis completed!');
        } catch (error) {
          console.error('Error generating analysis:', error);
          set({ 
            error: 'Failed to generate analysis. Please try again.',
            isLoading: false 
          });
          toast.error('Failed to generate analysis');
        }
      },

      removeResult: (id) => set((state) => ({
        results: state.results.filter((result) => result.id !== id)
      }))
    }),
    {
      name: 'automation-storage',
      partialize: (state) => ({ 
        results: state.results.map(result => ({
          ...result,
          createdAt: result.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.results) {
          state.results = state.results.map(result => ({
            ...result,
            createdAt: new Date(result.createdAt)
          }));
        }
      }
    }
  )
);