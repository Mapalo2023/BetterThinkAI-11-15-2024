import React from 'react';
import { Idea } from '../../types/brainstorm';
import { Trash2, ChevronDown, ChevronUp, Beaker } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  onDelete: (id: string) => void;
  onEvaluate: (id: string) => void;
  isLoading: boolean;
}

export default function IdeaCard({ idea, onDelete, onEvaluate, isLoading }: IdeaCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              idea.source === 'AI' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {idea.source}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Generated on {idea.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(idea.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{idea.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {idea.analysis.marketPotential}%
          </div>
          <div className="text-sm text-gray-600">Market Potential</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {idea.analysis.innovationScore}%
          </div>
          <div className="text-sm text-gray-600">Innovation Score</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {idea.analysis.feasibilityScore}%
          </div>
          <div className="text-sm text-gray-600">Feasibility Score</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {idea.analysis.riskLevel}%
          </div>
          <div className="text-sm text-gray-600">Risk Level</div>
        </div>
      </div>

      {idea.sipAnalysis ? (
        <div className={`p-4 rounded-lg mb-4 ${
          idea.sipAnalysis.verdict === 'SIP' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-lg font-semibold ${
              idea.sipAnalysis.verdict === 'SIP' ? 'text-green-700' : 'text-red-700'
            }`}>
              Verdict: {idea.sipAnalysis.verdict}
            </h4>
            <span className="text-2xl font-bold">
              {idea.sipAnalysis.score}%
            </span>
          </div>
          
          <div className="space-y-3">
            <div>
              <h5 className="font-medium mb-1">Key Reasoning:</h5>
              <ul className="list-disc list-inside space-y-1">
                {idea.sipAnalysis.reasoning.map((reason, index) => (
                  <li key={index} className="text-gray-700">{reason}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-1">Recommendations:</h5>
              <ul className="list-disc list-inside space-y-1">
                {idea.sipAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onEvaluate(idea.id)}
          disabled={isLoading}
          className="w-full btn btn-primary mb-4 flex items-center justify-center gap-2"
        >
          <Beaker className="w-5 h-5" />
          {isLoading ? 'Evaluating...' : 'Conduct SIP/SPIT Analysis'}
        </button>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide SWOT Analysis
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show SWOT Analysis
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
            <ul className="list-disc list-inside space-y-1">
              {idea.swotAnalysis.strengths.map((strength, index) => (
                <li key={index} className="text-gray-700">{strength}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-700 mb-2">Weaknesses</h4>
            <ul className="list-disc list-inside space-y-1">
              {idea.swotAnalysis.weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-700">{weakness}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Opportunities</h4>
            <ul className="list-disc list-inside space-y-1">
              {idea.swotAnalysis.opportunities.map((opportunity, index) => (
                <li key={index} className="text-gray-700">{opportunity}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-semibold text-orange-700 mb-2">Threats</h4>
            <ul className="list-disc list-inside space-y-1">
              {idea.swotAnalysis.threats.map((threat, index) => (
                <li key={index} className="text-gray-700">{threat}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}