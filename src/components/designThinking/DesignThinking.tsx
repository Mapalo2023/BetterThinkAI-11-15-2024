import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useDesignThinkingStore } from '../../store/designThinkingStore';
import StageSelector from './StageSelector';
import SavedFilesButton from './SavedFilesButton';
import EmpathizeStage from './stages/EmpathizeStage';
import DefineStage from './stages/DefineStage';
import IdeateStage from './stages/IdeateStage';
import PrototypeStage from './stages/PrototypeStage';
import TestStage from './stages/TestStage';

export default function DesignThinking() {
  const currentStage = useDesignThinkingStore((state) => state.currentStage);

  const renderStage = () => {
    switch (currentStage) {
      case 'empathize':
        return <EmpathizeStage />;
      case 'define':
        return <DefineStage />;
      case 'ideate':
        return <IdeateStage />;
      case 'prototype':
        return <PrototypeStage />;
      case 'test':
        return <TestStage />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-blue-500" />
            Design Thinking Workshop
          </h1>
          <p className="text-gray-500 mt-1">
            Guide your team through the design thinking process
          </p>
        </div>
        <SavedFilesButton />
      </div>

      <StageSelector />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {renderStage()}
      </div>
    </div>
  );
}