import React from 'react';
import { useDesignThinkingStore } from '../../store/designThinkingStore';
import { 
  Users, 
  Target, 
  Lightbulb, 
  PenTool, 
  TestTube 
} from 'lucide-react';

const stages = [
  { id: 'empathize', icon: Users, label: 'Empathize' },
  { id: 'define', icon: Target, label: 'Define' },
  { id: 'ideate', icon: Lightbulb, label: 'Ideate' },
  { id: 'prototype', icon: PenTool, label: 'Prototype' },
  { id: 'test', icon: TestTube, label: 'Test' }
] as const;

export default function StageSelector() {
  const { currentStage, setCurrentStage } = useDesignThinkingStore();

  return (
    <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {stages.map(({ id, icon: Icon, label }) => {
        const isActive = currentStage === id;
        const isCompleted = false; // TODO: Add completion tracking

        return (
          <React.Fragment key={id}>
            <button
              onClick={() => setCurrentStage(id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : isCompleted
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{label}</span>
            </button>

            {id !== 'test' && (
              <div className="h-[2px] flex-1 bg-gray-200 mx-4" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}