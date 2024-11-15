import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip
} from 'recharts';

interface SentimentAnalysisProps {
  data: Array<{
    keyword: string;
    sentiment: number;
  }>;
}

export default function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  const sentimentData = [
    {
      name: 'Positive',
      value: data.filter(d => d.sentiment > 0.3).length,
      color: '#10B981'
    },
    {
      name: 'Neutral',
      value: data.filter(d => d.sentiment >= -0.3 && d.sentiment <= 0.3).length,
      color: '#6B7280'
    },
    {
      name: 'Negative',
      value: data.filter(d => d.sentiment < -0.3).length,
      color: '#EF4444'
    }
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} mentions`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}