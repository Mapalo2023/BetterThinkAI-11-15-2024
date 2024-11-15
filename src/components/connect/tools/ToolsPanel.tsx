import React from 'react';
import { Wrench, Plus, Search, Filter, Download, Settings } from 'lucide-react';
import ToolCard from './ToolCard';
import ToolConfigModal from './ToolConfigModal';
import { useChatContext } from '../../../contexts/ChatContext';
import { Tool } from '../../../types/tools';

export default function ToolsPanel() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showConfigModal, setShowConfigModal] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState<Tool | null>(null);
  const { sendMessage } = useChatContext();

  const [tools, setTools] = React.useState<Tool[]>([
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Integrate OpenAI models into your workflow',
      category: 'ai',
      icon: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg',
      connected: true,
      status: 'active',
      config: {
        apiKey: '',
        model: 'gpt-4',
        temperature: 0.7
      }
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Connect to GitHub repositories and workflows',
      category: 'development',
      icon: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg',
      connected: false,
      config: {
        accessToken: '',
        organization: '',
        repository: ''
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications and updates to Slack channels',
      category: 'communication',
      icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
      connected: true,
      status: 'active',
      config: {
        webhookUrl: '',
        channel: '',
        username: ''
      }
    }
  ]);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setShowConfigModal(true);
  };

  const handleToolUpdate = (updatedTool: Tool) => {
    setTools(prev => prev.map(tool => 
      tool.id === updatedTool.id ? updatedTool : tool
    ));
    sendMessage({
      type: 'tool-update',
      data: {
        toolId: updatedTool.id,
        status: updatedTool.status,
        config: updatedTool.config
      }
    });
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = {
    ai: 'AI & Machine Learning',
    development: 'Development',
    communication: 'Communication',
    analytics: 'Analytics',
    storage: 'Storage'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-500" />
          Available Tools
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
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
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Tool
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categories).map(([key, label]) => (
          <div key={key}>
            <h3 className="font-medium text-gray-900 mb-3">{label}</h3>
            <div className="space-y-3">
              {filteredTools
                .filter((tool) => tool.category === key)
                .map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onSelect={handleToolSelect}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {(showConfigModal || selectedTool) && (
        <ToolConfigModal
          tool={selectedTool}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedTool(null);
          }}
          onSave={handleToolUpdate}
        />
      )}
    </div>
  );
}