import React from 'react';
import { ChevronDown, ChevronUp, Trash2, Wallet } from 'lucide-react';

interface FundingStrategyCardProps {
  strategy: {
    id: string;
    stage: string;
    industry: string;
    monthlyRevenue: number;
    fundingRequired: number;
    useOfFunds: string;
    analysis: {
      totalFunding: number;
      valuation: number;
      sources: Array<{
        type: string;
        description: string;
        amount: number;
        requirements: string[];
        pros: string[];
        cons: string[];
        timeline: string;
      }>;
      timeline: Array<{
        phase: string;
        activities: string[];
        duration: string;
      }>;
      risks: string[];
      metrics: Array<{
        name: string;
        target: string;
        importance: 'high' | 'medium' | 'low';
      }>;
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function FundingStrategyCard({ strategy, onDelete }: FundingStrategyCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
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
            <h3 className="text-xl font-semibold text-gray-900">{strategy.industry}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
              {strategy.stage}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Generated on {strategy.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(strategy.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(strategy.analysis.totalFunding)}
          </div>
          <div className="text-sm text-gray-600">Total Funding</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(strategy.analysis.valuation)}
          </div>
          <div className="text-sm text-gray-600">Valuation</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(strategy.monthlyRevenue)}
          </div>
          <div className="text-sm text-gray-600">Monthly Revenue</div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{strategy.useOfFunds}</p>

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
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-medium mb-3">Funding Sources</h4>
            <div className="space-y-3">
              {strategy.analysis.sources.map((source, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{source.type}</h5>
                      <p className="text-sm text-gray-600">{source.timeline}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(source.amount)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{source.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Pros</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {source.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-600">{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Cons</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {source.cons.map((con, i) => (
                          <li key={i} className="text-sm text-gray-600">{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h6 className="text-sm font-medium text-gray-900 mb-1">Requirements</h6>
                    <ul className="list-disc list-inside space-y-1">
                      {source.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-gray-600">{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Fundraising Timeline</h4>
            <div className="space-y-3">
              {strategy.analysis.timeline.map((phase, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{phase.phase}</h5>
                    <span className="text-sm text-gray-600">{phase.duration}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {phase.activities.map((activity, i) => (
                      <li key={i} className="text-sm text-gray-600">{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Key Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategy.analysis.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{metric.name}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getImportanceColor(metric.importance)}`}>
                      {metric.importance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Target: {metric.target}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Risks</h4>
            <ul className="list-disc list-inside space-y-1">
              {strategy.analysis.risks.map((risk, index) => (
                <li key={index} className="text-gray-700">{risk}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {strategy.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}