import React from 'react';
import { Users2, Plus, Minus } from 'lucide-react';
import { useResourcePlanningStore } from '../../store/features/resourcePlanningStore';
import ResourcePlanCard from './shared/ResourcePlanCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function ResourcePlanning() {
  const { plans, isLoading, generatePlan, removePlan } = useResourcePlanningStore();
  const [formData, setFormData] = React.useState({
    projectName: '',
    description: '',
    duration: 1,
    budget: 0,
    skills: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName.trim() || !formData.description.trim() || formData.budget <= 0) {
      return;
    }
    
    const skills = formData.skills.filter(s => s.trim());
    if (skills.length === 0) {
      return;
    }

    try {
      await generatePlan(
        formData.projectName.trim(),
        formData.description.trim(),
        formData.duration,
        formData.budget,
        skills
      );
      setFormData({
        projectName: '',
        description: '',
        duration: 1,
        budget: 0,
        skills: ['']
      });
    } catch (error) {
      // Error is handled by the store
      console.error('Form submission error:', error);
    }
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((s, i) => i === index ? value : s)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users2 className="w-8 h-8 text-blue-500" />
            Resource Planning
          </h1>
          <p className="text-gray-500 mt-1">
            Optimize resource allocation with AI-driven planning
          </p>
        </div>
        <SavedFeaturesButton count={plans.length} title="Saved Plans" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Resource Requirements</h2>
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
                  placeholder="Describe project scope and requirements"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (months)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    duration: Math.max(1, parseInt(e.target.value) || 1)
                  }))}
                  className="input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    budget: Math.max(0, parseInt(e.target.value) || 0)
                  }))}
                  className="input"
                  min="0"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Required Skills
                  </label>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="p-1 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="input"
                      placeholder="Enter required skill"
                      required
                    />
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Generating...' : 'Generate Plan'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {plans.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Users2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No resource plans yet</h3>
                <p className="text-gray-500">
                  Start by generating your first resource plan
                </p>
              </div>
            ) : (
              plans.map((plan) => (
                <ResourcePlanCard
                  key={plan.id}
                  plan={plan}
                  onDelete={removePlan}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}