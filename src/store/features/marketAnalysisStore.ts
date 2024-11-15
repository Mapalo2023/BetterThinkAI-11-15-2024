import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
  threat: 'high' | 'medium' | 'low';
}

interface MarketSegment {
  name: string;
  size: number;
  growth: number;
  description: string;
  opportunities: string[];
  challenges: string[];
}

interface MarketAnalysis {
  id: string;
  industry: string;
  targetMarket: string;
  competitors: Competitor[];
  region: string;
  analysis: {
    marketSize: number;
    growthRate: number;
    segments: MarketSegment[];
    trends: string[];
    barriers: string[];
    risks: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface MarketAnalysisState {
  analyses: MarketAnalysis[];
  isLoading: boolean;
  error: string | null;
  analyzeMarket: (
    industry: string,
    targetMarket: string,
    competitors: string[],
    region: string
  ) => Promise<void>;
  removeAnalysis: (id: string) => void;
}

const validateAnalysisResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.analysis === 'object' &&
    typeof data.analysis.marketSize === 'number' &&
    typeof data.analysis.growthRate === 'number' &&
    Array.isArray(data.analysis.segments) &&
    Array.isArray(data.analysis.trends) &&
    Array.isArray(data.analysis.barriers) &&
    Array.isArray(data.analysis.risks) &&
    Array.isArray(data.competitors) &&
    Array.isArray(data.recommendations)
  );
};

export const useMarketAnalysisStore = create<MarketAnalysisState>()(
  persist(
    (set) => ({
      analyses: [],
      isLoading: false,
      error: null,

      analyzeMarket: async (
        industry: string,
        targetMarket: string,
        competitors: string[],
        region: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert market analyst. Analyze the given market and provide detailed insights. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Analyze this market:
                  Industry: ${industry}
                  Target Market: ${targetMarket}
                  Competitors: ${competitors.join(', ')}
                  Region: ${region}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "marketSize": <number in millions USD>,
                      "growthRate": <number as percentage>,
                      "segments": [
                        {
                          "name": <string>,
                          "size": <number in millions USD>,
                          "growth": <number as percentage>,
                          "description": <string>,
                          "opportunities": <array of strings>,
                          "challenges": <array of strings>
                        }
                      ],
                      "trends": <array of strings>,
                      "barriers": <array of strings>,
                      "risks": <array of strings>
                    },
                    "competitors": [
                      {
                        "name": <string>,
                        "strengths": <array of strings>,
                        "weaknesses": <array of strings>,
                        "marketShare": <number as percentage>,
                        "threat": <"high" | "medium" | "low">
                      }
                    ],
                    "recommendations": <array of strings with actionable market strategies>
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

          const newAnalysis: MarketAnalysis = {
            id: crypto.randomUUID(),
            industry,
            targetMarket,
            region,
            competitors: analysisData.competitors,
            analysis: {
              marketSize: Math.max(0, analysisData.analysis.marketSize),
              growthRate: analysisData.analysis.growthRate,
              segments: analysisData.analysis.segments,
              trends: analysisData.analysis.trends,
              barriers: analysisData.analysis.barriers,
              risks: analysisData.analysis.risks
            },
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            analyses: [newAnalysis, ...state.analyses],
            isLoading: false 
          }));

          toast.success('Market analysis completed successfully!');
        } catch (error: any) {
          console.error('Error analyzing market:', error);
          const errorMessage = error.message || 'Failed to analyze market. Please try again.';
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
      name: 'market-analysis-storage',
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