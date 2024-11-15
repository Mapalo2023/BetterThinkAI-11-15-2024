import { create } from 'zustand';
import { User } from 'firebase/auth';
import { signIn as firebaseSignIn, signUp as firebaseSignUp, signOut as firebaseSignOut } from '../lib/firebase';
import { AuthState, UserRole, Subscription, Credits } from '../types/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userRole: null,
  subscription: null,
  credits: null,
  loading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  
  setUserRole: (role) => set({ userRole: role }),

  setSubscription: (subscription) => set({ subscription }),

  setCredits: (credits) => set({ credits }),
  
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await firebaseSignIn(email, password);
      set({ user });
      
      // Fetch user data in parallel
      const [roleDoc, subDoc, creditsDoc] = await Promise.all([
        getDoc(doc(db, 'userRoles', user.uid)),
        getDoc(doc(db, 'subscriptions', user.uid)),
        getDoc(doc(db, 'credits', user.uid))
      ]);

      // Set user role
      const userRole = roleDoc.exists() ? roleDoc.data() as UserRole : { isAdmin: false };
      set({ userRole });

      // Set subscription
      if (subDoc.exists()) {
        set({ subscription: subDoc.data() as Subscription });
      }

      // Set credits
      if (creditsDoc.exists()) {
        set({ credits: creditsDoc.data() as Credits });
      }

      set({ loading: false });
      return user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      set({ 
        error: error.message || 'Failed to sign in',
        loading: false,
        user: null,
        userRole: null,
        subscription: null,
        credits: null
      });
      throw error;
    }
  },
  
  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await firebaseSignUp(email, password);
      
      const timestamp = new Date();
      const batch = {
        userRole: { isAdmin: false },
        subscription: {
          userId: user.uid,
          type: 'free',
          features: ['basic'],
          startDate: timestamp,
          status: 'active'
        },
        credits: {
          userId: user.uid,
          amount: 100,
          lastUpdated: timestamp
        }
      };

      // Create initial user data
      await Promise.all([
        setDoc(doc(db, 'userRoles', user.uid), batch.userRole),
        setDoc(doc(db, 'subscriptions', user.uid), batch.subscription),
        setDoc(doc(db, 'credits', user.uid), batch.credits)
      ]);
      
      set({ 
        user,
        userRole: batch.userRole,
        subscription: batch.subscription,
        credits: batch.credits,
        loading: false 
      });
      
      return user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      set({ 
        error: error.message || 'Failed to create account',
        loading: false,
        user: null,
        userRole: null,
        subscription: null,
        credits: null
      });
      throw error;
    }
  },
  
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut();
      set({ 
        user: null, 
        userRole: null, 
        subscription: null, 
        credits: null, 
        loading: false 
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ 
        error: error.message || 'Failed to sign out',
        loading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));