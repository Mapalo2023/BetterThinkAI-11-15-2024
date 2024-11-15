import React from 'react';
import { ChevronDown, ChevronUp, Trash2, Database } from 'lucide-react';

interface TechStackCardProps {
  stack: {
    id: string;
    projectType: string;
    requirements: {
      scale: string;
      budget: string;
      teamExperience: string;
    };
    analysis: {
      frontend: Array<{
        name: string;
        category: string;
        description: string;
        pros: string[];
        cons: string[];
        cost: 'free' | 'paid' | 'enterprise';
        learningCurve: 'low' | 'medium' | 'high';
        alternatives: string[];
      }>;
      backend: Array<{
        name: string;
        category: string;
        description: string;
        pros: string[];
        cons: string[];
        cost: 'free' | 'paid' | 'enterprise';
        learningCurve: 'low' | 'medium' | 'high';
        alternatives: string[];
      }>;
      database: Array<{
        name: string;
        category: string;
        description: string;
        pros: string[];
        cons: string[];
        cost: 'free' | 'paid' | 'enterprise';
        learningCurve: 'low' | 'medium' | 'high';
        alternatives: string[];
      }>;
      devops: Array<{
        name: string;
        category: string;
        description: string;
        pros: string[];
        cons: string[];
        cost: 'free' | 'paid' | 'enterprise';
        learningCurve: 'low' | 'medium' | 'high';
        alternatives: string[];
      }>;
      testing: Array<{
        name: string;
        category: string;
        description: string;
        pros: string[];
        cons: string[];
        cost: 'free' | 'paid' | 'enterprise';
        learningCurve: 'low' | 'medium' | 'high';
        alternatives: string[];
      }>;
      monitoring: Array<{
        name: string;
        category: string;
        description: string;
        pros: string[];
        cons: string[];
        cost: 'free' | 'paid' | 'enterprise';
        learningCurve: 'low' | 'medium' | 'high';
        alternatives: string[];
      }>;
      considerations: string[];
      risks: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function TechStackCard({ stack, onDelete }: TechStackCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free':
        return 'bg-green-100 text-green-700';
      case 'paid':
        return 'bg-yellow-100 text-yellow-700';
      case 'enterprise':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLearningCurveColor = (curve: string) => {
    switch (curve) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderTechnologySection = (title: string, technologies: any[]) => (
    <div>
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="space-y-3">
        {technologies.map((tech, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h5 className="font-medium text-gray-900">{tech.name}</h5>
                <p className="text-sm text-gray-600">{tech.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${getCostColor(tech.cost)}`}>
                  {tech.cost}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getLearningCurveColor(tech.learningCurve)}`}>
                  {tech.learningCurve} curve
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{tech.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h6 className="text-sm font-medium text-gray-900 mb-1">Pros</h6>
                <ul className="list-disc list-inside space-y-1">
                  {tech.pros.map((pro: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600">{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="text-sm font-medium text-gray-900 mb-1">Cons</h6>
                <ul className="list-disc list-inside space-y-1">
                  {tech.cons.map((con: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600">{con}</li>
                  ))}
                </ul>
              </div>
            </div>
            {tech.alternatives.length > 0 && (
              <div className="mt-3">
                <h6 className="text-sm font-medium text-gray-900 mb-1">Alternatives</h6>
                <div className="flex flex-wrap gap-2">
                  {tech.alternatives.map((alt: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{stack.projectType}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
              {stack.requirements.budget} budget
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Generated on {stack.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(stack.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="font-medium text-gray-900">Scale & Performance</div>
          <div className="text-sm text-gray-600">{stack.requirements.scale}</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="font-medium text-gray-900">Team Experience</div>
          <div className="text-sm text-gray-600">{stack.requirements.teamExperience}</div>
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
          {renderTechnologySection('Frontend Technologies', stack.analysis.frontend)}
          {renderTechnologySection('Backend Technologies', stack.analysis.backend)}
          {renderTechnologySection('Database Technologies', stack.analysis.database)}
          {renderTechnologySection('DevOps Tools', stack.analysis.devops)}
          {renderTechnologySection('Testing Tools', stack.analysis.testing)}
          {renderTechnologySection('Monitoring Tools', stack.analysis.monitoring)}

          <div>
            <h4 className="font-medium mb-2">Key Considerations</h4>
            <ul className="list-disc list-inside space-y-1">
              {stack.analysis.considerations.map((consideration, index) => (
                <li key={index} className="text-gray-700">{consideration}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Potential Risks</h4>
            <ul className="list-disc list-inside space-y-1">
              {stack.analysis.risks.map((risk, index) => (
                <li key={index} className="text-gray-700">{risk}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Implementation Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {stack.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}