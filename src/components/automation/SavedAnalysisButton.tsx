import React from 'react';
import { FolderOpen } from 'lucide-react';
import { useAutomationStore } from '../../store/automationStore';
import SavedAnalysisModal from './SavedAnalysisModal';

export default function SavedAnalysisButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const results = useAutomationStore((state) => state.results);
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <FolderOpen className="w-5 h-5" />
        Saved Analyses ({results.length})
      </button>
      
      <SavedAnalysisModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}