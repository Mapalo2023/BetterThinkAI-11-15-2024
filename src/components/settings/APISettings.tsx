import React from 'react';
import { Eye, EyeOff, Plus, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
}

export default function APISettings() {
  const { userRole } = useAuthStore();
  const [apiKeys, setApiKeys] = React.useState<APIKey[]>([]);
  const [showNewKeyForm, setShowNewKeyForm] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState('');
  const [visibleKeys, setVisibleKeys] = React.useState<string[]>([]);

  if (!userRole?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShieldAlert className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Access Required</h3>
        <p className="text-gray-500 max-w-md">
          The API Keys section is restricted to administrators only. Please contact an administrator if you need access to API keys.
        </p>
      </div>
    );
  }

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev =>
      prev.includes(id) ? prev.filter(key => key !== id) : [...prev, id]
    );
  };

  const addNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const newKey: APIKey = {
      id: crypto.randomUUID(),
      name: newKeyName,
      key: `sk-${Array.from({ length: 48 }, () => 
        Math.random().toString(36)[2]).join('')}`,
      createdAt: new Date()
    };

    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyName('');
    setShowNewKeyForm(false);
    toast.success('API key created successfully');
  };

  const deleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast.success('API key deleted successfully');
  };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
          <p className="text-sm text-gray-500">
            Manage your API keys for external integrations
          </p>
        </div>
        <button
          onClick={() => setShowNewKeyForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New API Key
        </button>
      </div>

      {showNewKeyForm && (
        <form onSubmit={addNewKey} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                Key Name
              </label>
              <input
                type="text"
                id="keyName"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="input"
                placeholder="e.g., Development API Key"
                required
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary">
                Create Key
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {apiKeys.map(key => (
          <div
            key={key.id}
            className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{key.name}</h4>
                <span className="text-xs text-gray-500">
                  Created on {key.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {visibleKeys.includes(key.id)
                    ? key.key
                    : '••••••••••••••••••••••'}
                </code>
                <button
                  onClick={() => toggleKeyVisibility(key.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {visibleKeys.includes(key.id) ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={() => deleteKey(key.id)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        {apiKeys.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No API keys yet. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}