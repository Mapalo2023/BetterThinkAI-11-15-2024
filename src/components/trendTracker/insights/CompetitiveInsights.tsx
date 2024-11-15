import React from 'react';
import { CompetitorData } from '../../../types/trendTracker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompetitiveInsightsProps {
  competitors: CompetitorData[];
}

export default function CompetitiveInsights({ competitors }: CompetitiveInsightsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Competitive Analysis</h3>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={competitors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="shareOfVoice" 
              name="Share of Voice" 
              fill="#3B82F6" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-4">
        {competitors.map((competitor) => (
          <div 
            key={competitor.name}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{competitor.name}</h4>
              <span className="text-sm text-gray-500">
                {competitor.shareOfVoice}% Share of Voice
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Mentions:</span>{' '}
                <span className="font-medium">{competitor.mentions}</span>
              </div>
              <div>
                <span className="text-gray-500">Positive:</span>{' '}
                <span className="font-medium text-green-600">
                  {competitor.sentiment.find(s => s.type === 'positive')?.percentage.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Negative:</span>{' '}
                <span className="font-medium text-red-600">
                  {competitor.sentiment.find(s => s.type === 'negative')?.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}