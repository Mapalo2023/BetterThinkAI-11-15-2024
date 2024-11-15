import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useGrowthMetricsStore } from '../../store/features/growthMetricsStore';
import GrowthAnalysisCard from './shared/GrowthAnalysisCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function GrowthMetrics() {
  const { analyses, isLoading, generateAnalysis, removeAnalysis } = useGrowthMetricsStore();
  const [formData, setFormData] = React.useState({
    businessModel: '',
    mrr: 0,
    customerCount: 0,
    growthGoals: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessModel || !formData.growthGoals) {
      return;
    }

    try {
      await generateAnalysis(
        formData.businessModel,
        formData.mrr,
        formData.customerCount,
        formData.growthGoals
      );
      setFormData({
        businessModel: '',
        mrr: 0,
        customerCount: 0,
        growthGoals: ''
      });
    } catch (error) {
      // Error is handled by the store
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-blue-500" />
            Growth Metrics
          </h1>
          <p className="text-gray-500 mt-1">
            Track and analyze key growth metrics with AI insights
          </p>
        </div>
        <SavedFeaturesButton count={analyses.length} title="Saved Analyses" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Growth Analysis</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Model
                </label>
                <select
                  value={formData.businessModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessModel: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select model</option>
                  <option value="saas">SaaS</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Recurring Revenue
                </label>
                <input
                  type="number"
                  value={formData.mrr}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    mrr: Math.max(0, parseInt(e.target.value) || 0)
                  }))}
                  className="input"
                  placeholder="Enter MRR in USD"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Count
                </label>
                <input
                  type="number"
                  value={formData.customerCount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    customerCount: Math.max(0, parseInt(e.target.value) || 0)
                  }))}
                  className="input"
                  placeholder="Enter total customers"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Growth Goals
                </label>
                <textarea
                  value={formData.growthGoals}
                  onChange={(e) => setFormData(prev => ({ ...prev, growthGoals: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Describe your growth targets..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Growth'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {analyses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <BarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No growth analyses yet</h3>
                <p className="text-gray-500">
                  Start by analyzing your growth metrics
                </p>
              </div>
            ) : (
              analyses.map((analysis) => (
                <GrowthAnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                  onDelete={removeAnalysis}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}