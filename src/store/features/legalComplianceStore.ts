import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Requirement {
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'compliant' | 'partial' | 'non-compliant';
  actions: string[];
  deadline: string;
}

interface ComplianceReport {
  id: string;
  businessType: string;
  regions: string[];
  dataHandling: string[];
  currentMeasures: string;
  analysis: {
    overallStatus: 'compliant' | 'partial' | 'non-compliant';
    riskLevel: 'high' | 'medium' | 'low';
    requirements: Requirement[];
    gaps: string[];
    nextSteps: string[];
  };
  recommendations: string[];
  createdAt: Date;
}

interface LegalComplianceState {
  reports: ComplianceReport[];
  isLoading: boolean;
  error: string | null;
  generateReport: (
    businessType: string,
    regions: string[],
    dataHandling: string[],
    currentMeasures: string
  ) => Promise<void>;
  removeReport: (id: string) => void;
}

export const useLegalComplianceStore = create<LegalComplianceState>()(
  persist(
    (set) => ({
      reports: [],
      isLoading: false,
      error: null,

      generateReport: async (
        businessType: string,
        regions: string[],
        dataHandling: string[],
        currentMeasures: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert legal compliance advisor. Analyze the business details and provide comprehensive compliance requirements and recommendations. Always respond with valid JSON."
              },
              {
                role: "user",
                content: `Generate a detailed compliance report for:
                  Business Type: ${businessType}
                  Operating Regions: ${regions.join(', ')}
                  Data Handling: ${dataHandling.join(', ')}
                  Current Measures: ${currentMeasures}
                  
                  Return the analysis in this exact JSON format:
                  {
                    "analysis": {
                      "overallStatus": <"compliant" | "partial" | "non-compliant">,
                      "riskLevel": <"high" | "medium" | "low">,
                      "requirements": [
                        {
                          "category": <string>,
                          "description": <string>,
                          "priority": <"high" | "medium" | "low">,
                          "status": <"compliant" | "partial" | "non-compliant">,
                          "actions": <array of strings>,
                          "deadline": <string>
                        }
                      ],
                      "gaps": <array of strings>,
                      "nextSteps": <array of strings>
                    },
                    "recommendations": <array of strings with compliance improvement suggestions>
                  }`
              }
            ],
            temperature: 0.7,
            max_tokens: 1500
          });

          const responseContent = completion.choices[0].message.content;
          if (!responseContent) {
            throw new Error('Empty response from AI');
          }

          let analysisData;
          try {
            analysisData = JSON.parse(responseContent);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Failed to parse AI response');
          }

          const newReport: ComplianceReport = {
            id: crypto.randomUUID(),
            businessType,
            regions,
            dataHandling,
            currentMeasures,
            analysis: analysisData.analysis,
            recommendations: analysisData.recommendations,
            createdAt: new Date()
          };

          set((state) => ({ 
            reports: [newReport, ...state.reports],
            isLoading: false 
          }));

          toast.success('Compliance report generated successfully!');
        } catch (error: any) {
          console.error('Error generating report:', error);
          const errorMessage = error.message || 'Failed to generate compliance report. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          toast.error(errorMessage);
        }
      },

      removeReport: (id) => set((state) => ({
        reports: state.reports.filter((report) => report.id !== id)
      }))
    }),
    {
      name: 'legal-compliance-storage',
      partialize: (state) => ({ 
        reports: state.reports.map(report => ({
          ...report,
          createdAt: report.createdAt.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.reports) {
          state.reports = state.reports.map(report => ({
            ...report,
            createdAt: new Date(report.createdAt)
          }));
        }
      }
    }
  )
);