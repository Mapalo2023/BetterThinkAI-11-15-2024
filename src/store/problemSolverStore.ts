import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import { ProblemSolverState, ProblemInfo, Solution } from '../types/problemSolver';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const useProblemSolverStore = create<ProblemSolverState>()(
  persist(
    (set) => ({
      solutions: [],
      isLoading: false,
      error: null,

      generateSolution: async (info: ProblemInfo) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert problem solver and business analyst. Analyze the given problem and provide detailed solutions with implementation roadmap."
              },
              {
                role: "user",
                content: `Analyze this problem and provide a comprehensive solution:
                  Description: ${info.description}
                  Category: ${info.category}
                  Severity: ${info.severity}
                  Scope: ${info.scope}
                  Stakeholders: ${info.stakeholders.join(', ')}
                  Constraints: ${info.constraints.join(', ')}
                  
                  Provide the response in JSON format with the following structure:
                  {
                    "analysis": {
                      "summary": "string",
                      "impact": 1-100,
                      "urgency": 1-100,
                      "complexity": 1-100,
                      "rootCauses": ["string"]
                    },
                    "recommendations": [{
                      "title": "string",
                      "description": "string",
                      "priority": "low" | "medium" | "high",
                      "pros": ["string"],
                      "cons": ["string"],
                      "timeline": "string",
                      "estimatedCost": "string"
                    }],
                    "roadmap": [{
                      "phase": "string",
                      "tasks": ["string"],
                      "milestones": ["string"],
                      "risks": ["string"],
                      "duration": "string"
                    }],
                    "metrics": [{
                      "name": "string",
                      "description": "string",
                      "target": "string"
                    }],
                    "resources": [{
                      "title": "string",
                      "description": "string",
                      "url": "string",
                      "type": "article" | "video" | "tool" | "template"
                    }]
                  }`
              }
            ]
          });

          const solutionData = JSON.parse(completion.choices[0].message.content || '{}');
          
          const newSolution: Solution = {
            id: crypto.randomUUID(),
            problemInfo: info,
            ...solutionData,
            createdAt: new Date()
          };

          set((state) => ({ 
            solutions: [newSolution, ...state.solutions],
            isLoading: false 
          }));

          toast.success('Solution generated successfully!');
        } catch (error) {
          console.error('Error generating solution:', error);
          set({ 
            error: 'Failed to generate solution. Please try again.',
            isLoading: false 
          });
          toast.error('Failed to generate solution');
        }
      },

      removeSolution: (id) => set((state) => ({
        solutions: state.solutions.filter((solution) => solution.id !== id)
      }))
    }),
    {
      name: 'problem-solver-storage',
      partialize: (state) => ({ 
        solutions: state.solutions.map(solution => ({
          ...solution,
          createdAt: solution.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.solutions) {
          state.solutions = state.solutions.map(solution => ({
            ...solution,
            createdAt: new Date(solution.createdAt)
          }));
        }
      }
    }
  )
);