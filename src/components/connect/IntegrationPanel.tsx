import React from 'react';
import { Plus, Check, ExternalLink, Search, Filter, Download } from 'lucide-react';
import CustomIntegrationModal from './CustomIntegrationModal';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'crm' | 'communication' | 'productivity' | 'storage' | 'analytics';
  icon: string;
  connected: boolean;
  status?: 'active' | 'pending' | 'error';
  config?: Record<string, string>;
}

export default function IntegrationPanel() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCustomModal, setShowCustomModal] = React.useState(false);
  const [integrations, setIntegrations] = React.useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and collaboration platform',
      category: 'communication',
      icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
      connected: true,
      status: 'active'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Customer relationship management platform',
      category: 'crm',
      icon: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg',
      connected: false
    },
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      description: 'Business productivity and collaboration tools',
      category: 'productivity',
      icon: 'https://cdn.worldvectorlogo.com/logos/google-workspace-icon-2020.svg',
      connected: true,
      status: 'active'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Cloud storage and file synchronization',
      category: 'storage',
      icon: 'https://cdn.worldvectorlogo.com/logos/dropbox-1.svg',
      connected: false
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing, sales, and CRM platform',
      category: 'crm',
      icon: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg',
      connected: false
    },
    {
      id: 'segment',
      name: 'Segment',
      description: 'Customer data platform',
      category: 'analytics',
      icon: 'https://cdn.worldvectorlogo.com/logos/segment.svg',
      connected: true,
      status: 'pending'
    }
  ]);

  const categories = {
    crm: 'Customer Management',
    communication: 'Communication',
    productivity: 'Productivity',
    storage: 'Storage & Files',
    analytics: 'Analytics'
  };

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const handleAddCustom = (customIntegration: {
    name: string;
    description: string;
    category: string;
    icon: string;
    config: Record<string, string>;
  }) => {
    const newIntegration: Integration = {
      id: crypto.randomUUID(),
      name: customIntegration.name,
      description: customIntegration.description,
      category: customIntegration.category as Integration['category'],
      icon: customIntegration.icon,
      connected: true,
      status: 'pending',
      config: customIntegration.config
    };

    setIntegrations(prev => [newIntegration, ...prev]);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Available Integrations</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categories).map(([key, label]) => (
          <div key={key} className="space-y-4">
            <h3 className="font-medium text-gray-900">{label}</h3>
            <div className="space-y-3">
              {filteredIntegrations
                .filter((integration) => integration.category === key)
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={integration.icon}
                        alt={integration.name}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <div className="flex items-center gap-2">
                        {integration.status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(integration.status)}`}>
                            {integration.status}
                          </span>
                        )}
                        <button
                          onClick={() => handleConnect(integration.id)}
                          className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleConnect(integration.id)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <CustomIntegrationModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onAdd={handleAddCustom}
      />
    </div>
  );
}