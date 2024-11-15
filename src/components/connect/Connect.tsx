import React from 'react';
import { Network } from 'lucide-react';
import IntegrationPanel from './IntegrationPanel';
import WorkflowBuilder from './WorkflowBuilder';
import DataInsights from './DataInsights';
import AIChat from './AIChat';
import ToolsPanel from './tools/ToolsPanel';
import ToolQueryHandler from './tools/ToolQueryHandler';
import { ChatProvider } from '../../contexts/ChatContext';

export default function Connect() {
  const [activeTab, setActiveTab] = React.useState<'integrations' | 'workflows' | 'insights' | 'tools'>('tools');
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const tabs = [
    { id: 'tools', label: 'Tools' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'workflows', label: 'Workflow Builder' },
    { id: 'insights', label: 'Data Insights' }
  ];

  return (
    <ChatProvider>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-500" />
            BetterThink Connect
          </h1>
          <p className="text-gray-500 mt-1">
            Unify your data, automate workflows, and gain real-time insights
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-4">
              <div className="flex">
                {tabs.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                AI Chat Assistant
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'tools' && <ToolsPanel />}
            {activeTab === 'integrations' && <IntegrationPanel />}
            {activeTab === 'workflows' && <WorkflowBuilder />}
            {activeTab === 'insights' && <DataInsights />}
          </div>
        </div>

        <ToolQueryHandler />
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </ChatProvider>
  );
}