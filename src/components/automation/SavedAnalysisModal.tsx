import React from 'react';
import { X, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAutomationStore } from '../../store/automationStore';
import { AutomationResult } from '../../types/automation';

interface SavedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedAnalysisModal({ isOpen, onClose }: SavedAnalysisModalProps) {
  const results = useAutomationStore((state) => state.results);
  const removeResult = useAutomationStore((state) => state.removeResult);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const exportAnalyses = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-analyses-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMetrics = (result: AutomationResult) => (
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="text-sm">
        <span className="text-gray-500">Efficiency:</span>{' '}
        <span className="font-medium">{result.analysis.efficiency}%</span>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Potential:</span>{' '}
        <span className="font-medium">{result.analysis.potential}%</span>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Risk Level:</span>{' '}
        <span className="font-medium">{result.analysis.risk}%</span>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">ROI:</span>{' '}
        <span className="font-medium">{result.analysis.roi}%</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved Business Analyses</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={exportAnalyses}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Export Analyses"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No saved analyses yet. Start by analyzing your business!
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{result.businessInfo.name}</h3>
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          {result.businessInfo.industry}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Analyzed on {result.createdAt.toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700">{result.businessInfo.description}</p>
                      {renderMetrics(result)}
                      
                      <button
                        onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mt-3"
                      >
                        {expandedId === result.id ? (
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

                      {expandedId === result.id && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Recommendations</h4>
                            <div className="space-y-2">
                              {result.recommendations.map((rec, i) => (
                                <div key={i} className="bg-white p-3 rounded border border-gray-200">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium">{rec.title}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-green-100 text-green-700'
                                    }`}>
                                      {rec.priority}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{rec.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Opportunities</h4>
                            <div className="space-y-2">
                              {result.opportunities.map((opp, i) => (
                                <div key={i} className="bg-white p-3 rounded border border-gray-200">
                                  <h5 className="font-medium mb-1">{opp.title}</h5>
                                  <p className="text-sm text-gray-600">{opp.description}</p>
                                  <p className="text-sm text-blue-600 mt-1">
                                    Potential Value: {opp.potentialValue}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeResult(result.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Analysis"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}