export interface IdeaPrompt {
  industry?: string;
  targetMarket?: string;
  problemStatement?: string;
  constraints?: string;
}

export interface SIPAnalysis {
  verdict: 'SIP' | 'SPIT';
  score: number;
  reasoning: string[];
  recommendations: string[];
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  analysis: {
    marketPotential: number;
    innovationScore: number;
    feasibilityScore: number;
    riskLevel: number;
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  sipAnalysis?: SIPAnalysis;
  createdAt: Date;
  source: 'AI' | 'USER';
}

export interface BrainstormState {
  ideas: Idea[];
  isLoading: boolean;
  error: string | null;
  addIdea: (idea: Idea) => void;
  removeIdea: (id: string) => void;
  generateIdea: (prompt: IdeaPrompt) => Promise<void>;
  evaluateIdea: (id: string) => Promise<void>;
  addManualIdea: (title: string, description: string) => Promise<void>;
}