export interface UserCredits {
  available: number;
  total: number;
  lastUpdated: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  features: string[];
  customApiKey?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  subscription: Subscription;
  credits: UserCredits;
  createdAt: Date;
  updatedAt: Date;
}