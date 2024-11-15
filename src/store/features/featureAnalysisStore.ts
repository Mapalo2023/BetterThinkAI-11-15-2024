import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Feature {
  id: string;
  name: string;
  description: string;
  analysis: {
    impact: number;
    feasibility: number;
    priority: 'high' | 'medium' | 'low';
    timeEstimate: string;
    dependencies: string[];
    risks: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface FeatureAnalysisState {
  features: Feature[];
  isLoading: boolean;
  error: string | null;
  analyzeFeature: (name: string, description: string) => Promise<void>;
  removeFeature: (id: string) => void;
}

const validateAnalysisResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.analysis === 'object' &&
    typeof data.analysis.impact === 'number' &&
    typeof data.analysis.feasibility === 'number' &&
    ['high', 'medium', 'low'].includes(data.analysis.priority) &&
    typeof data.analysis.timeEstimate === 'string' &&
    Array.isArray(data.analysis.dependencies) &&
    Array.isArray(data.analysis.risks) &&
    Array.isArray(data.recommendations)
  );
};

export const useFeatureAnalysisStore = create<FeatureAnalysisState>()(
  persist(
    (set) => ({
      features: [],
      isLoading: false,
      error: null,

      analyzeFeature: async (name: string, description: string) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert product manager and feature analyst. Analyze the given feature and provide detailed insights. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Analyze this feature and provide a detailed assessment:
                  Name: ${name}
                  Description: ${description}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "impact": <number between 1-100>,
                      "feasibility": <number between 1-100>,
                      "priority": <"high" | "medium" | "low">,
                      "timeEstimate": <string describing implementation time>,
                      "dependencies": <array of strings listing technical and business dependencies>,
                      "risks": <array of strings describing potential risks>
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

          const newFeature: Feature = {
            id: crypto.randomUUID(),
            name,
            description,
            analysis: {
              impact: Math.min(100, Math.max(1, analysisData.analysis.impact)),
              feasibility: Math.min(100, Math.max(1, analysisData.analysis.feasibility)),
              priority: analysisData.analysis.priority,
              timeEstimate: analysisData.analysis.timeEstimate,
              dependencies: analysisData.analysis.dependencies,
              risks: analysisData.analysis.risks
            },
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            features: [newFeature, ...state.features],
            isLoading: false 
          }));

          toast.success('Feature analysis completed successfully!');
        } catch (error: any) {
          console.error('Error analyzing feature:', error);
          const errorMessage = error.message || 'Failed to analyze feature. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removeFeature: (id) => set((state) => ({
        features: state.features.filter((feature) => feature.id !== id)
      }))
    }),
    {
      name: 'feature-analysis-storage',
      partialize: (state) => ({ 
        features: state.features.map(feature => ({
          ...feature,
          createdAt: feature.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.features) {
          state.features = state.features.map(feature => ({
            ...feature,
            createdAt: new Date(feature.createdAt)
          }));
        }
      }
    }
  )
);