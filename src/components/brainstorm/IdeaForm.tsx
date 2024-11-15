import React from 'react';
import { IdeaPrompt } from '../../types/brainstorm';
import { Sparkles } from 'lucide-react';

interface IdeaFormProps {
  onGenerate: (prompt: IdeaPrompt) => void;
  isLoading: boolean;
}

export default function IdeaForm({ onGenerate, isLoading }: IdeaFormProps) {
  const [formData, setFormData] = React.useState<IdeaPrompt>({
    industry: '',
    targetMarket: '',
    problemStatement: '',
    constraints: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="space-y-4">
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry (optional)
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g., Technology, Healthcare, Education"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700 mb-1">
            Target Market (optional)
          </label>
          <input
            type="text"
            id="targetMarket"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            placeholder="e.g., Young Professionals, Small Businesses"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 mb-1">
            Problem Statement (optional)
          </label>
          <textarea
            id="problemStatement"
            name="problemStatement"
            value={formData.problemStatement}
            onChange={handleChange}
            placeholder="Describe the problem you want to solve..."
            className="input min-h-[100px]"
          />
        </div>

        <div>
          <label htmlFor="constraints" className="block text-sm font-medium text-gray-700 mb-1">
            Constraints (optional)
          </label>
          <input
            type="text"
            id="constraints"
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            placeholder="e.g., Budget, Technical limitations"
            className="input"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? 'Generating...' : 'Generate Idea'}
        </button>
      </div>
    </form>
  );
}