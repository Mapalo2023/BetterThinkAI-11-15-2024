import React from 'react';
import { TrendingUp, BarChart2, Globe, Newspaper } from 'lucide-react';
import TrendChart from './charts/TrendChart';
import SentimentAnalysis from './charts/SentimentAnalysis';
import PlatformDistribution from './charts/PlatformDistribution';
import NewsSection from './sections/NewsSection';

interface TrendDashboardProps {
  trends: Array<{
    id: string;
    keyword: string;
    country: string;
    sentiment: number;
    sources: Array<{
      platform: string;
      count: number;
    }>;
    mentions: number;
    timestamp: Date;
  }>;
}

export default function TrendDashboard({ trends }: TrendDashboardProps) {
  if (trends.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Trends Yet</h3>
        <p className="text-gray-500 mt-2">
          Start by entering a keyword and generating a report
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Mentions',
      value: trends.reduce((sum, trend) => sum + trend.mentions, 0).toLocaleString(),
      icon: BarChart2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Countries',
      value: new Set(trends.map(t => t.country)).size.toString(),
      icon: Globe,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'News Sources',
      value: trends.reduce((sum, trend) => 
        sum + trend.sources.find(s => s.platform === 'news')?.count || 0, 0
      ).toLocaleString(),
      icon: Newspaper,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={trends} />
        <SentimentAnalysis data={trends} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformDistribution data={trends} />
        <NewsSection data={trends} />
      </div>
    </div>
  );
}