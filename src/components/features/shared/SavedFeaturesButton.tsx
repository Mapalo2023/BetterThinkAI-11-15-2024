import React from 'react';
import { FolderOpen } from 'lucide-react';
import SavedFeaturesModal from './SavedFeaturesModal';

interface SavedFeaturesButtonProps {
  count: number;
  title: string;
}

export default function SavedFeaturesButton({ count, title }: SavedFeaturesButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <FolderOpen className="w-5 h-5" />
        {title} ({count})
      </button>
      
      <SavedFeaturesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}