import React from 'react';
import { Calendar } from 'lucide-react';
import { useTimelinePlanningStore } from '../../store/features/timelinePlanningStore';
import TimelineCard from './shared/TimelineCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function TimelinePlanning() {
  const { timelines, isLoading, generateTimeline, removeTimeline } = useTimelinePlanningStore();
  const [formData, setFormData] = React.useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName.trim() || !formData.description.trim() || !formData.startDate || !formData.endDate) {
      return;
    }
    
    try {
      await generateTimeline(
        formData.projectName.trim(),
        formData.description.trim(),
        formData.startDate,
        formData.endDate
      );
      setFormData({
        projectName: '',
        description: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      // Error is handled by the store
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            Timeline Planning
          </h1>
          <p className="text-gray-500 mt-1">
            Create intelligent project timelines with AI assistance
          </p>
        </div>
        <SavedFeaturesButton count={timelines.length} title="Saved Timelines" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Project Timeline</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  className="input"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Describe the project goals and scope"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="input"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Generating...' : 'Generate Timeline'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {timelines.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No timelines yet</h3>
                <p className="text-gray-500">
                  Start by generating your first project timeline
                </p>
              </div>
            ) : (
              timelines.map((timeline) => (
                <TimelineCard
                  key={timeline.id}
                  timeline={timeline}
                  onDelete={removeTimeline}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}