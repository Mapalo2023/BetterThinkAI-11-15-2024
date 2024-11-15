export interface BusinessInfo {
  name: string;
  industry: string;
  description: string;
  challenges: string[];
  goals: string[];
}

export interface AutomationResult {
  id: string;
  businessInfo: BusinessInfo;
  analysis: {
    efficiency: number;
    potential: number;
    risk: number;
    roi: number;
  };
  recommendations: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: number;
    timeframe: string;
  }[];
  opportunities: {
    title: string;
    description: string;
    potentialValue: string;
    requirements: string[];
  }[];
  createdAt: Date;
}

export interface AutomationState {
  results: AutomationResult[];
  isLoading: boolean;
  error: string | null;
  generateAnalysis: (info: BusinessInfo) => Promise<void>;
  removeResult: (id: string) => void;
}