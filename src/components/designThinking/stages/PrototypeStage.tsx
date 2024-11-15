import React from 'react';
import { useDesignThinkingStore } from '../../../store/designThinkingStore';
import { PenTool, Plus, Trash2 } from 'lucide-react';
import AIHelper from '../AIHelper';

export default function PrototypeStage() {
  const { addPrototype, isLoading } = useDesignThinkingStore();
  const [context, setContext] = React.useState('');
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    type: 'sketch' as const,
    imageUrls: [''],
    features: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      await addPrototype({
        ...formData,
        imageUrls: formData.imageUrls.filter(Boolean),
        features: formData.features.filter(Boolean)
      });
      setFormData({
        title: '',
        description: '',
        type: 'sketch',
        imageUrls: [''],
        features: ['']
      });
    }
  };

  const handleAISuggestions = (result: any) => {
    setFormData({
      title: result.title,
      description: result.description,
      type: result.type,
      imageUrls: result.imageUrls,
      features: result.features
    });
  };

  const addField = (field: 'imageUrls' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'imageUrls' | 'features', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'imageUrls' | 'features', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <PenTool className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Create Prototype</h2>
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
            placeholder="Describe your solution concept"
            className="input flex-1"
          />
          <AIHelper
            stage="prototype"
            context={context}
            onResult={handleAISuggestions}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Prototype Title
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

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Prototype Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              type: e.target.value as 'sketch' | 'wireframe' | 'mockup'
            }))}
            className="input"
            required
          >
            <option value="sketch">Sketch</option>
            <option value="wireframe">Wireframe</option>
            <option value="mockup">Mockup</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Image URLs
            </label>
            <button
              type="button"
              onClick={() => addField('imageUrls')}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => updateField('imageUrls', index, e.target.value)}
                className="input"
                placeholder="Add image URL"
              />
              {formData.imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('imageUrls', index)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Key Features
            </label>
            <button
              type="button"
              onClick={() => addField('features')}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateField('features', index, e.target.value)}
                className="input"
                placeholder="Add a feature"
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField('features', index)}
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
          {isLoading ? 'Adding Prototype...' : 'Add Prototype'}
        </button>
      </form>
    </div>
  );
}