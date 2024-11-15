import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Metric {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'above' | 'below' | 'on-track';
  insights: string[];
}

interface GrowthAnalysis {
  id: string;
  businessModel: string;
  mrr: number;
  customerCount: number;
  growthGoals: string;
  analysis: {
    metrics: Metric[];
    projections: {
      timeframe: string;
      revenue: number;
      customers: number;
      probability: number;
    }[];
    challenges: string[];
    opportunities: string[];
    kpis: {
      name: string;
      current: number;
      target: number;
      importance: 'high' | 'medium' | 'low';
    }[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface GrowthMetricsState {
  analyses: GrowthAnalysis[];
  isLoading: boolean;
  error: string | null;
  generateAnalysis: (
    businessModel: string,
    mrr: number,
    customerCount: number,
    growthGoals: string
  ) => Promise<void>;
  removeAnalysis: (id: string) => void;
}

export const useGrowthMetricsStore = create<GrowthMetricsState>()(
  persist(
    (set) => ({
      analyses: [],
      isLoading: false,
      error: null,

      generateAnalysis: async (
        businessModel: string,
        mrr: number,
        customerCount: number,
        growthGoals: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert growth analyst. Analyze business metrics and provide detailed growth insights and recommendations. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Generate a detailed growth analysis for:
                  Business Model: ${businessModel}
                  Monthly Recurring Revenue: $${mrr}
                  Customer Count: ${customerCount}
                  Growth Goals: ${growthGoals}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "metrics": [
                        {
                          "name": <string>,
                          "value": <number>,
                          "target": <number>,
                          "trend": <"up" | "down" | "stable">,
                          "status": <"above" | "below" | "on-track">,
                          "insights": <array of strings>
                        }
                      ],
                      "projections": [
                        {
                          "timeframe": <string>,
                          "revenue": <number>,
                          "customers": <number>,
                          "probability": <number>
                        }
                      ],
                      "challenges": <array of strings>,
                      "opportunities": <array of strings>,
                      "kpis": [
                        {
                          "name": <string>,
                          "current": <number>,
                          "target": <number>,
                          "importance": <"high" | "medium" | "low">
                        }
                      ]
                    },
                    "recommendations": <array of strings with actionable growth suggestions>
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

          const newAnalysis: GrowthAnalysis = {
            id: crypto.randomUUID(),
            businessModel,
            mrr,
            customerCount,
            growthGoals,
            analysis: analysisData.analysis,
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            analyses: [newAnalysis, ...state.analyses],
            isLoading: false 
          }));

          toast.success('Growth analysis generated successfully!');
        } catch (error: any) {
          console.error('Error generating analysis:', error);
          const errorMessage = error.message || 'Failed to generate growth analysis. Please try again.';
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
      name: 'growth-metrics-storage',
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