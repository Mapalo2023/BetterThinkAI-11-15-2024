import React from 'react';
import { FolderOpen } from 'lucide-react';
import { useBrainstormStore } from '../../store/brainstormStore';
import SavedIdeasModal from './SavedIdeasModal';

export default function SavedIdeasButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const ideas = useBrainstormStore((state) => state.ideas);
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <FolderOpen className="w-5 h-5" />
        Saved Ideas ({ideas.length})
      </button>
      
      <SavedIdeasModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}