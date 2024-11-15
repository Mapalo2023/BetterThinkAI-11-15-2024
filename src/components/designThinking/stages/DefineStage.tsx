import React from 'react';
import { useDesignThinkingStore } from '../../../store/designThinkingStore';
import { Target } from 'lucide-react';
import AIHelper from '../AIHelper';

export default function DefineStage() {
  const { addProblemStatement, isLoading } = useDesignThinkingStore();
  const [context, setContext] = React.useState('');
  const [formData, setFormData] = React.useState({
    userGroup: '',
    needs: '',
    insight: '',
    impact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.userGroup && formData.needs) {
      await addProblemStatement(formData);
      setFormData({
        userGroup: '',
        needs: '',
        insight: '',
        impact: ''
      });
    }
  };

  const handleAISuggestions = (result: any) => {
    setFormData({
      userGroup: result.userGroup,
      needs: result.needs,
      insight: result.insight,
      impact: result.impact
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Problem Statement</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Context (for AI suggestions)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe your problem space"
            className="input flex-1"
          />
          <AIHelper
            stage="define"
            context={context}
            onResult={handleAISuggestions}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userGroup" className="block text-sm font-medium text-gray-700 mb-1">
            User Group
          </label>
          <input
            type="text"
            id="userGroup"
            value={formData.userGroup}
            onChange={(e) => setFormData(prev => ({ ...prev, userGroup: e.target.value }))}
            className="input"
            placeholder="Who are we solving for?"
            required
          />
        </div>

        <div>
          <label htmlFor="needs" className="block text-sm font-medium text-gray-700 mb-1">
            User Needs
          </label>
          <textarea
            id="needs"
            value={formData.needs}
            onChange={(e) => setFormData(prev => ({ ...prev, needs: e.target.value }))}
            className="input min-h-[100px]"
            placeholder="What do they need?"
            required
          />
        </div>

        <div>
          <label htmlFor="insight" className="block text-sm font-medium text-gray-700 mb-1">
            Key Insight
          </label>
          <textarea
            id="insight"
            value={formData.insight}
            onChange={(e) => setFormData(prev => ({ ...prev, insight: e.target.value }))}
            className="input min-h-[100px]"
            placeholder="What have we learned?"
            required
          />
        </div>

        <div>
          <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
            Expected Impact
          </label>
          <textarea
            id="impact"
            value={formData.impact}
            onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
            className="input min-h-[100px]"
            placeholder="What's the potential impact?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary"
        >
          {isLoading ? 'Adding Statement...' : 'Add Problem Statement'}
        </button>
      </form>
    </div>
  );
}