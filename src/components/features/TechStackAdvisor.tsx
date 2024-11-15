import React from 'react';
import { Database } from 'lucide-react';
import { useTechStackStore } from '../../store/features/techStackStore';
import TechStackCard from './shared/TechStackCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function TechStackAdvisor() {
  const { stacks, isLoading, generateStack, removeStack } = useTechStackStore();
  const [formData, setFormData] = React.useState({
    projectType: '',
    scale: '',
    budget: '',
    teamExperience: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectType || !formData.scale || !formData.budget || !formData.teamExperience) {
      return;
    }
    
    try {
      await generateStack(
        formData.projectType,
        formData.scale,
        formData.budget,
        formData.teamExperience
      );
      setFormData({
        projectType: '',
        scale: '',
        budget: '',
        teamExperience: ''
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
            <Database className="w-8 h-8 text-blue-500" />
            Tech Stack Advisor
          </h1>
          <p className="text-gray-500 mt-1">
            Get AI-powered recommendations for your technology stack
          </p>
        </div>
        <SavedFeaturesButton count={stacks.length} title="Saved Stacks" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Project Requirements</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select type</option>
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop Application</option>
                  <option value="api">API Service</option>
                  <option value="ecommerce">E-commerce Platform</option>
                  <option value="cms">Content Management System</option>
                  <option value="analytics">Analytics Platform</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale & Performance
                </label>
                <textarea
                  value={formData.scale}
                  onChange={(e) => setFormData(prev => ({ ...prev, scale: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Describe scale and performance requirements"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select range</option>
                  <option value="low">Low Budget</option>
                  <option value="medium">Medium Budget</option>
                  <option value="high">High Budget</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Experience
                </label>
                <textarea
                  value={formData.teamExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamExperience: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Describe team's technical experience"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Generating...' : 'Get Recommendations'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {stacks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No tech stacks yet</h3>
                <p className="text-gray-500">
                  Start by getting your first tech stack recommendation
                </p>
              </div>
            ) : (
              stacks.map((stack) => (
                <TechStackCard
                  key={stack.id}
                  stack={stack}
                  onDelete={removeStack}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}