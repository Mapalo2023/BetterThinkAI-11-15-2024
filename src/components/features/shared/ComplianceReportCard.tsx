import React from 'react';
import { ChevronDown, ChevronUp, Trash2, Scale } from 'lucide-react';

interface ComplianceReportCardProps {
  report: {
    id: string;
    businessType: string;
    regions: string[];
    dataHandling: string[];
    currentMeasures: string;
    analysis: {
      overallStatus: 'compliant' | 'partial' | 'non-compliant';
      riskLevel: 'high' | 'medium' | 'low';
      requirements: Array<{
        category: string;
        description: string;
        priority: 'high' | 'medium' | 'low';
        status: 'compliant' | 'partial' | 'non-compliant';
        actions: string[];
        deadline: string;
      }>;
      gaps: string[];
      nextSteps: string[];
    };
    recommendations: string[];
    createdAt: Date;
  };
  onDelete: (id: string) => void;
}

export default function ComplianceReportCard({ report, onDelete }: ComplianceReportCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-700';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700';
      case 'non-compliant':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{report.businessType}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(report.analysis.overallStatus)}`}>
              {report.analysis.overallStatus}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Generated on {report.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(report.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-semibold text-blue-600">
            {report.regions.join(', ')}
          </div>
          <div className="text-sm text-gray-600">Operating Regions</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-semibold text-purple-600">
            {report.dataHandling.join(', ')}
          </div>
          <div className="text-sm text-gray-600">Data Types</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className={`text-lg font-semibold ${getRiskLevelColor(report.analysis.riskLevel)}`}>
            {report.analysis.riskLevel} risk
          </div>
          <div className="text-sm text-gray-600">Risk Level</div>
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
            <h4 className="font-medium mb-3">Compliance Requirements</h4>
            <div className="space-y-4">
              {report.analysis.requirements.map((req, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{req.category}</h5>
                      <span className={`text-sm ${getPriorityColor(req.priority)}`}>
                        {req.priority} priority
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{req.description}</p>
                  <div className="space-y-2">
                    <div>
                      <h6 className="text-sm font-medium text-gray-900">Required Actions:</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {req.actions.map((action, i) => (
                          <li key={i} className="text-sm text-gray-600">{action}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">Deadline:</span>{' '}
                      <span className="text-gray-600">{req.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Compliance Gaps</h4>
            <ul className="list-disc list-inside space-y-1">
              {report.analysis.gaps.map((gap, index) => (
                <li key={index} className="text-gray-700">{gap}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Next Steps</h4>
            <ul className="list-disc list-inside space-y-1">
              {report.analysis.nextSteps.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}