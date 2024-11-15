import React from 'react';
import { Brain } from 'lucide-react';
import IdeaForm from './IdeaForm';
import ManualIdeaForm from './ManualIdeaForm';
import IdeaCard from './IdeaCard';
import SavedIdeasButton from './SavedIdeasButton';
import { useBrainstormStore } from '../../store/brainstormStore';

export default function Brainstorm() {
  const { 
    ideas, 
    isLoading, 
    generateIdea, 
    removeIdea,
    evaluateIdea,
    addManualIdea
  } = useBrainstormStore();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-500" />
            AI-Powered Brainstorming
          </h1>
          <p className="text-gray-500 mt-1">
            Generate and evaluate innovative startup ideas
          </p>
        </div>
        <SavedIdeasButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <IdeaForm onGenerate={generateIdea} isLoading={isLoading} />
          <ManualIdeaForm onSubmit={addManualIdea} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {ideas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No ideas yet</h3>
                <p className="text-gray-500">
                  Start by generating an idea or adding your own
                </p>
              </div>
            ) : (
              ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onDelete={removeIdea}
                  onEvaluate={evaluateIdea}
                  isLoading={isLoading}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}