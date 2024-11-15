import React from 'react';
import { DollarSign } from 'lucide-react';
import { useCostEstimationStore } from '../../store/features/costEstimationStore';
import CostEstimateCard from './shared/CostEstimateCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function CostEstimation() {
  const { estimates, isLoading, generateEstimate, removeEstimate } = useCostEstimationStore();
  const [formData, setFormData] = React.useState({
    projectName: '',
    description: '',
    timeline: 1,
    teamSize: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName.trim() || !formData.description.trim()) {
      return;
    }
    
    try {
      await generateEstimate(
        formData.projectName.trim(),
        formData.description.trim(),
        formData.timeline,
        formData.teamSize
      );
      setFormData({
        projectName: '',
        description: '',
        timeline: 1,
        teamSize: 1
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
            <DollarSign className="w-8 h-8 text-blue-500" />
            Cost Estimation
          </h1>
          <p className="text-gray-500 mt-1">
            Get accurate cost estimates powered by AI analysis
          </p>
        </div>
        <SavedFeaturesButton count={estimates.length} title="Saved Estimates" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  className="input"
                  placeholder="Enter project name"
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
                  placeholder="Describe the project scope"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeline (months)
                </label>
                <input
                  type="number"
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    timeline: Math.max(1, parseInt(e.target.value) || 1)
                  }))}
                  className="input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Size
                </label>
                <input
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    teamSize: Math.max(1, parseInt(e.target.value) || 1)
                  }))}
                  className="input"
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !formData.projectName.trim() || !formData.description.trim()}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Generating...' : 'Generate Estimate'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {estimates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No estimates yet</h3>
                <p className="text-gray-500">
                  Start by generating your first cost estimate
                </p>
              </div>
            ) : (
              estimates.map((estimate) => (
                <CostEstimateCard
                  key={estimate.id}
                  estimate={estimate}
                  onDelete={removeEstimate}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}