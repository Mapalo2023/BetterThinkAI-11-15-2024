import React from 'react';
import { Solution } from '../../types/problemSolver';
import { 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Link as LinkIcon, 
  BookOpen, 
  Video, 
  Wrench, 
  FileText 
} from 'lucide-react';

interface SolutionCardProps {
  solution: Solution;
  onDelete: (id: string) => void;
}

export default function SolutionCard({ solution, onDelete }: SolutionCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'tool':
        return <Wrench className="w-4 h-4" />;
      case 'template':
        return <FileText className="w-4 h-4" />;
      default:
        return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {solution.problemInfo.category} Problem
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              solution.problemInfo.severity === 'high' 
                ? 'bg-red-100 text-red-700'
                : solution.problemInfo.severity === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {solution.problemInfo.severity} severity
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Generated on {solution.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(solution.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{solution.problemInfo.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {solution.analysis.impact}%
          </div>
          <div className="text-sm text-gray-600">Impact</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {solution.analysis.urgency}%
          </div>
          <div className="text-sm text-gray-600">Urgency</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {solution.analysis.complexity}%
          </div>
          <div className="text-sm text-gray-600">Complexity</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Problem Summary</h4>
        <p className="text-gray-700">{solution.analysis.summary}</p>
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
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Root Causes</h4>
            <ul className="list-disc list-inside space-y-1">
              {solution.analysis.rootCauses.map((cause, index) => (
                <li key={index} className="text-gray-700">{cause}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Recommendations</h4>
            <div className="space-y-4">
              {solution.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">{rec.title}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      rec.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{rec.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-1">Pros</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {rec.pros.map((pro, i) => (
                          <li key={i} className="text-gray-600 text-sm">{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-1">Cons</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {rec.cons.map((con, i) => (
                          <li key={i} className="text-gray-600 text-sm">{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-gray-500">
                    <span>Timeline: {rec.timeline}</span>
                    <span>Est. Cost: {rec.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Implementation Roadmap</h4>
            <div className="space-y-4">
              {solution.roadmap.map((phase, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">{phase.phase}</h5>
                  <div className="space-y-3">
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-1">Tasks</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {phase.tasks.map((task, i) => (
                          <li key={i} className="text-gray-600 text-sm">{task}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-1">Milestones</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {phase.milestones.map((milestone, i) => (
                          <li key={i} className="text-gray-600 text-sm">{milestone}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-1">Risks</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {phase.risks.map((risk, i) => (
                          <li key={i} className="text-gray-600 text-sm">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Duration: {phase.duration}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Success Metrics</h4>
            <div className="space-y-3">
              {solution.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-1">{metric.name}</h5>
                  <p className="text-gray-600 text-sm mb-2">{metric.description}</p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Target: </span>
                    <span className="text-gray-600">{metric.target}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Recommended Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solution.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="p-2 bg-white rounded-lg text-blue-500 group-hover:text-blue-600">
                      {getResourceIcon(resource.type)}
                    </span>
                    <h5 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {resource.title}
                    </h5>
                  </div>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  <span className="text-xs text-blue-500 mt-2 inline-block">
                    {resource.type}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}