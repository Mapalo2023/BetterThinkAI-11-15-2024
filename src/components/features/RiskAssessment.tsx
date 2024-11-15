import React from 'react';
import { Target } from 'lucide-react';
import { useRiskAssessmentStore } from '../../store/features/riskAssessmentStore';
import RiskCard from './shared/RiskCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function RiskAssessment() {
  const { risks, isLoading, analyzeRisk, removeRisk } = useRiskAssessmentStore();
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      return;
    }
    
    try {
      await analyzeRisk(formData.name.trim(), formData.description.trim(), formData.category);
      setFormData({ name: '', description: '', category: '' });
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
            <Target className="w-8 h-8 text-blue-500" />
            Risk Assessment
          </h1>
          <p className="text-gray-500 mt-1">
            Identify and analyze potential risks with AI-powered insights
          </p>
        </div>
        <SavedFeaturesButton count={risks.length} title="Saved Risks" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="Enter risk name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Describe the risk in detail..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Technical">Technical</option>
                  <option value="Financial">Financial</option>
                  <option value="Operational">Operational</option>
                  <option value="Market">Market</option>
                  <option value="Legal">Legal</option>
                  <option value="Security">Security</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim() || !formData.description.trim() || !formData.category}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Risk'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {risks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No risks analyzed</h3>
                <p className="text-gray-500">
                  Start by analyzing your first risk
                </p>
              </div>
            ) : (
              risks.map((risk) => (
                <RiskCard
                  key={risk.id}
                  risk={risk}
                  onDelete={removeRisk}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}