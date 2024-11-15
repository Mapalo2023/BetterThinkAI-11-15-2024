export interface TrendConfig {
  regions: string[];
  keywords: string[];
  platforms: string[];
  sector: string;
  country: string;
  timeframe: 'day' | 'week' | 'month' | 'custom';
  startDate?: Date;
  endDate?: Date;
  useRealTime?: boolean;
}

export interface CompetitorData {
  name: string;
  shareOfVoice: number;
  mentions: number;
  sentiment: {
    type: 'positive' | 'negative' | 'neutral';
    percentage: number;
  }[];
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface TrendReport {
  id: string;
  createdAt: Date;
  config: TrendConfig;
  insights: string[];
  recommendations: string[];
  competitorData: CompetitorData[];
  news: NewsItem[];
  metrics: {
    totalMentions: number;
    sentimentScore: number;
    engagementRate: number;
    shareOfVoice: number;
  };
}

export interface TrendTrackerState {
  config: TrendConfig;
  reports: TrendReport[];
  currentReport: TrendReport | null;
  isLoading: boolean;
  error: string | null;
  setConfig: (config: TrendConfig) => void;
  generateReport: () => Promise<void>;
  clearError: () => void;
  deleteReport: (id: string) => void;
}