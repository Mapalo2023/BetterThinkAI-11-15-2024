import React from 'react';
import { ExternalLink } from 'lucide-react';

interface NewsSectionProps {
  data: Array<{
    keyword: string;
    country: string;
    timestamp: Date;
  }>;
}

export default function NewsSection({ data }: NewsSectionProps) {
  // Simulated news data
  const news = data.map(item => ({
    id: crypto.randomUUID(),
    title: `Latest trends for "${item.keyword}" in ${item.country}`,
    source: 'News Source',
    date: item.timestamp,
    url: '#'
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Latest News</h3>
      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {item.source} • {item.date.toLocaleDateString()}
                </p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-500"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}