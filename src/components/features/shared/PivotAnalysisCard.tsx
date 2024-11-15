import React from 'react';
import { ChevronDown, ChevronUp, Trash2, RefreshCw } from 'lucide-react';

interface PivotAnalysisCardProps {
  analysis: {
    id: string;
    currentModel: string;
    challenges: string[];
    marketChanges: string[];
    coreStrengths: string[];
    analysis: {
      pivotNecessity: 'high' | 'medium' | 'low';
      urgency: 'immediate' | 'medium-term' | 'long-term';
      options: Array<{
        model: string;
        description: string;
        marketSize: number;
        competitionLevel: 'high' | 'medium' | 'low';
        feasibility: number;
        timeToMarket: string;
        resourceRequirements: string[];
        risks: string[];
        benefits: string[];
      }>;
      impactAssessment: Array<{
        category: string;
        impact: 'positive' | 'negative' | 'neutral';
        details: string[];
      }>;
      retainableAssets: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function PivotAnalysisCard({ analysis, onDelete }: PivotAnalysisCardProps) {
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

  const getNecessityColor = (necessity: string) => {
    switch (necessity) {
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-100 text-red-700';
      case 'medium-term':
        return 'bg-yellow-100 text-yellow-700';
      case 'long-term':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'bg-green-100 text-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700';
      case 'neutral':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{analysis.currentModel}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getNecessityColor(analysis.analysis.pivotNecessity)}`}>
              {analysis.analysis.pivotNecessity} necessity
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
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-semibold text-blue-600">
            {analysis.analysis.options.length}
          </div>
          <div className="text-sm text-gray-600">Pivot Options</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-semibold text-purple-600">
            {analysis.analysis.retainableAssets.length}
          </div>
          <div className="text-sm text-gray-600">Retainable Assets</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className={`text-lg font-semibold ${getUrgencyColor(analysis.analysis.urgency)}`}>
            {analysis.analysis.urgency}
          </div>
          <div className="text-sm text-gray-600">Urgency</div>
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
            <h4 className="font-medium mb-3">Pivot Options</h4>
            <div className="space-y-4">
              {analysis.analysis.options.map((option, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{option.model}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Market Size: {formatCurrency(option.marketSize)}
                      </span>
                      <span className={`text-sm font-medium ${getCompetitionColor(option.competitionLevel)}`}>
                        {option.competitionLevel} competition
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{option.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Benefits</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {option.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm text-gray-600">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Risks</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {option.risks.map((risk, i) => (
                          <li key={i} className="text-sm text-gray-600">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Resource Requirements</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {option.resourceRequirements.map((req, i) => (
                          <li key={i} className="text-sm text-gray-600">{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Feasibility Score</h6>
                      <div className="text-lg font-semibold text-blue-600">
                        {option.feasibility}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Time to Market: {option.timeToMarket}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Impact Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.analysis.impactAssessment.map((assessment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{assessment.category}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getImpactColor(assessment.impact)}`}>
                      {assessment.impact} impact
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {assessment.details.map((detail, i) => (
                      <li key={i} className="text-sm text-gray-600">{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Retainable Assets</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.analysis.retainableAssets.map((asset, index) => (
                <li key={index} className="text-gray-700">{asset}</li>
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