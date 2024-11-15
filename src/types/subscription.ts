export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  features: string[];
  customApiKey?: string;
}

export interface Credits {
  id: string;
  userId: string;
  amount: number;
  lastUpdated: Date;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  credits: number;
  features: string[];
}