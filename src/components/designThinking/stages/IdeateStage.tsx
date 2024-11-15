import React from 'react';
import { useDesignThinkingStore } from '../../../store/designThinkingStore';
import { Lightbulb, Plus, Trash2 } from 'lucide-react';
import AIHelper from '../AIHelper';

export default function IdeateStage() {
  const { addIdea, isLoading } = useDesignThinkingStore();
  const [context, setContext] = React.useState('');
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    impact: 0,
    feasibility: 0,
    tags: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      await addIdea({
        ...formData,
        tags: formData.tags.filter(Boolean)
      });
      setFormData({
        title: '',
        description: '',
        impact: 0,
        feasibility: 0,
        tags: ['']
      });
    }
  };

  const handleAISuggestions = (result: any) => {
    setFormData({
      title: result.title,
      description: result.description,
      impact: result.impact,
      feasibility: result.feasibility,
      tags: result.tags
    });
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const updateTag = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Generate Ideas</h2>
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
            placeholder="Describe the problem to solve"
            className="input flex-1"
          />
          <AIHelper
            stage="ideate"
            context={context}
            onResult={handleAISuggestions}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Idea Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="input min-h-[100px]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
              Potential Impact (1-100)
            </label>
            <input
              type="number"
              id="impact"
              value={formData.impact}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                impact: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
              }))}
              className="input"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label htmlFor="feasibility" className="block text-sm font-medium text-gray-700 mb-1">
              Feasibility (1-100)
            </label>
            <input
              type="number"
              id="feasibility"
              value={formData.feasibility}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                feasibility: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
              }))}
              className="input"
              min="0"
              max="100"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <button
              type="button"
              onClick={addTag}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="input"
                placeholder="Add a tag"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
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
          {isLoading ? 'Adding Idea...' : 'Add Idea'}
        </button>
      </form>
    </div>
  );
}