import React from 'react';
import { CreditCard, Star, Zap } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import toast from 'react-hot-toast';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    credits: 10,
    features: [
      'Basic AI generations',
      '10 credits per month',
      'Standard support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    credits: 100,
    features: [
      'Advanced AI generations',
      '100 credits per month',
      'Priority support',
      'Export functionality',
      'Team collaboration'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99',
    credits: 500,
    features: [
      'Custom AI generations',
      '500 credits per month',
      '24/7 Premium support',
      'Custom API key integration',
      'Advanced analytics',
      'Dedicated account manager'
    ]
  }
];

export default function SubscriptionSettings() {
  const { profile, updateSubscription } = useUserStore();
  const [customApiKey, setCustomApiKey] = React.useState('');

  const handleUpgrade = async (planId: string) => {
    // In a real app, integrate with a payment provider here
    try {
      await updateSubscription({
        plan: planId as 'free' | 'pro' | 'enterprise',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      toast.success(`Successfully upgraded to ${planId} plan`);
    } catch (error) {
      toast.error('Failed to upgrade subscription');
    }
  };

  const handleCustomApiKey = async () => {
    if (!customApiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    try {
      await updateSubscription({
        customApiKey
      });
      setCustomApiKey('');
      toast.success('Custom API key updated successfully');
    } catch (error) {
      toast.error('Failed to update custom API key');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">
                You are currently on the {profile?.subscription.plan} plan
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Credits available: {profile?.credits.available}
              </p>
            </div>
            <Star className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-xl border ${
              profile?.subscription.plan === plan.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">{plan.name}</h4>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold">{plan.price}</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-blue-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={profile?.subscription.plan === plan.id}
              className={`w-full btn ${
                profile?.subscription.plan === plan.id
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {profile?.subscription.plan === plan.id ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {profile?.subscription.plan === 'enterprise' && (
        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold mb-4">Custom OpenAI API Key</h4>
          <div className="flex gap-4">
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="input flex-1"
            />
            <button
              onClick={handleCustomApiKey}
              className="btn btn-primary"
            >
              Save Key
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Enterprise users can use their own OpenAI API key for generations
          </p>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600">
          <CreditCard className="w-5 h-5" />
          <p className="text-sm">
            Secure payments processed by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}