import React from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface FeatureCardProps {
  feature: {
    id: string;
    name: string;
    description: string;
    analysis: {
      impact: number;
      feasibility: number;
      priority: 'high' | 'medium' | 'low';
      timeEstimate: string;
      dependencies: string[];
      risks: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function FeatureCard({ feature, onDelete }: FeatureCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{feature.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(feature.analysis.priority)}`}>
              {feature.analysis.priority} priority
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Analyzed on {feature.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(feature.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{feature.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {feature.analysis.impact}%
          </div>
          <div className="text-sm text-gray-600">Impact</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {feature.analysis.feasibility}%
          </div>
          <div className="text-sm text-gray-600">Feasibility</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg col-span-2">
          <div className="text-lg font-bold text-purple-600">
            {feature.analysis.timeEstimate}
          </div>
          <div className="text-sm text-gray-600">Estimated Time</div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show Details
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Dependencies</h4>
            <ul className="list-disc list-inside space-y-1">
              {feature.analysis.dependencies.map((dep, index) => (
                <li key={index} className="text-gray-700">{dep}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Risks</h4>
            <ul className="list-disc list-inside space-y-1">
              {feature.analysis.risks.map((risk, index) => (
                <li key={index} className="text-gray-700">{risk}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {feature.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}