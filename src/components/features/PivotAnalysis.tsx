import React from 'react';
import { RefreshCw, Plus, Trash2 } from 'lucide-react';
import { usePivotAnalysisStore } from '../../store/features/pivotAnalysisStore';
import PivotAnalysisCard from './shared/PivotAnalysisCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function PivotAnalysis() {
  const { analyses, isLoading, generateAnalysis, removeAnalysis } = usePivotAnalysisStore();
  const [formData, setFormData] = React.useState({
    currentModel: '',
    challenges: [''],
    marketChanges: [''],
    coreStrengths: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentModel) {
      return;
    }
    
    const challenges = formData.challenges.filter(c => c.trim());
    const marketChanges = formData.marketChanges.filter(m => m.trim());
    const coreStrengths = formData.coreStrengths.filter(s => s.trim());
    
    if (challenges.length === 0 || marketChanges.length === 0 || coreStrengths.length === 0) {
      return;
    }

    try {
      await generateAnalysis(
        formData.currentModel,
        challenges,
        marketChanges,
        coreStrengths
      );
      setFormData({
        currentModel: '',
        challenges: [''],
        marketChanges: [''],
        coreStrengths: ['']
      });
    } catch (error) {
      // Error is handled by the store
      console.error('Form submission error:', error);
    }
  };

  const addField = (field: 'challenges' | 'marketChanges' | 'coreStrengths') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'challenges' | 'marketChanges' | 'coreStrengths', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'challenges' | 'marketChanges' | 'coreStrengths', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-500" />
            Pivot Analysis
          </h1>
          <p className="text-gray-500 mt-1">
            Get AI-powered insights for strategic pivots and business model changes
          </p>
        </div>
        <SavedFeaturesButton count={analyses.length} title="Saved Analyses" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Current Business Model</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Model
                </label>
                <textarea
                  value={formData.currentModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentModel: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Describe your current business model..."
                  required
                />
              </div>

              {[
                { field: 'challenges' as const, label: 'Key Challenges' },
                { field: 'marketChanges' as const, label: 'Market Changes' },
                { field: 'coreStrengths' as const, label: 'Core Strengths' }
              ].map(({ field, label }) => (
                <div key={field}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <button
                      type="button"
                      onClick={() => addField(field)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {formData[field].map((value, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateField(field, index, e.target.value)}
                        className="input"
                        placeholder={`Add ${label.toLowerCase()}`}
                        required
                      />
                      {formData[field].length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(field, index)}
                          className="p-2 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Pivot Options'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {analyses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No pivot analyses yet</h3>
                <p className="text-gray-500">
                  Start by analyzing your pivot opportunities
                </p>
              </div>
            ) : (
              analyses.map((analysis) => (
                <PivotAnalysisCard
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