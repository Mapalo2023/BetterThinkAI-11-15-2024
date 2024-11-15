import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, collection, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  DesignThinkingState,
  UserResearch,
  ProblemStatement,
  IdeaCard,
  Prototype,
  TestResult,
  Comment
} from '../types/designThinking';
import toast from 'react-hot-toast';

export const useDesignThinkingStore = create<DesignThinkingState>()(
  persist(
    (set, get) => ({
      currentStage: 'empathize',
      research: [],
      problemStatements: [],
      ideas: [],
      prototypes: [],
      testResults: [],
      isLoading: false,
      error: null,

      setCurrentStage: (stage) => set({ currentStage: stage }),

      addResearch: async (research) => {
        set({ isLoading: true, error: null });
        try {
          const docRef = await addDoc(collection(db, 'research'), {
            ...research,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          const newResearch: UserResearch = {
            id: docRef.id,
            ...research,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          set((state) => ({
            research: [newResearch, ...state.research],
            isLoading: false,
            error: null
          }));

          return newResearch;
        } catch (error: any) {
          console.error('Error adding research:', error);
          set({ 
            error: error.message || 'Failed to add research', 
            isLoading: false 
          });
          throw error;
        }
      },

      updateResearch: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const docRef = doc(db, 'research', id);
          await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
          });

          set((state) => ({
            research: state.research.map((item) => 
              item.id === id 
                ? { ...item, ...updates, updatedAt: new Date() }
                : item
            ),
            isLoading: false,
            error: null
          }));
        } catch (error: any) {
          console.error('Error updating research:', error);
          set({ 
            error: error.message || 'Failed to update research', 
            isLoading: false 
          });
          throw error;
        }
      },

      deleteResearch: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await deleteDoc(doc(db, 'research', id));

          set((state) => ({
            research: state.research.filter((item) => item.id !== id),
            isLoading: false,
            error: null
          }));
        } catch (error: any) {
          console.error('Error deleting research:', error);
          set({ 
            error: error.message || 'Failed to delete research', 
            isLoading: false 
          });
          throw error;
        }
      },

      // ... rest of the store implementation remains the same
    }),
    {
      name: 'design-thinking-storage',
      partialize: (state) => ({
        currentStage: state.currentStage,
        research: state.research.map(r => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString()
        })),
        problemStatements: state.problemStatements.map(p => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        })),
        ideas: state.ideas.map(i => ({
          ...i,
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.updatedAt.toISOString(),
          comments: i.comments.map(c => ({
            ...c,
            createdAt: c.createdAt.toISOString()
          }))
        })),
        prototypes: state.prototypes.map(p => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        })),
        testResults: state.testResults.map(t => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString()
        }))
      })
    }
  )
);