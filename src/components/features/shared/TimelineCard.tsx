import React from 'react';
import { ChevronDown, ChevronUp, Trash2, Calendar } from 'lucide-react';

interface TimelineCardProps {
  timeline: {
    id: string;
    projectName: string;
    description: string;
    startDate: string;
    endDate: string;
    analysis: {
      totalDuration: number;
      criticalPath: string[];
      riskLevel: 'high' | 'medium' | 'low';
      phases: Array<{
        name: string;
        description: string;
        startDate: string;
        endDate: string;
        milestones: Array<{
          title: string;
          description: string;
          startDate: string;
          endDate: string;
          dependencies: string[];
          resources: string[];
          deliverables: string[];
        }>;
        risks: string[];
      }>;
      assumptions: string[];
      constraints: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function TimelineCard({ timeline, onDelete }: TimelineCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{timeline.projectName}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getRiskLevelColor(timeline.analysis.riskLevel)}`}>
              {timeline.analysis.riskLevel} risk
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Duration: {timeline.analysis.totalDuration} days • Generated on {timeline.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(timeline.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{timeline.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="font-medium text-gray-900">Project Timeline</div>
          <div className="text-sm text-gray-600">
            {formatDate(timeline.startDate)} - {formatDate(timeline.endDate)}
          </div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="font-medium text-gray-900">Total Phases</div>
          <div className="text-sm text-gray-600">
            {timeline.analysis.phases.length} phases • {
              timeline.analysis.phases.reduce((total, phase) => total + phase.milestones.length, 0)
            } milestones
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
      >
        {expanded ? (
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

      {expanded && (
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-medium mb-2">Critical Path</h4>
            <ul className="list-disc list-inside space-y-1">
              {timeline.analysis.criticalPath.map((milestone, index) => (
                <li key={index} className="text-gray-700">{milestone}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Project Phases</h4>
            <div className="space-y-4">
              {timeline.analysis.phases.map((phase, phaseIndex) => (
                <div key={phaseIndex} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{phase.name}</h5>
                    <span className="text-sm text-gray-500">
                      {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{phase.description}</p>
                  
                  <div className="space-y-3">
                    {phase.milestones.map((milestone, milestoneIndex) => (
                      <div key={milestoneIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <h6 className="font-medium text-gray-900">{milestone.title}</h6>
                          <span className="text-sm text-gray-500">
                            {formatDate(milestone.startDate)} - {formatDate(milestone.endDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Dependencies:</span>
                            <ul className="list-disc list-inside">
                              {milestone.dependencies.map((dep, i) => (
                                <li key={i} className="text-gray-700">{dep}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-gray-500">Resources:</span>
                            <ul className="list-disc list-inside">
                              {milestone.resources.map((resource, i) => (
                                <li key={i} className="text-gray-700">{resource}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-gray-500">Deliverables:</span>
                            <ul className="list-disc list-inside">
                              {milestone.deliverables.map((deliverable, i) => (
                                <li key={i} className="text-gray-700">{deliverable}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {phase.risks.length > 0 && (
                    <div className="mt-3">
                      <h6 className="text-sm font-medium text-gray-900 mb-1">Phase Risks:</h6>
                      <ul className="list-disc list-inside">
                        {phase.risks.map((risk, i) => (
                          <li key={i} className="text-sm text-gray-700">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Assumptions</h4>
            <ul className="list-disc list-inside space-y-1">
              {timeline.analysis.assumptions.map((assumption, index) => (
                <li key={index} className="text-gray-700">{assumption}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Constraints</h4>
            <ul className="list-disc list-inside space-y-1">
              {timeline.analysis.constraints.map((constraint, index) => (
                <li key={index} className="text-gray-700">{constraint}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {timeline.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}