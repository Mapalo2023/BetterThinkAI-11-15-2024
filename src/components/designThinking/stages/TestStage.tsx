import React from 'react';
import { useDesignThinkingStore } from '../../../store/designThinkingStore';
import { TestTube, Plus, Trash2 } from 'lucide-react';
import AIHelper from '../AIHelper';

export default function TestStage() {
  const { addTestResult, prototypes, isLoading } = useDesignThinkingStore();
  const [context, setContext] = React.useState('');
  const [formData, setFormData] = React.useState({
    prototypeId: '',
    participants: 0,
    feedback: {
      positive: [''],
      negative: [''],
      suggestions: ['']
    },
    metrics: {
      usability: 0,
      desirability: 0,
      feasibility: 0
    },
    nextSteps: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.prototypeId && formData.participants > 0) {
      await addTestResult({
        ...formData,
        feedback: {
          positive: formData.feedback.positive.filter(Boolean),
          negative: formData.feedback.negative.filter(Boolean),
          suggestions: formData.feedback.suggestions.filter(Boolean)
        },
        nextSteps: formData.nextSteps.filter(Boolean)
      });
      setFormData({
        prototypeId: '',
        participants: 0,
        feedback: {
          positive: [''],
          negative: [''],
          suggestions: ['']
        },
        metrics: {
          usability: 0,
          desirability: 0,
          feasibility: 0
        },
        nextSteps: ['']
      });
    }
  };

  const handleAISuggestions = (result: any) => {
    setFormData(prev => ({
      ...prev,
      participants: result.participants,
      feedback: result.feedback,
      metrics: result.metrics,
      nextSteps: result.nextSteps
    }));
  };

  const addField = (category: 'positive' | 'negative' | 'suggestions' | 'nextSteps') => {
    if (category === 'nextSteps') {
      setFormData(prev => ({
        ...prev,
        nextSteps: [...prev.nextSteps, '']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          [category]: [...prev.feedback[category], '']
        }
      }));
    }
  };

  const removeField = (category: 'positive' | 'negative' | 'suggestions' | 'nextSteps', index: number) => {
    if (category === 'nextSteps') {
      setFormData(prev => ({
        ...prev,
        nextSteps: prev.nextSteps.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          [category]: prev.feedback[category].filter((_, i) => i !== index)
        }
      }));
    }
  };

  const updateField = (
    category: 'positive' | 'negative' | 'suggestions' | 'nextSteps',
    index: number,
    value: string
  ) => {
    if (category === 'nextSteps') {
      setFormData(prev => ({
        ...prev,
        nextSteps: prev.nextSteps.map((item, i) => i === index ? value : item)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          [category]: prev.feedback[category].map((item, i) => i === index ? value : item)
        }
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TestTube className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Test Results</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Context (for AI suggestions)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe your prototype and testing goals"
            className="input flex-1"
          />
          <AIHelper
            stage="test"
            context={context}
            onResult={handleAISuggestions}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prototypeId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Prototype
          </label>
          <select
            id="prototypeId"
            value={formData.prototypeId}
            onChange={(e) => setFormData(prev => ({ ...prev, prototypeId: e.target.value }))}
            className="input"
            required
          >
            <option value="">Select a prototype</option>
            {prototypes.map(prototype => (
              <option key={prototype.id} value={prototype.id}>
                {prototype.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Participants
          </label>
          <input
            type="number"
            id="participants"
            value={formData.participants}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              participants: parseInt(e.target.value) || 0
            }))}
            className="input"
            min="1"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="usability" className="block text-sm font-medium text-gray-700 mb-1">
              Usability Score (1-100)
            </label>
            <input
              type="number"
              id="usability"
              value={formData.metrics.usability}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                metrics: {
                  ...prev.metrics,
                  usability: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                }
              }))}
              className="input"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label htmlFor="desirability" className="block text-sm font-medium text-gray-700 mb-1">
              Desirability Score (1-100)
            </label>
            <input
              type="number"
              id="desirability"
              value={formData.metrics.desirability}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                metrics: {
                  ...prev.metrics,
                  desirability: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                }
              }))}
              className="input"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label htmlFor="feasibility" className="block text-sm font-medium text-gray-700 mb-1">
              Feasibility Score (1-100)
            </label>
            <input
              type="number"
              id="feasibility"
              value={formData.metrics.feasibility}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                metrics: {
                  ...prev.metrics,
                  feasibility: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                }
              }))}
              className="input"
              min="0"
              max="100"
              required
            />
          </div>
        </div>

        {[
          { category: 'positive' as const, label: 'Positive Feedback' },
          { category: 'negative' as const, label: 'Negative Feedback' },
          { category: 'suggestions' as const, label: 'Suggestions' }
        ].map(({ category, label }) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <button
                type="button"
                onClick={() => addField(category)}
                className="p-1 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.feedback[category].map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateField(category, index, e.target.value)}
                  className="input"
                  placeholder={`Add ${label.toLowerCase()}`}
                />
                {formData.feedback[category].length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(category, index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Next Steps
            </label>
            <button
              type="button"
              onClick={() => addField('nextSteps')}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {formData.nextSteps.map((step, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={step}
                onChange={(e) => updateField('nextSteps', index, e.target.value)}
                className="input"
                placeholder="Add next step"
              />
              {formData.nextSteps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('nextSteps', index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
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
          {isLoading ? 'Adding Results...' : 'Add Test Results'}
        </button>
      </form>
    </div>
  );
}