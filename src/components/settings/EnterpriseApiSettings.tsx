import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Key, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EnterpriseApiSettings() {
  const { subscription, updateCustomApiKey, loading } = useAuthStore();
  const [apiKey, setApiKey] = React.useState(subscription?.customApiKey || '');
  const [showKey, setShowKey] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCustomApiKey(apiKey);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (subscription?.tier !== 'enterprise') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
        <p>Custom API key settings are only available for Enterprise users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-500" />
          Custom OpenAI API Key
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Use your own OpenAI API key for AI generations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
          <p>
            Your API key will be used instead of the default key for all AI operations.
            Make sure your API key has sufficient quota and permissions.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Saving...' : 'Save API Key'}
        </button>
      </form>
    </div>
  );
}