import React from 'react';
import { X, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useFeatureAnalysisStore } from '../../../store/features/featureAnalysisStore';

interface SavedFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedFeaturesModal({ isOpen, onClose }: SavedFeaturesModalProps) {
  const { features, removeFeature } = useFeatureAnalysisStore();
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const exportFeatures = () => {
    const data = JSON.stringify(features, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feature-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved Features</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={exportFeatures}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Export Features"
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
          {features.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No saved features yet. Start by analyzing a feature!
            </div>
          ) : (
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{feature.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          feature.analysis.priority === 'high' 
                            ? 'bg-red-100 text-red-700'
                            : feature.analysis.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {feature.analysis.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Analyzed on {feature.createdAt.toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700">{feature.description}</p>
                      
                      <button
                        onClick={() => setExpandedId(expandedId === feature.id ? null : feature.id)}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mt-3"
                      >
                        {expandedId === feature.id ? (
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

                      {expandedId === feature.id && (
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm">
                              <span className="text-gray-500">Impact:</span>{' '}
                              <span className="font-medium">{feature.analysis.impact}%</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Feasibility:</span>{' '}
                              <span className="font-medium">{feature.analysis.feasibility}%</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Dependencies</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {feature.analysis.dependencies.map((dep, index) => (
                                <li key={index} className="text-gray-700">{dep}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFeature(feature.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Feature"
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