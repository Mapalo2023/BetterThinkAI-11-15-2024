import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface CompetitorSectionProps {
  competitors: Array<{
    name: string;
    mentions: number;
    sentiment: number;
  }>;
}

export default function CompetitorSection({ competitors }: CompetitorSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Competitor Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={competitors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="mentions" fill="#3B82F6" name="Mentions" />
            <Bar dataKey="sentiment" fill="#10B981" name="Sentiment" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}