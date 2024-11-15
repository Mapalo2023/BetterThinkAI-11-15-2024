import React from 'react';
import { ChevronDown, ChevronUp, Trash2, Users2 } from 'lucide-react';

interface ResourcePlanCardProps {
  plan: {
    id: string;
    projectName: string;
    description: string;
    duration: number;
    budget: number;
    analysis: {
      totalCost: number;
      monthlyBurn: number;
      requirements: Array<{
        role: string;
        count: number;
        skills: string[];
        experience: string;
        cost: number;
        availability: string;
      }>;
      timeline: Array<{
        phase: string;
        resources: string[];
        duration: string;
      }>;
      risks: string[];
      constraints: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function ResourcePlanCard({ plan, onDelete }: ResourcePlanCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalResources = plan.analysis.requirements.reduce(
    (sum, req) => sum + req.count,
    0
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{plan.projectName}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
              {plan.duration} months
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Budget: {formatCurrency(plan.budget)} • Generated on {plan.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(plan.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{plan.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(plan.analysis.totalCost)}
          </div>
          <div className="text-sm text-gray-600">Total Cost</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(plan.analysis.monthlyBurn)}
          </div>
          <div className="text-sm text-gray-600">Monthly Burn</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {totalResources}
          </div>
          <div className="text-sm text-gray-600">Total Resources</div>
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
            <h4 className="font-medium mb-3">Resource Requirements</h4>
            <div className="space-y-3">
              {plan.analysis.requirements.map((req, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {req.role} ({req.count})
                      </h5>
                      <p className="text-sm text-gray-600">{req.experience}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(req.cost)}
                      </div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {req.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Availability:</span>
                      <span className="text-sm text-gray-600 ml-2">{req.availability}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Resource Timeline</h4>
            <div className="space-y-3">
              {plan.analysis.timeline.map((phase, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{phase.phase}</h5>
                    <span className="text-sm text-gray-600">{phase.duration}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Required Resources:</span>
                    <ul className="mt-1 space-y-1">
                      {phase.resources.map((resource, i) => (
                        <li key={i} className="text-sm text-gray-600">• {resource}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Risks</h4>
            <ul className="list-disc list-inside space-y-1">
              {plan.analysis.risks.map((risk, index) => (
                <li key={index} className="text-gray-700">{risk}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Constraints</h4>
            <ul className="list-disc list-inside space-y-1">
              {plan.analysis.constraints.map((constraint, index) => (
                <li key={index} className="text-gray-700">{constraint}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {plan.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}