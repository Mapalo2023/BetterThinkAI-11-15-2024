import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface PivotOption {
  model: string;
  description: string;
  marketSize: number;
  competitionLevel: 'high' | 'medium' | 'low';
  feasibility: number;
  timeToMarket: string;
  resourceRequirements: string[];
  risks: string[];
  benefits: string[];
}

interface PivotAnalysis {
  id: string;
  currentModel: string;
  challenges: string[];
  marketChanges: string[];
  coreStrengths: string[];
  analysis: {
    pivotNecessity: 'high' | 'medium' | 'low';
    urgency: 'immediate' | 'medium-term' | 'long-term';
    options: PivotOption[];
    impactAssessment: {
      category: string;
      impact: 'positive' | 'negative' | 'neutral';
      details: string[];
    }[];
    retainableAssets: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface PivotAnalysisState {
  analyses: PivotAnalysis[];
  isLoading: boolean;
  error: string | null;
  generateAnalysis: (
    currentModel: string,
    challenges: string[],
    marketChanges: string[],
    coreStrengths: string[]
  ) => Promise<void>;
  removeAnalysis: (id: string) => void;
}

export const usePivotAnalysisStore = create<PivotAnalysisState>()(
  persist(
    (set) => ({
      analyses: [],
      isLoading: false,
      error: null,

      generateAnalysis: async (
        currentModel: string,
        challenges: string[],
        marketChanges: string[],
        coreStrengths: string[]
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert business strategist specializing in pivot analysis. Analyze the current business model and market conditions to provide strategic pivot recommendations. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Analyze pivot opportunities for:
                  Current Business Model: ${currentModel}
                  Key Challenges: ${challenges.join(', ')}
                  Market Changes: ${marketChanges.join(', ')}
                  Core Strengths: ${coreStrengths.join(', ')}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "pivotNecessity": <"high" | "medium" | "low">,
                      "urgency": <"immediate" | "medium-term" | "long-term">,
                      "options": [
                        {
                          "model": <string>,
                          "description": <string>,
                          "marketSize": <number in millions USD>,
                          "competitionLevel": <"high" | "medium" | "low">,
                          "feasibility": <number between 1-100>,
                          "timeToMarket": <string>,
                          "resourceRequirements": <array of strings>,
                          "risks": <array of strings>,
                          "benefits": <array of strings>
                        }
                      ],
                      "impactAssessment": [
                        {
                          "category": <string>,
                          "impact": <"positive" | "negative" | "neutral">,
                          "details": <array of strings>
                        }
                      ],
                      "retainableAssets": <array of strings>
                    },
                    "recommendations": <array of strings with strategic pivot suggestions>
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

          const newAnalysis: PivotAnalysis = {
            id: crypto.randomUUID(),
            currentModel,
            challenges,
            marketChanges,
            coreStrengths,
            analysis: analysisData.analysis,
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            analyses: [newAnalysis, ...state.analyses],
            isLoading: false 
          }));

          toast.success('Pivot analysis generated successfully!');
        } catch (error: any) {
          console.error('Error generating analysis:', error);
          const errorMessage = error.message || 'Failed to generate pivot analysis. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removeAnalysis: (id) => set((state) => ({
        analyses: state.analyses.filter((analysis) => analysis.id !== id)
      }))
    }),
    {
      name: 'pivot-analysis-storage',
      partialize: (state) => ({ 
        analyses: state.analyses.map(analysis => ({
          ...analysis,
          createdAt: analysis.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.analyses) {
          state.analyses = state.analyses.map(analysis => ({
            ...analysis,
            createdAt: new Date(analysis.createdAt)
          }));
        }
      }
    }
  )
);