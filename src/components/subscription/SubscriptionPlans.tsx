import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { Check, Zap } from 'lucide-react';
import { SubscriptionPlan } from '../../types/subscription';
import toast from 'react-hot-toast';

const plans: SubscriptionPlan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: 0,
    credits: 50,
    features: [
      'Basic AI Generations',
      '50 Credits/month',
      'Standard Support'
    ]
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 29,
    credits: 500,
    features: [
      'Advanced AI Generations',
      '500 Credits/month',
      'Priority Support',
      'Export Features',
      'Team Collaboration'
    ]
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    price: 99,
    credits: -1, // Unlimited
    features: [
      'Unlimited AI Generations',
      'Custom API Key Integration',
      'Dedicated Support',
      'Advanced Analytics',
      'Custom Integrations',
      'SLA Guarantee'
    ]
  }
];

export default function SubscriptionPlans() {
  const { user } = useAuthStore();
  const { subscription, updateSubscription, updateCredits } = useSubscriptionStore();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    try {
      await updateSubscription(user.uid, plan.tier);
      if (plan.credits > 0) {
        await updateCredits(user.uid, plan.credits);
      }
      toast.success(`Successfully subscribed to ${plan.name} plan`);
    } catch (error) {
      toast.error('Failed to process subscription');
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`rounded-lg shadow-lg bg-white overflow-hidden ${
                plan.tier === 'pro' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.tier === 'pro' && (
                <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-500">
                  {plan.credits === -1 ? 'Unlimited' : plan.credits} credits per month
                </p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscription?.tier === plan.tier}
                  className={`mt-8 w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                    subscription?.tier === plan.tier
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {subscription?.tier === plan.tier ? (
                    'Current Plan'
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}