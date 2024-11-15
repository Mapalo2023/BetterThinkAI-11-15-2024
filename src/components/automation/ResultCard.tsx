import React from 'react';
import { AutomationResult } from '../../types/automation';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface ResultCardProps {
  result: AutomationResult;
  onDelete: (id: string) => void;
}

export default function ResultCard({ result, onDelete }: ResultCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{result.businessInfo.name}</h3>
          <p className="text-sm text-gray-500">
            {result.businessInfo.industry} • Generated on {result.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(result.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{result.businessInfo.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {result.analysis.efficiency}%
          </div>
          <div className="text-sm text-gray-600">Efficiency</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {result.analysis.potential}%
          </div>
          <div className="text-sm text-gray-600">Potential</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {result.analysis.risk}%
          </div>
          <div className="text-sm text-gray-600">Risk Level</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {result.analysis.roi}%
          </div>
          <div className="text-sm text-gray-600">ROI Potential</div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mb-4"
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
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Recommendations</h4>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{rec.title}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      rec.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Impact: {rec.impact}%</span>
                    <span className="text-gray-500">Timeframe: {rec.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Opportunities</h4>
            <div className="space-y-3">
              {result.opportunities.map((opp, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h5 className="font-medium mb-2">{opp.title}</h5>
                  <p className="text-gray-600 mb-2">{opp.description}</p>
                  <div className="text-sm text-blue-600 mb-2">
                    Potential Value: {opp.potentialValue}
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-1">Requirements:</h6>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {opp.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}