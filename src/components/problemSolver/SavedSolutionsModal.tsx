import React from 'react';
import { X, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useProblemSolverStore } from '../../store/problemSolverStore';
import { Solution } from '../../types/problemSolver';

interface SavedSolutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedSolutionsModal({ isOpen, onClose }: SavedSolutionsModalProps) {
  const solutions = useProblemSolverStore((state) => state.solutions);
  const removeSolution = useProblemSolverStore((state) => state.removeSolution);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const exportSolutions = () => {
    const data = JSON.stringify(solutions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `problem-solutions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved Solutions</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={exportSolutions}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Export Solutions"
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
          {solutions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No saved solutions yet. Start by solving a problem!
            </div>
          ) : (
            <div className="space-y-4">
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {solution.problemInfo.category} Problem
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          solution.problemInfo.severity === 'high' 
                            ? 'bg-red-100 text-red-700'
                            : solution.problemInfo.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {solution.problemInfo.severity} severity
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Created on {solution.createdAt.toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700">
                        {solution.problemInfo.description}
                      </p>
                      
                      <button
                        onClick={() => setExpandedId(expandedId === solution.id ? null : solution.id)}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mt-3"
                      >
                        {expandedId === solution.id ? (
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

                      {expandedId === solution.id && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Analysis</h4>
                            <p className="text-gray-700">{solution.analysis.summary}</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div className="text-sm">
                                <span className="text-gray-500">Impact:</span>{' '}
                                <span className="font-medium">{solution.analysis.impact}%</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Urgency:</span>{' '}
                                <span className="font-medium">{solution.analysis.urgency}%</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-500">Complexity:</span>{' '}
                                <span className="font-medium">{solution.analysis.complexity}%</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Recommendations</h4>
                            <div className="space-y-2">
                              {solution.recommendations.map((rec, i) => (
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
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeSolution(solution.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Solution"
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