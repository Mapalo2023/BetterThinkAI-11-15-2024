import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface CustomIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (integration: {
    name: string;
    description: string;
    category: string;
    icon: string;
    config: Record<string, string>;
  }) => void;
}

export default function CustomIntegrationModal({ isOpen, onClose, onAdd }: CustomIntegrationModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    category: 'crm',
    icon: '',
    config: [{ key: '', value: '' }]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const configObject = formData.config.reduce((acc, { key, value }) => {
      if (key.trim() && value.trim()) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    onAdd({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      icon: formData.icon,
      config: configObject
    });

    setFormData({
      name: '',
      description: '',
      category: 'crm',
      icon: '',
      config: [{ key: '', value: '' }]
    });
    onClose();
  };

  const addConfigField = () => {
    setFormData(prev => ({
      ...prev,
      config: [...prev.config, { key: '', value: '' }]
    }));
  };

  const removeConfigField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      config: prev.config.filter((_, i) => i !== index)
    }));
  };

  const updateConfigField = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      config: prev.config.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Custom Integration</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Integration Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input"
                placeholder="Enter integration name"
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
                placeholder="Describe the integration"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="input"
                required
              >
                <option value="crm">Customer Management</option>
                <option value="communication">Communication</option>
                <option value="productivity">Productivity</option>
                <option value="storage">Storage & Files</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon URL
              </label>
              <input
                type="url"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="input"
                placeholder="Enter icon URL"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Configuration
                </label>
                <button
                  type="button"
                  onClick={addConfigField}
                  className="p-1 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {formData.config.map((field, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => updateConfigField(index, 'key', e.target.value)}
                      className="input flex-1"
                      placeholder="Key"
                      required
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateConfigField(index, 'value', e.target.value)}
                      className="input flex-1"
                      placeholder="Value"
                      required
                    />
                    {formData.config.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeConfigField(index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Integration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}