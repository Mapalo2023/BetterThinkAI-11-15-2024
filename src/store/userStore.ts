import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserCredits, Subscription } from '../types/user';
import toast from 'react-hot-toast';

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile | null) => void;
  loadProfile: (userId: string) => Promise<void>;
  updateCredits: (credits: Partial<UserCredits>) => Promise<void>;
  updateSubscription: (subscription: Partial<Subscription>) => Promise<void>;
  setCustomApiKey: (apiKey: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,
      error: null,

      setProfile: (profile) => set({ profile }),

      loadProfile: async (userId) => {
        set({ loading: true, error: null });
        try {
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            set({ 
              profile: {
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
                subscription: {
                  ...data.subscription,
                  startDate: data.subscription.startDate.toDate(),
                  endDate: data.subscription.endDate.toDate()
                }
              }
            });
          } else {
            // Create default profile for new users
            const defaultProfile: UserProfile = {
              id: userId,
              email: '',
              role: 'user',
              subscription: {
                id: crypto.randomUUID(),
                userId,
                plan: 'free',
                status: 'active',
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                features: ['basic_ai']
              },
              credits: {
                available: 10,
                total: 10,
                lastUpdated: new Date()
              },
              createdAt: new Date(),
              updatedAt: new Date()
            };

            await setDoc(docRef, defaultProfile);
            set({ profile: defaultProfile });
          }
        } catch (error: any) {
          console.error('Error loading profile:', error);
          set({ error: error.message });
          toast.error('Failed to load user profile');
        } finally {
          set({ loading: false });
        }
      },

      updateCredits: async (credits) => {
        const { profile } = get();
        if (!profile) return;

        try {
          const updatedCredits = {
            ...profile.credits,
            ...credits,
            lastUpdated: new Date()
          };

          await updateDoc(doc(db, 'users', profile.id), {
            credits: updatedCredits
          });

          set({ 
            profile: { 
              ...profile, 
              credits: updatedCredits 
            } 
          });

          toast.success('Credits updated successfully');
        } catch (error: any) {
          console.error('Error updating credits:', error);
          toast.error('Failed to update credits');
        }
      },

      updateSubscription: async (subscription) => {
        const { profile } = get();
        if (!profile) return;

        try {
          const updatedSubscription = {
            ...profile.subscription,
            ...subscription
          };

          await updateDoc(doc(db, 'users', profile.id), {
            subscription: updatedSubscription
          });

          set({ 
            profile: { 
              ...profile, 
              subscription: updatedSubscription 
            } 
          });

          toast.success('Subscription updated successfully');
        } catch (error: any) {
          console.error('Error updating subscription:', error);
          toast.error('Failed to update subscription');
        }
      },

      setCustomApiKey: async (apiKey) => {
        const { profile } = get();
        if (!profile || profile.subscription.plan !== 'enterprise') {
          toast.error('Custom API keys are only available for enterprise users');
          return;
        }

        try {
          const updatedSubscription = {
            ...profile.subscription,
            customApiKey: apiKey
          };

          await updateDoc(doc(db, 'users', profile.id), {
            subscription: updatedSubscription
          });

          set({ 
            profile: { 
              ...profile, 
              subscription: updatedSubscription 
            } 
          });

          toast.success('Custom API key updated successfully');
        } catch (error: any) {
          console.error('Error setting custom API key:', error);
          toast.error('Failed to update custom API key');
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        profile: state.profile ? {
          ...state.profile,
          createdAt: state.profile.createdAt.toISOString(),
          updatedAt: state.profile.updatedAt.toISOString(),
          subscription: {
            ...state.profile.subscription,
            startDate: state.profile.subscription.startDate.toISOString(),
            endDate: state.profile.subscription.endDate.toISOString()
          }
        } : null
      })
    }
  )
);