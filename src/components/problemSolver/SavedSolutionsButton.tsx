import React from 'react';
import { FolderOpen } from 'lucide-react';
import { useProblemSolverStore } from '../../store/problemSolverStore';
import SavedSolutionsModal from './SavedSolutionsModal';

export default function SavedSolutionsButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const solutions = useProblemSolverStore((state) => state.solutions);
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <FolderOpen className="w-5 h-5" />
        Saved Solutions ({solutions.length})
      </button>
      
      <SavedSolutionsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}