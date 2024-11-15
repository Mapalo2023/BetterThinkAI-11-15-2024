import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface FundingSource {
  type: string;
  description: string;
  amount: number;
  requirements: string[];
  pros: string[];
  cons: string[];
  timeline: string;
}

interface FundingStrategy {
  id: string;
  stage: string;
  industry: string;
  monthlyRevenue: number;
  fundingRequired: number;
  useOfFunds: string;
  analysis: {
    totalFunding: number;
    valuation: number;
    sources: FundingSource[];
    timeline: {
      phase: string;
      activities: string[];
      duration: string;
    }[];
    risks: string[];
    metrics: {
      name: string;
      target: string;
      importance: 'high' | 'medium' | 'low';
    }[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface FundingStrategyState {
  strategies: FundingStrategy[];
  isLoading: boolean;
  error: string | null;
  generateStrategy: (
    stage: string,
    industry: string,
    monthlyRevenue: number,
    fundingRequired: number,
    useOfFunds: string
  ) => Promise<void>;
  removeStrategy: (id: string) => void;
}

const validateAnalysisResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.analysis === 'object' &&
    typeof data.analysis.totalFunding === 'number' &&
    typeof data.analysis.valuation === 'number' &&
    Array.isArray(data.analysis.sources) &&
    Array.isArray(data.analysis.timeline) &&
    Array.isArray(data.analysis.risks) &&
    Array.isArray(data.analysis.metrics) &&
    Array.isArray(data.recommendations)
  );
};

export const useFundingStrategyStore = create<FundingStrategyState>()(
  persist(
    (set) => ({
      strategies: [],
      isLoading: false,
      error: null,

      generateStrategy: async (
        stage: string,
        industry: string,
        monthlyRevenue: number,
        fundingRequired: number,
        useOfFunds: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert startup advisor and funding strategist. Create detailed funding strategies with valuation analysis. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Generate a detailed funding strategy:
                  Stage: ${stage}
                  Industry: ${industry}
                  Monthly Revenue: $${monthlyRevenue}
                  Funding Required: $${fundingRequired}
                  Use of Funds: ${useOfFunds}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "totalFunding": <total funding needed in USD>,
                      "valuation": <estimated valuation in USD>,
                      "sources": [
                        {
                          "type": <string>,
                          "description": <string>,
                          "amount": <number in USD>,
                          "requirements": <array of strings>,
                          "pros": <array of strings>,
                          "cons": <array of strings>,
                          "timeline": <string>
                        }
                      ],
                      "timeline": [
                        {
                          "phase": <string>,
                          "activities": <array of strings>,
                          "duration": <string>
                        }
                      ],
                      "risks": <array of strings>,
                      "metrics": [
                        {
                          "name": <string>,
                          "target": <string>,
                          "importance": <"high" | "medium" | "low">
                        }
                      ]
                    },
                    "recommendations": <array of strings with funding strategy suggestions>
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

          const newStrategy: FundingStrategy = {
            id: crypto.randomUUID(),
            stage,
            industry,
            monthlyRevenue,
            fundingRequired,
            useOfFunds,
            analysis: {
              totalFunding: Math.max(0, analysisData.analysis.totalFunding),
              valuation: Math.max(0, analysisData.analysis.valuation),
              sources: analysisData.analysis.sources,
              timeline: analysisData.analysis.timeline,
              risks: analysisData.analysis.risks,
              metrics: analysisData.analysis.metrics
            },
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            strategies: [newStrategy, ...state.strategies],
            isLoading: false 
          }));

          toast.success('Funding strategy generated successfully!');
        } catch (error: any) {
          console.error('Error generating strategy:', error);
          const errorMessage = error.message || 'Failed to generate funding strategy. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removeStrategy: (id) => set((state) => ({
        strategies: state.strategies.filter((strategy) => strategy.id !== id)
      }))
    }),
    {
      name: 'funding-strategy-storage',
      partialize: (state) => ({ 
        strategies: state.strategies.map(strategy => ({
          ...strategy,
          createdAt: strategy.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.strategies) {
          state.strategies = state.strategies.map(strategy => ({
            ...strategy,
            createdAt: new Date(strategy.createdAt)
          }));
        }
      }
    }
  )
);