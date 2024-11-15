import React from 'react';
import { X, Download, Trash2 } from 'lucide-react';
import { useBrainstormStore } from '../../store/brainstormStore';
import { Idea } from '../../types/brainstorm';

interface SavedIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedIdeasModal({ isOpen, onClose }: SavedIdeasModalProps) {
  const ideas = useBrainstormStore((state) => state.ideas);
  const removeIdea = useBrainstormStore((state) => state.removeIdea);

  if (!isOpen) return null;

  const exportIdeas = () => {
    const data = JSON.stringify(ideas, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup-ideas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMetrics = (idea: Idea) => (
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="text-sm">
        <span className="text-gray-500">Market Potential:</span>{' '}
        <span className="font-medium">{idea.analysis.marketPotential}%</span>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Innovation Score:</span>{' '}
        <span className="font-medium">{idea.analysis.innovationScore}%</span>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Feasibility:</span>{' '}
        <span className="font-medium">{idea.analysis.feasibilityScore}%</span>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Risk Level:</span>{' '}
        <span className="font-medium">{idea.analysis.riskLevel}%</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved Ideas & Evaluations</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={exportIdeas}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Export Ideas"
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
          {ideas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No saved ideas yet. Start brainstorming!
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{idea.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          idea.source === 'AI' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {idea.source}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Created on {idea.createdAt.toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-gray-700">{idea.description}</p>
                      {renderMetrics(idea)}
                      
                      {idea.sipAnalysis && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          idea.sipAnalysis.verdict === 'SIP' 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              idea.sipAnalysis.verdict === 'SIP' ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {idea.sipAnalysis.verdict}
                            </span>
                            <span className="font-bold">{idea.sipAnalysis.score}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeIdea(idea.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Idea"
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