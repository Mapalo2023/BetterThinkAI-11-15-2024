import { User } from 'firebase/auth';

export interface UserResearch {
  id: string;
  userId: string;
  title: string;
  method: 'interview' | 'survey' | 'observation';
  participants: number;
  insights: string[];
  painPoints: string[];
  needs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProblemStatement {
  id: string;
  userId: string;
  userGroup: string;
  needs: string;
  insight: string;
  impact: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IdeaCard {
  id: string;
  userId: string;
  title: string;
  description: string;
  impact: number;
  feasibility: number;
  tags: string[];
  votes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Prototype {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'sketch' | 'wireframe' | 'mockup';
  imageUrls: string[];
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TestResult {
  id: string;
  userId: string;
  prototypeId: string;
  participants: number;
  feedback: {
    positive: string[];
    negative: string[];
    suggestions: string[];
  };
  metrics: {
    usability: number;
    desirability: number;
    feasibility: number;
  };
  nextSteps: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface DesignThinkingState {
  currentStage: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
  research: UserResearch[];
  problemStatements: ProblemStatement[];
  ideas: IdeaCard[];
  prototypes: Prototype[];
  testResults: TestResult[];
  isLoading: boolean;
  error: string | null;
  
  // Data Loading
  loadUserData: (userId: string) => Promise<void>;
  
  // Stage Management
  setCurrentStage: (stage: DesignThinkingState['currentStage']) => void;
  
  // Research Methods
  addResearch: (research: Omit<UserResearch, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateResearch: (id: string, updates: Partial<UserResearch>) => Promise<void>;
  deleteResearch: (id: string) => Promise<void>;
  
  // Problem Statements
  addProblemStatement: (statement: Omit<ProblemStatement, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProblemStatement: (id: string, updates: Partial<ProblemStatement>) => Promise<void>;
  deleteProblemStatement: (id: string) => Promise<void>;
  
  // Ideation
  addIdea: (idea: Omit<IdeaCard, 'id' | 'userId' | 'votes' | 'comments' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateIdea: (id: string, updates: Partial<IdeaCard>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  voteIdea: (id: string) => Promise<void>;
  addComment: (ideaId: string, comment: Omit<Comment, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  
  // Prototypes
  addPrototype: (prototype: Omit<Prototype, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePrototype: (id: string, updates: Partial<Prototype>) => Promise<void>;
  deletePrototype: (id: string) => Promise<void>;
  
  // Testing
  addTestResult: (result: Omit<TestResult, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTestResult: (id: string, updates: Partial<TestResult>) => Promise<void>;
  deleteTestResult: (id: string) => Promise<void>;
}