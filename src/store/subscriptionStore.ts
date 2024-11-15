import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Subscription, Credits, SubscriptionTier } from '../types/subscription';
import toast from 'react-hot-toast';

interface SubscriptionState {
  subscription: Subscription | null;
  credits: Credits | null;
  loading: boolean;
  error: string | null;
  fetchSubscription: (userId: string) => Promise<void>;
  fetchCredits: (userId: string) => Promise<void>;
  updateSubscription: (userId: string, tier: SubscriptionTier) => Promise<void>;
  updateCredits: (userId: string, amount: number) => Promise<void>;
  setCustomApiKey: (userId: string, apiKey: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: null,
      credits: null,
      loading: false,
      error: null,

      fetchSubscription: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const docRef = doc(db, 'subscriptions', userId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as Subscription;
            set({ subscription: {
              ...data,
              startDate: data.startDate.toDate(),
              endDate: data.endDate.toDate()
            }});
          }
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Failed to fetch subscription');
        } finally {
          set({ loading: false });
        }
      },

      fetchCredits: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const docRef = doc(db, 'credits', userId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as Credits;
            set({ credits: {
              ...data,
              lastUpdated: data.lastUpdated.toDate()
            }});
          }
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Failed to fetch credits');
        } finally {
          set({ loading: false });
        }
      },

      updateSubscription: async (userId: string, tier: SubscriptionTier) => {
        set({ loading: true, error: null });
        try {
          const subscription: Subscription = {
            id: userId,
            userId,
            tier,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            status: 'active',
            features: getFeaturesByTier(tier)
          };

          await setDoc(doc(db, 'subscriptions', userId), subscription);
          set({ subscription });
          toast.success('Subscription updated successfully');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Failed to update subscription');
        } finally {
          set({ loading: false });
        }
      },

      updateCredits: async (userId: string, amount: number) => {
        set({ loading: true, error: null });
        try {
          const credits: Credits = {
            id: userId,
            userId,
            amount,
            lastUpdated: new Date()
          };

          await setDoc(doc(db, 'credits', userId), credits);
          set({ credits });
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Failed to update credits');
        } finally {
          set({ loading: false });
        }
      },

      setCustomApiKey: async (userId: string, apiKey: string) => {
        set({ loading: true, error: null });
        try {
          const docRef = doc(db, 'subscriptions', userId);
          await updateDoc(docRef, { customApiKey: apiKey });
          
          const subscription = get().subscription;
          if (subscription) {
            set({ subscription: { ...subscription, customApiKey: apiKey } });
          }
          
          toast.success('Custom API key updated successfully');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Failed to update custom API key');
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({
        subscription: state.subscription ? {
          ...state.subscription,
          startDate: state.subscription.startDate.toISOString(),
          endDate: state.subscription.endDate.toISOString()
        } : null,
        credits: state.credits ? {
          ...state.credits,
          lastUpdated: state.credits.lastUpdated.toISOString()
        } : null
      })
    }
  )
);

function getFeaturesByTier(tier: SubscriptionTier): string[] {
  switch (tier) {
    case 'free':
      return ['Basic AI Generations', '50 Credits/month', 'Standard Support'];
    case 'pro':
      return [
        'Advanced AI Generations',
        '500 Credits/month',
        'Priority Support',
        'Export Features',
        'Team Collaboration'
      ];
    case 'enterprise':
      return [
        'Unlimited AI Generations',
        'Custom API Key Integration',
        'Dedicated Support',
        'Advanced Analytics',
        'Custom Integrations',
        'SLA Guarantee'
      ];
    default:
      return [];
  }
}