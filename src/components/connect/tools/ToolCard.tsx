import React from 'react';
import { Check, ExternalLink, Settings } from 'lucide-react';
import { Tool } from '../../../types/tools';

interface ToolCardProps {
  tool: Tool;
  onSelect: (tool: Tool) => void;
}

export default function ToolCard({ tool, onSelect }: ToolCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors group">
      <div className="flex items-center gap-3">
        <img
          src={tool.icon}
          alt={tool.name}
          className="w-8 h-8 object-contain"
        />
        <div>
          <h4 className="font-medium text-gray-900">{tool.name}</h4>
          <p className="text-sm text-gray-600">{tool.description}</p>
        </div>
      </div>
      {tool.connected ? (
        <div className="flex items-center gap-2">
          {tool.status && (
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              tool.status === 'active' ? 'bg-green-100 text-green-700' :
              tool.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {tool.status}
            </span>
          )}
          <button
            onClick={() => onSelect(tool)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => onSelect(tool)}
          className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}