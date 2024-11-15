import React from 'react';
import { ProblemInfo, ProblemSeverity, ProblemCategory } from '../../types/problemSolver';
import { Plus, Minus } from 'lucide-react';

interface ProblemFormProps {
  onSubmit: (info: ProblemInfo) => void;
  isLoading: boolean;
}

export default function ProblemForm({ onSubmit, isLoading }: ProblemFormProps) {
  const [info, setInfo] = React.useState<ProblemInfo>({
    description: '',
    severity: 'medium',
    category: 'operational',
    scope: '',
    stakeholders: [''],
    constraints: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.description && info.scope) {
      onSubmit({
        ...info,
        stakeholders: info.stakeholders.filter(s => s.trim()),
        constraints: info.constraints.filter(c => c.trim())
      });
    }
  };

  const addField = (field: 'stakeholders' | 'constraints') => {
    setInfo(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'stakeholders' | 'constraints', index: number) => {
    setInfo(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'stakeholders' | 'constraints', index: number, value: string) => {
    setInfo(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Problem Description
          </label>
          <textarea
            id="description"
            value={info.description}
            onChange={(e) => setInfo(prev => ({ ...prev, description: e.target.value }))}
            className="input min-h-[100px]"
            placeholder="Describe your problem in detail..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
              Severity Level
            </label>
            <select
              id="severity"
              value={info.severity}
              onChange={(e) => setInfo(prev => ({ 
                ...prev, 
                severity: e.target.value as ProblemSeverity 
              }))}
              className="input"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Problem Category
            </label>
            <select
              id="category"
              value={info.category}
              onChange={(e) => setInfo(prev => ({ 
                ...prev, 
                category: e.target.value as ProblemCategory
              }))}
              className="input"
              required
            >
              <option value="strategic">Strategic</option>
              <option value="operational">Operational</option>
              <option value="technical">Technical</option>
              <option value="financial">Financial</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
            Problem Scope
          </label>
          <input
            type="text"
            id="scope"
            value={info.scope}
            onChange={(e) => setInfo(prev => ({ ...prev, scope: e.target.value }))}
            className="input"
            placeholder="e.g., Team-level, Department-wide, Organization-wide"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Stakeholders
            </label>
            <button
              type="button"
              onClick={() => addField('stakeholders')}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {info.stakeholders.map((stakeholder, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={stakeholder}
                onChange={(e) => updateField('stakeholders', index, e.target.value)}
                className="input"
                placeholder="Add stakeholder"
              />
              {info.stakeholders.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('stakeholders', index)}
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
              Constraints
            </label>
            <button
              type="button"
              onClick={() => addField('constraints')}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {info.constraints.map((constraint, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={constraint}
                onChange={(e) => updateField('constraints', index, e.target.value)}
                className="input"
                placeholder="Add constraint"
              />
              {info.constraints.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('constraints', index)}
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
          {isLoading ? 'Generating Solution...' : 'Generate Solution'}
        </button>
      </div>
    </form>
  );
}