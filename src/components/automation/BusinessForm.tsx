import React from 'react';
import { BusinessInfo } from '../../types/automation';
import { Building2, Plus, Minus } from 'lucide-react';

interface BusinessFormProps {
  onSubmit: (info: BusinessInfo) => void;
  isLoading: boolean;
}

export default function BusinessForm({ onSubmit, isLoading }: BusinessFormProps) {
  const [info, setInfo] = React.useState<BusinessInfo>({
    name: '',
    industry: '',
    description: '',
    challenges: [''],
    goals: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.name && info.industry && info.description) {
      onSubmit({
        ...info,
        challenges: info.challenges.filter(c => c.trim()),
        goals: info.goals.filter(g => g.trim())
      });
    }
  };

  const addField = (field: 'challenges' | 'goals') => {
    setInfo(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'challenges' | 'goals', index: number) => {
    setInfo(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'challenges' | 'goals', index: number, value: string) => {
    setInfo(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Business Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            type="text"
            id="name"
            value={info.name}
            onChange={(e) => setInfo(prev => ({ ...prev, name: e.target.value }))}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            value={info.industry}
            onChange={(e) => setInfo(prev => ({ ...prev, industry: e.target.value }))}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Business Description
          </label>
          <textarea
            id="description"
            value={info.description}
            onChange={(e) => setInfo(prev => ({ ...prev, description: e.target.value }))}
            className="input min-h-[100px]"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Challenges
            </label>
            <button
              type="button"
              onClick={() => addField('challenges')}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {info.challenges.map((challenge, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={challenge}
                onChange={(e) => updateField('challenges', index, e.target.value)}
                className="input"
                placeholder="Describe a challenge"
              />
              {info.challenges.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('challenges', index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Minus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Goals
            </label>
            <button
              type="button"
              onClick={() => addField('goals')}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {info.goals.map((goal, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => updateField('goals', index, e.target.value)}
                className="input"
                placeholder="Define a goal"
              />
              {info.goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('goals', index)}
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
          disabled={isLoading || !info.name || !info.industry || !info.description}
          className="w-full btn btn-primary"
        >
          {isLoading ? 'Analyzing...' : 'Generate Analysis'}
        </button>
      </div>
    </form>
  );
}