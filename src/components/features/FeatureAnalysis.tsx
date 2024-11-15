import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { useFeatureAnalysisStore } from '../../store/features/featureAnalysisStore';
import FeatureCard from './shared/FeatureCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function FeatureAnalysis() {
  const { features, isLoading, analyzeFeature, removeFeature } = useFeatureAnalysisStore();
  const [formData, setFormData] = React.useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      return;
    }
    
    try {
      await analyzeFeature(formData.name.trim(), formData.description.trim());
      setFormData({ name: '', description: '' });
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
            <LayoutGrid className="w-8 h-8 text-blue-500" />
            Feature Analysis
          </h1>
          <p className="text-gray-500 mt-1">
            Analyze and prioritize product features with AI-powered insights
          </p>
        </div>
        <SavedFeaturesButton count={features.length} title="Saved Features" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">New Analysis</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feature Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="Enter feature name"
                  required
                  minLength={3}
                  maxLength={100}
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
                  placeholder="Describe the feature in detail..."
                  required
                  minLength={10}
                  maxLength={1000}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim() || !formData.description.trim()}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Feature'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {features.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No features analyzed</h3>
                <p className="text-gray-500">
                  Start by analyzing your first feature
                </p>
              </div>
            ) : (
              features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onDelete={removeFeature}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}