import React from 'react';
import { Plus, ArrowRight, Play, Pause, Settings, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  steps: {
    id: string;
    type: 'trigger' | 'action' | 'condition';
    name: string;
    config: Record<string, any>;
  }[];
  lastRun?: Date;
  metrics?: {
    runs: number;
    successRate: number;
    avgDuration: string;
  };
}

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = React.useState<Workflow[]>([
    {
      id: '1',
      name: 'Lead Processing',
      description: 'Automatically process and route new leads',
      status: 'active',
      steps: [
        {
          id: 'trigger1',
          type: 'trigger',
          name: 'New Lead Created',
          config: { source: 'salesforce' }
        },
        {
          id: 'action1',
          type: 'action',
          name: 'Send Welcome Email',
          config: { template: 'welcome_email' }
        }
      ],
      lastRun: new Date(),
      metrics: {
        runs: 156,
        successRate: 98.7,
        avgDuration: '2.3s'
      }
    },
    {
      id: '2',
      name: 'Document Approval',
      description: 'Route documents for approval',
      status: 'paused',
      steps: [
        {
          id: 'trigger2',
          type: 'trigger',
          name: 'Document Uploaded',
          config: { source: 'dropbox' }
        },
        {
          id: 'condition1',
          type: 'condition',
          name: 'Check Document Type',
          config: { type: ['contract', 'proposal'] }
        }
      ],
      lastRun: new Date(Date.now() - 86400000),
      metrics: {
        runs: 45,
        successRate: 95.5,
        avgDuration: '1.8s'
      }
    }
  ]);

  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return Play;
      case 'action':
        return ArrowRight;
      case 'condition':
        return Settings;
      default:
        return ArrowRight;
    }
  };

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev =>
      prev.map(workflow =>
        workflow.id === id
          ? {
              ...workflow,
              status: workflow.status === 'active' ? 'paused' : 'active'
            }
          : workflow
      )
    );
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Workflow Builder</h2>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Workflow
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                    {workflow.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWorkflowStatus(workflow.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title={workflow.status === 'active' ? 'Pause' : 'Activate'}
                >
                  {workflow.status === 'active' ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setExpandedId(expandedId === workflow.id ? null : workflow.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {expandedId === workflow.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {expandedId === workflow.id && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Total Runs</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {workflow.metrics?.runs.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Success Rate</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {workflow.metrics?.successRate}%
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Avg. Duration</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {workflow.metrics?.avgDuration}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {workflow.steps.map((step, index) => {
                    const StepIcon = getStepIcon(step.type);
                    return (
                      <React.Fragment key={step.id}>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          step.type === 'trigger'
                            ? 'bg-blue-50 text-blue-700'
                            : step.type === 'condition'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-green-50 text-green-700'
                        }`}>
                          <StepIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{step.name}</span>
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}