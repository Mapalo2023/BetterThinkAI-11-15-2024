import React from 'react';
import { Settings as SettingsIcon, User, Key, Palette, CreditCard } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import APISettings from './APISettings';
import PreferenceSettings from './PreferenceSettings';
import SubscriptionSettings from './SubscriptionSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'api' | 'preferences' | 'subscription'>('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'api' as const, label: 'API Keys', icon: Key },
    { id: 'preferences' as const, label: 'Preferences', icon: Palette },
    { id: 'subscription' as const, label: 'Subscription', icon: CreditCard }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-500" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'api' && <APISettings />}
          {activeTab === 'preferences' && <PreferenceSettings />}
          {activeTab === 'subscription' && <SubscriptionSettings />}
        </div>
      </div>
    </div>
  );
}