import React from 'react';
import { X, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useDesignThinkingStore } from '../../store/designThinkingStore';

interface SavedFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedFilesModal({ isOpen, onClose }: SavedFilesModalProps) {
  const store = useDesignThinkingStore();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const exportFiles = () => {
    const data = {
      research: store.research,
      problemStatements: store.problemStatements,
      ideas: store.ideas,
      prototypes: store.prototypes,
      testResults: store.testResults
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-thinking-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sections = [
    {
      id: 'research',
      title: 'User Research',
      items: store.research,
      onDelete: store.deleteResearch,
      renderItem: (item: any) => (
        <>
          <h4 className="font-medium text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-500">
            {item.method} • {item.participants} participants
          </p>
        </>
      )
    },
    {
      id: 'problemStatements',
      title: 'Problem Statements',
      items: store.problemStatements,
      onDelete: store.deleteProblemStatement,
      renderItem: (item: any) => (
        <>
          <h4 className="font-medium text-gray-900">{item.userGroup}</h4>
          <p className="text-sm text-gray-600">{item.needs}</p>
        </>
      )
    },
    {
      id: 'ideas',
      title: 'Ideas',
      items: store.ideas,
      onDelete: store.deleteIdea,
      renderItem: (item: any) => (
        <>
          <h4 className="font-medium text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
        </>
      )
    },
    {
      id: 'prototypes',
      title: 'Prototypes',
      items: store.prototypes,
      onDelete: store.deletePrototype,
      renderItem: (item: any) => (
        <>
          <h4 className="font-medium text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-500">{item.type}</p>
        </>
      )
    },
    {
      id: 'testResults',
      title: 'Test Results',
      items: store.testResults,
      onDelete: store.deleteTestResult,
      renderItem: (item: any) => {
        const prototype = store.prototypes.find(p => p.id === item.prototypeId);
        return (
          <>
            <h4 className="font-medium text-gray-900">
              {prototype?.title || 'Unknown Prototype'}
            </h4>
            <p className="text-sm text-gray-500">
              {item.participants} participants
            </p>
          </>
        );
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Design Thinking Files</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={exportFiles}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Export All Files"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {sections.map(({ id, title, items, onDelete, renderItem }) => (
            <div key={id} className="mb-4">
              <button
                onClick={() => setExpandedSection(expandedSection === id ? null : id)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{title}</span>
                  <span className="text-sm text-gray-500">({items.length})</span>
                </div>
                {expandedSection === id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedSection === id && items.length > 0 && (
                <div className="mt-2 space-y-2">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {renderItem(item)}
                          <p className="text-xs text-gray-400 mt-1">
                            Created: {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}