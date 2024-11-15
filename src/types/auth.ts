import { User } from 'firebase/auth';

export interface UserRole {
  isAdmin: boolean;
  appointedBy?: string;
  appointedAt?: Date;
}

export interface Subscription {
  userId: string;
  type: 'free' | 'pro' | 'enterprise';
  features: string[];
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'cancelled' | 'expired';
}

export interface Credits {
  userId: string;
  amount: number;
  lastUpdated: Date;
}

export interface AuthState {
  user: User | null;
  userRole: UserRole | null;
  subscription: Subscription | null;
  credits: Credits | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setUserRole: (role: UserRole | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setCredits: (credits: Credits | null) => void;
  loadUserData: (userId: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  appointAdmin: (userId: string) => Promise<void>;
  removeAdmin: (userId: string) => Promise<void>;
}