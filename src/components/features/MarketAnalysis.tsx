import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useMarketAnalysisStore } from '../../store/features/marketAnalysisStore';
import MarketAnalysisCard from './shared/MarketAnalysisCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function MarketAnalysis() {
  const { analyses, isLoading, analyzeMarket, removeAnalysis } = useMarketAnalysisStore();
  const [formData, setFormData] = React.useState({
    industry: '',
    targetMarket: '',
    competitors: [''],
    region: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.industry.trim() || !formData.targetMarket.trim() || !formData.region.trim()) {
      return;
    }
    
    const competitors = formData.competitors.filter(c => c.trim());
    if (competitors.length === 0) {
      return;
    }

    try {
      await analyzeMarket(
        formData.industry.trim(),
        formData.targetMarket.trim(),
        competitors,
        formData.region.trim()
      );
      setFormData({
        industry: '',
        targetMarket: '',
        competitors: [''],
        region: ''
      });
    } catch (error) {
      // Error is handled by the store
      console.error('Form submission error:', error);
    }
  };

  const addCompetitor = () => {
    setFormData(prev => ({
      ...prev,
      competitors: [...prev.competitors, '']
    }));
  };

  const removeCompetitor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index)
    }));
  };

  const updateCompetitor = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.map((c, i) => i === index ? value : c)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            Market Analysis
          </h1>
          <p className="text-gray-500 mt-1">
            Get AI-powered market insights and competitive analysis
          </p>
        </div>
        <SavedFeaturesButton count={analyses.length} title="Saved Analyses" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Market Research</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="input"
                  placeholder="e.g., SaaS, E-commerce, FinTech"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Market
                </label>
                <input
                  type="text"
                  value={formData.targetMarket}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                  className="input"
                  placeholder="e.g., Small Businesses, Enterprise"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Competitors
                  </label>
                  <button
                    type="button"
                    onClick={addCompetitor}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add Competitor
                  </button>
                </div>
                {formData.competitors.map((competitor, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={competitor}
                      onChange={(e) => updateCompetitor(index, e.target.value)}
                      className="input"
                      placeholder="Enter competitor name"
                      required
                    />
                    {formData.competitors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompetitor(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Geographic Region
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  className="input"
                  placeholder="e.g., North America, Global"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Market'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {analyses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No market analyses yet</h3>
                <p className="text-gray-500">
                  Start by analyzing your first market
                </p>
              </div>
            ) : (
              analyses.map((analysis) => (
                <MarketAnalysisCard
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