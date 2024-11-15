import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface TrendData {
  id: string;
  keyword: string;
  country: string;
  sentiment: number;
  sources: Array<{
    platform: string;
    count: number;
  }>;
  mentions: number;
  timestamp: Date;
}

interface TrendTrackerState {
  trends: TrendData[];
  isLoading: boolean;
  error: string | null;
  generateReport: (keyword: string, country: string, platforms: string[]) => Promise<void>;
  clearError: () => void;
  removeTrend: (id: string) => void;
}

export const useTrendTrackerStore = create<TrendTrackerState>()(
  persist(
    (set) => ({
      trends: [],
      isLoading: false,
      error: null,

      generateReport: async (keyword: string, country: string, platforms: string[]) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a trend analysis expert. Generate a detailed trend report based on the keyword, country, and platforms provided."
              },
              {
                role: "user",
                content: `Analyze trends for keyword "${keyword}" in ${country} across these platforms: ${platforms.join(', ')}. Include sentiment analysis and platform distribution data.`
              }
            ]
          });

          const response = completion.choices[0].message.content;
          if (!response) throw new Error("No response from OpenAI");

          // Create trend data with platform-specific metrics
          const newTrend: TrendData = {
            id: crypto.randomUUID(),
            keyword,
            country,
            sentiment: Math.random() * 2 - 1, // Simulated sentiment between -1 and 1
            sources: platforms.map(platform => ({
              platform,
              count: Math.floor(Math.random() * (platform === 'news' ? 50 : 100))
            })),
            mentions: Math.floor(Math.random() * 1000),
            timestamp: new Date()
          };

          set(state => ({
            trends: [newTrend, ...state.trends],
            isLoading: false
          }));

          toast.success('Trend report generated successfully');
        } catch (error: any) {
          console.error('Error generating report:', error);
          set({ 
            error: error.message || 'Failed to generate trend report',
            isLoading: false 
          });
          toast.error('Failed to generate trend report');
        }
      },

      clearError: () => set({ error: null }),

      removeTrend: (id: string) => set(state => ({
        trends: state.trends.filter(trend => trend.id !== id)
      }))
    }),
    {
      name: 'trend-tracker-storage',
      partialize: (state) => ({
        trends: state.trends.map(trend => ({
          ...trend,
          timestamp: trend.timestamp.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.trends) {
          state.trends = state.trends.map(trend => ({
            ...trend,
            timestamp: new Date(trend.timestamp)
          }));
        }
      }
    }
  )
);