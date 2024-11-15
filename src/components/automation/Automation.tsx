import React from 'react';
import { Bot } from 'lucide-react';
import BusinessForm from './BusinessForm';
import ResultCard from './ResultCard';
import SavedAnalysisButton from './SavedAnalysisButton';
import { useAutomationStore } from '../../store/automationStore';

export default function Automation() {
  const { 
    results, 
    isLoading, 
    generateAnalysis,
    removeResult
  } = useAutomationStore();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-500" />
            AI Business Automation
          </h1>
          <p className="text-gray-500 mt-1">
            Get AI-powered insights and automation recommendations for your business
          </p>
        </div>
        <SavedAnalysisButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <BusinessForm onSubmit={generateAnalysis} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {results.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No analyses yet</h3>
                <p className="text-gray-500">
                  Start by providing your business information
                </p>
              </div>
            ) : (
              results.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  onDelete={removeResult}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}