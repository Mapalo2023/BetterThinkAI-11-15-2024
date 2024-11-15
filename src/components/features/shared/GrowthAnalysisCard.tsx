import React from 'react';
import { ChevronDown, ChevronUp, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface GrowthAnalysisCardProps {
  analysis: {
    id: string;
    businessModel: string;
    mrr: number;
    customerCount: number;
    growthGoals: string;
    analysis: {
      metrics: Array<{
        name: string;
        value: number;
        target: number;
        trend: 'up' | 'down' | 'stable';
        status: 'above' | 'below' | 'on-track';
        insights: string[];
      }>;
      projections: Array<{
        timeframe: string;
        revenue: number;
        customers: number;
        probability: number;
      }>;
      challenges: string[];
      opportunities: string[];
      kpis: Array<{
        name: string;
        current: number;
        target: number;
        importance: 'high' | 'medium' | 'low';
      }>;
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function GrowthAnalysisCard({ analysis, onDelete }: GrowthAnalysisCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above':
        return 'bg-green-100 text-green-700';
      case 'below':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{analysis.businessModel}</h3>
            <span className="text-sm text-gray-500">
              {formatCurrency(analysis.mrr)} MRR
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Generated on {analysis.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(analysis.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {analysis.analysis.metrics.slice(0, 3).map((metric) => (
          <div key={metric.name} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{metric.name}</span>
              {getTrendIcon(metric.trend)}
            </div>
            <div className="text-lg font-semibold">
              {typeof metric.value === 'number' ? formatCurrency(metric.value) : metric.value}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-500">
                Target: {formatCurrency(metric.target)}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(metric.status)}`}>
                {metric.status}
              </span>
            </div>
          </div>
        ))}
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
            <h4 className="font-medium mb-3">Growth Projections</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysis.analysis.projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeframe" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#10B981" 
                    name="Customers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Key Performance Indicators</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.analysis.kpis.map((kpi, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{kpi.name}</h5>
                    <span className={`text-sm ${getImportanceColor(kpi.importance)}`}>
                      {kpi.importance} priority
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Current</div>
                      <div className="font-medium">{formatCurrency(kpi.current)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Target</div>
                      <div className="font-medium">{formatCurrency(kpi.target)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Challenges</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.analysis.challenges.map((challenge, index) => (
                  <li key={index} className="text-gray-700">{challenge}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Opportunities</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.analysis.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-gray-700">{opportunity}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}