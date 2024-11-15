import React from 'react';
import { ChevronDown, ChevronUp, Trash2, TrendingUp } from 'lucide-react';

interface MarketAnalysisCardProps {
  analysis: {
    id: string;
    industry: string;
    targetMarket: string;
    region: string;
    competitors: Array<{
      name: string;
      strengths: string[];
      weaknesses: string[];
      marketShare: number;
      threat: 'high' | 'medium' | 'low';
    }>;
    analysis: {
      marketSize: number;
      growthRate: number;
      segments: Array<{
        name: string;
        size: number;
        growth: number;
        description: string;
        opportunities: string[];
        challenges: string[];
      }>;
      trends: string[];
      barriers: string[];
      risks: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function MarketAnalysisCard({ analysis, onDelete }: MarketAnalysisCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount * 1000000); // Convert millions to actual amount
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
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
            <h3 className="text-xl font-semibold text-gray-900">{analysis.industry}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
              {analysis.region}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Target: {analysis.targetMarket} • Generated on {analysis.createdAt.toLocaleDateString()}
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
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(analysis.analysis.marketSize)}
          </div>
          <div className="text-sm text-gray-600">Market Size</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatPercentage(analysis.analysis.growthRate)}
          </div>
          <div className="text-sm text-gray-600">Growth Rate</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {analysis.competitors.length}
          </div>
          <div className="text-sm text-gray-600">Competitors</div>
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
            <h4 className="font-medium mb-3">Market Segments</h4>
            <div className="space-y-3">
              {analysis.analysis.segments.map((segment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{segment.name}</h5>
                    <div className="text-sm">
                      <span className="text-blue-600">{formatCurrency(segment.size)}</span>
                      <span className="mx-2">•</span>
                      <span className="text-green-600">{formatPercentage(segment.growth)} growth</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{segment.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Opportunities</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {segment.opportunities.map((opp, i) => (
                          <li key={i} className="text-sm text-gray-600">{opp}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Challenges</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {segment.challenges.map((challenge, i) => (
                          <li key={i} className="text-sm text-gray-600">{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Competitor Analysis</h4>
            <div className="space-y-3">
              {analysis.competitors.map((competitor, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {formatPercentage(competitor.marketShare)} market share
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getThreatColor(competitor.threat)}`}>
                        {competitor.threat} threat
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Strengths</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {competitor.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-gray-600">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Weaknesses</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {competitor.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-gray-600">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Market Trends</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.analysis.trends.map((trend, index) => (
                <li key={index} className="text-gray-700">{trend}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Entry Barriers</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.analysis.barriers.map((barrier, index) => (
                <li key={index} className="text-gray-700">{barrier}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Market Risks</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.analysis.risks.map((risk, index) => (
                <li key={index} className="text-gray-700">{risk}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Strategic Recommendations</h4>
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