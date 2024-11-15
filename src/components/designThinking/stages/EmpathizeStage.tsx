import React from 'react';
import { useDesignThinkingStore } from '../../../store/designThinkingStore';
import { useAuthStore } from '../../../store/authStore';
import { Users, Plus, Trash2 } from 'lucide-react';
import AIHelper from '../AIHelper';
import toast from 'react-hot-toast';

export default function EmpathizeStage() {
  const { user } = useAuthStore();
  const { addResearch, isLoading } = useDesignThinkingStore();
  const [context, setContext] = React.useState('');
  const [formData, setFormData] = React.useState({
    title: '',
    method: 'interview' as const,
    participants: 0,
    insights: [''],
    painPoints: [''],
    needs: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    if (formData.title && formData.participants > 0) {
      try {
        await addResearch({
          ...formData,
          userId: user.uid,
          insights: formData.insights.filter(Boolean),
          painPoints: formData.painPoints.filter(Boolean),
          needs: formData.needs.filter(Boolean)
        });
        
        setFormData({
          title: '',
          method: 'interview',
          participants: 0,
          insights: [''],
          painPoints: [''],
          needs: ['']
        });
        
        toast.success('Research added successfully');
      } catch (error: any) {
        console.error('Error adding research:', error);
        toast.error(error.message || 'Failed to add research');
      }
    }
  };

  const handleAISuggestions = (result: any) => {
    setFormData({
      title: result.title,
      method: result.method,
      participants: result.participants,
      insights: result.insights,
      painPoints: result.painPoints,
      needs: result.needs
    });
  };

  const addField = (field: 'insights' | 'painPoints' | 'needs') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'insights' | 'painPoints' | 'needs', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'insights' | 'painPoints' | 'needs', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">User Research</h2>
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
            placeholder="Describe your project or product"
            className="input flex-1"
          />
          <AIHelper
            stage="empathize"
            context={context}
            onResult={handleAISuggestions}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Research Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
              Research Method
            </label>
            <select
              id="method"
              value={formData.method}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                method: e.target.value as 'interview' | 'survey' | 'observation'
              }))}
              className="input"
              required
            >
              <option value="interview">Interview</option>
              <option value="survey">Survey</option>
              <option value="observation">Observation</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Participants
          </label>
          <input
            type="number"
            id="participants"
            value={formData.participants}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              participants: parseInt(e.target.value) || 0
            }))}
            className="input"
            min="1"
            required
          />
        </div>

        {[
          { field: 'insights' as const, label: 'Key Insights' },
          { field: 'painPoints' as const, label: 'Pain Points' },
          { field: 'needs' as const, label: 'User Needs' }
        ].map(({ field, label }) => (
          <div key={field}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <button
                type="button"
                onClick={() => addField(field)}
                className="p-1 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData[field].map((value, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateField(field, index, e.target.value)}
                  className="input"
                  placeholder={`Add ${label.toLowerCase()}`}
                />
                {formData[field].length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(field, index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading || !user}
          className="w-full btn btn-primary"
        >
          {isLoading ? 'Adding Research...' : 'Add Research'}
        </button>
      </form>
    </div>
  );
}