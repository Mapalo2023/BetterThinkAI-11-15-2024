import React from 'react';
import { LineChart } from 'lucide-react';
import { useTrendTrackerStore } from '../../store/trendTrackerStore';
import TrendDashboard from './TrendDashboard';
import ConfigPanel from './ConfigPanel';

export default function TrendTracker() {
  const { trends, isLoading, generateReport } = useTrendTrackerStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <LineChart className="w-8 h-8 text-blue-500" />
          TrendTracker
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor and analyze trends across platforms and regions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ConfigPanel onGenerate={generateReport} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-3">
          <TrendDashboard trends={trends} />
        </div>
      </div>
    </div>
  );
}