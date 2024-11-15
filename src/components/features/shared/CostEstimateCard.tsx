import React from 'react';
import { ChevronDown, ChevronUp, Trash2, DollarSign } from 'lucide-react';

interface CostEstimateCardProps {
  estimate: {
    id: string;
    projectName: string;
    description: string;
    timeline: number;
    teamSize: number;
    analysis: {
      totalCost: number;
      monthlyBurn: number;
      breakdown: Array<{
        category: string;
        amount: number;
        description: string;
        frequency: 'one-time' | 'monthly' | 'yearly';
      }>;
      assumptions: string[];
      risks: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function CostEstimateCard({ estimate, onDelete }: CostEstimateCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{estimate.projectName}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
              {estimate.timeline} months
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Team Size: {estimate.teamSize} • Generated on {estimate.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(estimate.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{estimate.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(estimate.analysis.totalCost)}
          </div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(estimate.analysis.monthlyBurn)}
          </div>
          <div className="text-sm text-gray-600">Monthly Burn</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(estimate.analysis.monthlyBurn * estimate.timeline)}
          </div>
          <div className="text-sm text-gray-600">Total Burn</div>
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
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-medium mb-3">Cost Breakdown</h4>
            <div className="space-y-3">
              {estimate.analysis.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{item.category}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="text-xs text-gray-500">{item.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Assumptions</h4>
            <ul className="list-disc list-inside space-y-1">
              {estimate.analysis.assumptions.map((assumption, index) => (
                <li key={index} className="text-gray-700">{assumption}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Risks</h4>
            <ul className="list-disc list-inside space-y-1">
              {estimate.analysis.risks.map((risk, index) => (
                <li key={index} className="text-gray-700">{risk}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Cost Optimization Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {estimate.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}