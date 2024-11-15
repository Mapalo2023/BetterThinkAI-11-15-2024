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

interface PlatformDistributionProps {
  data: Array<{
    keyword: string;
    sources: Array<{
      platform: string;
      count: number;
    }>;
  }>;
}

export default function PlatformDistribution({ data }: PlatformDistributionProps) {
  const platforms = Array.from(
    new Set(data.flatMap(d => d.sources.map(s => s.platform)))
  );

  const chartData = data.map(item => ({
    keyword: item.keyword,
    ...Object.fromEntries(
      item.sources.map(source => [source.platform, source.count])
    )
  }));

  const colors = {
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    news: '#10B981',
    reddit: '#FF4500',
    instagram: '#E4405F'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="keyword" />
            <YAxis />
            <Tooltip />
            <Legend />
            {platforms.map((platform) => (
              <Bar
                key={platform}
                dataKey={platform}
                name={platform.charAt(0).toUpperCase() + platform.slice(1)}
                fill={colors[platform as keyof typeof colors] || '#9CA3AF'}
                stackId="a"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}