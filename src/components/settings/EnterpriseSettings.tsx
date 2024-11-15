import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EnterpriseSettings() {
  const { user } = useAuthStore();
  const { subscription, setCustomApiKey } = useSubscriptionStore();
  const [apiKey, setApiKey] = React.useState('');

  if (!user || subscription?.tier !== 'enterprise') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    try {
      await setCustomApiKey(user.uid, apiKey);
      setApiKey('');
    } catch (error) {
      toast.error('Failed to update API key');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Key className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Custom OpenAI API Key</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Your OpenAI API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="input"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save API Key
        </button>
      </form>

      <p className="text-sm text-gray-500">
        Enterprise users can use their own OpenAI API key for generations.
        This allows for better control and billing management.
      </p>
    </div>
  );
}