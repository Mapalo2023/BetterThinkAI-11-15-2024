export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  analysis: {
    marketPotential: number;
    innovationScore: number;
    feasibilityScore: number;
    riskLevel: number;
  };
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: number;
  impact: number;
}

export interface Risk {
  id: string;
  category: string;
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface Cost {
  id: string;
  category: string;
  description: string;
  amount: number;
  frequency: 'one-time' | 'monthly' | 'yearly';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
}