import React from 'react';
import { Wallet } from 'lucide-react';
import { useFundingStrategyStore } from '../../store/features/fundingStrategyStore';
import FundingStrategyCard from './shared/FundingStrategyCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function FundingStrategy() {
  const { strategies, isLoading, generateStrategy, removeStrategy } = useFundingStrategyStore();
  const [formData, setFormData] = React.useState({
    stage: '',
    industry: '',
    monthlyRevenue: 0,
    fundingRequired: 0,
    useOfFunds: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.stage || !formData.industry || !formData.useOfFunds) {
      return;
    }
    
    try {
      await generateStrategy(
        formData.stage,
        formData.industry,
        formData.monthlyRevenue,
        formData.fundingRequired,
        formData.useOfFunds
      );
      setFormData({
        stage: '',
        industry: '',
        monthlyRevenue: 0,
        fundingRequired: 0,
        useOfFunds: ''
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
            <Wallet className="w-8 h-8 text-blue-500" />
            Funding Strategy
          </h1>
          <p className="text-gray-500 mt-1">
            Get AI-powered funding recommendations and strategies
          </p>
        </div>
        <SavedFeaturesButton count={strategies.length} title="Saved Strategies" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Business Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select stage</option>
                  <option value="idea">Idea Stage</option>
                  <option value="mvp">MVP</option>
                  <option value="early">Early Traction</option>
                  <option value="growth">Growth Stage</option>
                  <option value="scale">Scaling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="input"
                  placeholder="e.g., SaaS, E-commerce"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Monthly Revenue
                </label>
                <input
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    monthlyRevenue: Math.max(0, parseInt(e.target.value) || 0)
                  }))}
                  className="input"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Required
                </label>
                <input
                  type="number"
                  value={formData.fundingRequired}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    fundingRequired: Math.max(0, parseInt(e.target.value) || 0)
                  }))}
                  className="input"
                  placeholder="Enter amount needed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Use of Funds
                </label>
                <textarea
                  value={formData.useOfFunds}
                  onChange={(e) => setFormData(prev => ({ ...prev, useOfFunds: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Describe how you plan to use the funding"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Generating...' : 'Get Strategy'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {strategies.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No strategies yet</h3>
                <p className="text-gray-500">
                  Start by getting your first funding strategy
                </p>
              </div>
            ) : (
              strategies.map((strategy) => (
                <FundingStrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onDelete={removeStrategy}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}