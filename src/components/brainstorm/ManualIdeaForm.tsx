import React from 'react';
import { PenTool } from 'lucide-react';

interface ManualIdeaFormProps {
  onSubmit: (title: string, description: string) => void;
  isLoading: boolean;
}

export default function ManualIdeaForm({ onSubmit, isLoading }: ManualIdeaFormProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PenTool className="w-5 h-5 text-blue-500" />
        Manual Idea Input
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Idea Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your idea title"
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your idea in detail..."
            className="input min-h-[100px]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !title.trim() || !description.trim()}
          className="w-full btn btn-primary"
        >
          {isLoading ? 'Analyzing...' : 'Add & Analyze Idea'}
        </button>
      </div>
    </form>
  );
}