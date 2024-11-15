import React from 'react';
import { FolderOpen } from 'lucide-react';
import { useDesignThinkingStore } from '../../store/designThinkingStore';
import SavedFilesModal from './SavedFilesModal';

export default function SavedFilesButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { research, problemStatements, ideas, prototypes, testResults } = useDesignThinkingStore();
  
  const totalFiles = 
    research.length + 
    problemStatements.length + 
    ideas.length + 
    prototypes.length + 
    testResults.length;
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <FolderOpen className="w-5 h-5" />
        Saved Files ({totalFiles})
      </button>
      
      <SavedFilesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}