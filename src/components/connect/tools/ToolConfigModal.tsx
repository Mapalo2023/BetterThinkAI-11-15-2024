import React from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Tool } from '../../../types/tools';

interface ToolConfigModalProps {
  tool: Tool | null;
  onClose: () => void;
  onSave: (tool: Tool) => void;
}

export default function ToolConfigModal({ tool, onClose, onSave }: ToolConfigModalProps) {
  const [config, setConfig] = React.useState<Record<string, any>>(
    tool?.config || {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool) return;

    onSave({
      ...tool,
      connected: true,
      status: 'active',
      config
    });
    onClose();
  };

  if (!tool) return null;

  const renderConfigField = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center gap-2">
          <input
            type="checkbox"
            id={key}
            checked={config[key]}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              [key]: e.target.checked
            }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={key} className="text-sm font-medium text-gray-700">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div key={key}>
          <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="number"
            id={key}
            value={config[key]}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              [key]: parseFloat(e.target.value)
            }))}
            className="input"
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <select
            id={key}
            value={config[key]}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              [key]: e.target.value
            }))}
            className="input"
          >
            {value.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={key}>
        <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
        </label>
        <input
          type={key.toLowerCase().includes('password') || key.toLowerCase().includes('key') ? 'password' : 'text'}
          id={key}
          value={config[key]}
          onChange={(e) => setConfig(prev => ({
            ...prev,
            [key]: e.target.value
          }))}
          className="input"
          placeholder={`Enter ${key.toLowerCase()}`}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={tool.icon}
              alt={tool.name}
              className="w-8 h-8 object-contain"
            />
            <h2 className="text-xl font-semibold">{tool.name} Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {Object.entries(tool.config).map(([key, value]) =>
            renderConfigField(key, value)
          )}

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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}