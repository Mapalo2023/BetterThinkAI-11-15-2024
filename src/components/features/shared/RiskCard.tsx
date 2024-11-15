import React from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface RiskCardProps {
  risk: {
    id: string;
    name: string;
    description: string;
    category: string;
    analysis: {
      probability: number;
      impact: number;
      severity: 'high' | 'medium' | 'low';
      urgency: number;
      mitigation: string[];
      contingency: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function RiskCard({ risk, onDelete }: RiskCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
            <h3 className="text-xl font-semibold text-gray-900">{risk.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(risk.analysis.severity)}`}>
              {risk.analysis.severity} severity
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {risk.category} • Analyzed on {risk.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(risk.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{risk.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {risk.analysis.probability}%
          </div>
          <div className="text-sm text-gray-600">Probability</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {risk.analysis.impact}%
          </div>
          <div className="text-sm text-gray-600">Impact</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {risk.analysis.urgency}%
          </div>
          <div className="text-sm text-gray-600">Urgency</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {risk.category}
          </div>
          <div className="text-sm text-gray-600">Category</div>
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
            <h4 className="font-medium mb-2">Mitigation Strategies</h4>
            <ul className="list-disc list-inside space-y-1">
              {risk.analysis.mitigation.map((strategy, index) => (
                <li key={index} className="text-gray-700">{strategy}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Contingency Plans</h4>
            <ul className="list-disc list-inside space-y-1">
              {risk.analysis.contingency.map((plan, index) => (
                <li key={index} className="text-gray-700">{plan}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {risk.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}