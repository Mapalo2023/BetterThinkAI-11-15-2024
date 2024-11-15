import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Milestone {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  dependencies: string[];
  resources: string[];
  deliverables: string[];
}

interface Phase {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  risks: string[];
}

interface Timeline {
  id: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  analysis: {
    totalDuration: number;
    criticalPath: string[];
    riskLevel: 'high' | 'medium' | 'low';
    phases: Phase[];
    assumptions: string[];
    constraints: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface TimelinePlanningState {
  timelines: Timeline[];
  isLoading: boolean;
  error: string | null;
  generateTimeline: (
    projectName: string,
    description: string,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  removeTimeline: (id: string) => void;
}

const validateAnalysisResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.analysis === 'object' &&
    typeof data.analysis.totalDuration === 'number' &&
    Array.isArray(data.analysis.criticalPath) &&
    ['high', 'medium', 'low'].includes(data.analysis.riskLevel) &&
    Array.isArray(data.analysis.phases) &&
    Array.isArray(data.analysis.assumptions) &&
    Array.isArray(data.analysis.constraints) &&
    Array.isArray(data.recommendations)
  );
};

export const useTimelinePlanningStore = create<TimelinePlanningState>()(
  persist(
    (set) => ({
      timelines: [],
      isLoading: false,
      error: null,

      generateTimeline: async (
        projectName: string,
        description: string,
        startDate: string,
        endDate: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert project manager and timeline planner. Create a detailed project timeline with phases and milestones. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Generate a detailed project timeline:
                  Project Name: ${projectName}
                  Description: ${description}
                  Start Date: ${startDate}
                  End Date: ${endDate}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "totalDuration": <number of days>,
                      "criticalPath": <array of critical milestone titles>,
                      "riskLevel": <"high" | "medium" | "low">,
                      "phases": [
                        {
                          "name": <string>,
                          "description": <string>,
                          "startDate": <YYYY-MM-DD>,
                          "endDate": <YYYY-MM-DD>,
                          "milestones": [
                            {
                              "title": <string>,
                              "description": <string>,
                              "startDate": <YYYY-MM-DD>,
                              "endDate": <YYYY-MM-DD>,
                              "dependencies": <array of strings>,
                              "resources": <array of strings>,
                              "deliverables": <array of strings>
                            }
                          ],
                          "risks": <array of strings>
                        }
                      ],
                      "assumptions": <array of strings>,
                      "constraints": <array of strings>
                    },
                    "recommendations": <array of strings with timeline optimization suggestions>
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

          const newTimeline: Timeline = {
            id: crypto.randomUUID(),
            projectName,
            description,
            startDate,
            endDate,
            analysis: analysisData.analysis,
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            timelines: [newTimeline, ...state.timelines],
            isLoading: false 
          }));

          toast.success('Timeline generated successfully!');
        } catch (error: any) {
          console.error('Error generating timeline:', error);
          const errorMessage = error.message || 'Failed to generate timeline. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removeTimeline: (id) => set((state) => ({
        timelines: state.timelines.filter((timeline) => timeline.id !== id)
      }))
    }),
    {
      name: 'timeline-planning-storage',
      partialize: (state) => ({ 
        timelines: state.timelines.map(timeline => ({
          ...timeline,
          createdAt: timeline.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.timelines) {
          state.timelines = state.timelines.map(timeline => ({
            ...timeline,
            createdAt: new Date(timeline.createdAt)
          }));
        }
      }
    }
  )
);