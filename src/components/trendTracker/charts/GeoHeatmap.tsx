import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GeoData } from '../../../types/trendTracker';

interface GeoHeatmapProps {
  data: GeoData[];
}

const COLORS = {
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#6B7280'
};

export default function GeoHeatmap({ data }: GeoHeatmapProps) {
  const sortedData = [...data].sort((a, b) => b.mentions - a.mentions);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="region" 
            type="category" 
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip />
          <Bar
            dataKey="mentions"
            fill="#3B82F6"
            background={{ fill: '#eee' }}
            label={{ position: 'right', fontSize: 12 }}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={COLORS[entry.sentiment]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}