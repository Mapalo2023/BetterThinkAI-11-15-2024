import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import { BrainstormState, Idea, IdeaPrompt, SIPAnalysis } from '../types/brainstorm';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const useBrainstormStore = create<BrainstormState>()(
  persist(
    (set, get) => ({
      ideas: [],
      isLoading: false,
      error: null,

      addIdea: (idea) => set((state) => ({ 
        ideas: [idea, ...state.ideas] 
      })),

      removeIdea: (id) => set((state) => ({ 
        ideas: state.ideas.filter((idea) => idea.id !== id) 
      })),

      evaluateIdea: async (id) => {
        const idea = get().ideas.find(i => i.id === id);
        if (!idea) return;

        set({ isLoading: true });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert startup advisor conducting SIP/SPIT analysis. SIP means the idea is worth pursuing, SPIT means it should be discarded."
              },
              {
                role: "user",
                content: `Evaluate this startup idea and provide a SIP/SPIT analysis:
                  Title: ${idea.title}
                  Description: ${idea.description}
                  
                  Provide the response in JSON format:
                  {
                    "verdict": "SIP" or "SPIT",
                    "score": 0-100,
                    "reasoning": ["reason1", "reason2", ...],
                    "recommendations": ["recommendation1", "recommendation2", ...]
                  }`
              }
            ]
          });

          const analysis: SIPAnalysis = JSON.parse(completion.choices[0].message.content || '{}');

          set((state) => ({
            ideas: state.ideas.map(i => 
              i.id === id ? { ...i, sipAnalysis: analysis } : i
            ),
            isLoading: false
          }));

          toast.success('SIP/SPIT analysis completed!');
        } catch (error) {
          console.error('Error evaluating idea:', error);
          set({ isLoading: false });
          toast.error('Failed to evaluate idea');
        }
      },

      addManualIdea: async (title: string, description: string) => {
        set({ isLoading: true });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert startup advisor. Analyze this startup idea and provide detailed metrics."
              },
              {
                role: "user",
                content: `Analyze this startup idea:
                  Title: ${title}
                  Description: ${description}
                  
                  Provide the response in JSON format:
                  {
                    "analysis": {
                      "marketPotential": 1-100,
                      "innovationScore": 1-100,
                      "feasibilityScore": 1-100,
                      "riskLevel": 1-100
                    },
                    "swotAnalysis": {
                      "strengths": ["strength1", "strength2"],
                      "weaknesses": ["weakness1", "weakness2"],
                      "opportunities": ["opportunity1", "opportunity2"],
                      "threats": ["threat1", "threat2"]
                    }
                  }`
              }
            ]
          });

          const analysisData = JSON.parse(completion.choices[0].message.content || '{}');
          
          const newIdea: Idea = {
            id: crypto.randomUUID(),
            title,
            description,
            ...analysisData,
            createdAt: new Date(),
            source: 'USER'
          };

          set((state) => ({ 
            ideas: [newIdea, ...state.ideas],
            isLoading: false 
          }));

          toast.success('Manual idea added and analyzed!');
        } catch (error) {
          console.error('Error analyzing manual idea:', error);
          set({ 
            error: 'Failed to analyze idea. Please try again.',
            isLoading: false 
          });
          toast.error('Failed to analyze idea');
        }
      },

      generateIdea: async (prompt) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert startup advisor and business analyst. Generate innovative startup ideas and provide detailed analysis."
              },
              {
                role: "user",
                content: `Generate a startup idea with the following parameters:
                  Industry: ${prompt.industry || 'Any'}
                  Target Market: ${prompt.targetMarket || 'Global'}
                  Problem Statement: ${prompt.problemStatement || 'Open to opportunities'}
                  Constraints: ${prompt.constraints || 'None'}
                  
                  Provide the response in JSON format with the following structure:
                  {
                    "title": "Startup Name",
                    "description": "Detailed description",
                    "analysis": {
                      "marketPotential": 1-100,
                      "innovationScore": 1-100,
                      "feasibilityScore": 1-100,
                      "riskLevel": 1-100
                    },
                    "swotAnalysis": {
                      "strengths": ["strength1", "strength2"],
                      "weaknesses": ["weakness1", "weakness2"],
                      "opportunities": ["opportunity1", "opportunity2"],
                      "threats": ["threat1", "threat2"]
                    }
                  }`
              }
            ]
          });

          const ideaData = JSON.parse(completion.choices[0].message.content || '{}');
          
          const newIdea: Idea = {
            id: crypto.randomUUID(),
            ...ideaData,
            createdAt: new Date(),
            source: 'AI'
          };

          set((state) => ({ 
            ideas: [newIdea, ...state.ideas],
            isLoading: false 
          }));

          toast.success('New idea generated!');
        } catch (error) {
          console.error('Error generating idea:', error);
          set({ 
            error: 'Failed to generate idea. Please try again.',
            isLoading: false 
          });
          toast.error('Failed to generate idea');
        }
      }
    }),
    {
      name: 'brainstorm-storage',
      partialize: (state) => ({ 
        ideas: state.ideas.map(idea => ({
          ...idea,
          createdAt: idea.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        // Convert ISO date strings back to Date objects
        if (state?.ideas) {
          state.ideas = state.ideas.map(idea => ({
            ...idea,
            createdAt: new Date(idea.createdAt)
          }));
        }
      }
    }
  )
);