export type ProblemSeverity = 'low' | 'medium' | 'high';
export type ProblemCategory = 'strategic' | 'operational' | 'technical' | 'financial';
export type ResourceType = 'article' | 'video' | 'tool' | 'template';

export interface ProblemInfo {
  description: string;
  severity: ProblemSeverity;
  category: ProblemCategory;
  scope: string;
  stakeholders: string[];
  constraints: string[];
}

export interface Analysis {
  summary: string;
  impact: number;
  urgency: number;
  complexity: number;
  rootCauses: string[];
}

export interface Recommendation {
  title: string;
  description: string;
  priority: ProblemSeverity;
  pros: string[];
  cons: string[];
  timeline: string;
  estimatedCost: string;
}

export interface RoadmapPhase {
  phase: string;
  tasks: string[];
  milestones: string[];
  risks: string[];
  duration: string;
}

export interface Metric {
  name: string;
  description: string;
  target: string;
}

export interface Resource {
  title: string;
  description: string;
  url: string;
  type: ResourceType;
}

export interface Solution {
  id: string;
  problemInfo: ProblemInfo;
  analysis: Analysis;
  recommendations: Recommendation[];
  roadmap: RoadmapPhase[];
  metrics: Metric[];
  resources: Resource[];
  createdAt: Date;
}

export interface ProblemSolverState {
  solutions: Solution[];
  isLoading: boolean;
  error: string | null;
  generateSolution: (info: ProblemInfo) => Promise<void>;
  removeSolution: (id: string) => void;
}