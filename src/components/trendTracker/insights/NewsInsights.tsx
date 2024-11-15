import React from 'react';
import { NewsItem } from '../../../types/trendTracker';
import { ExternalLink } from 'lucide-react';

interface NewsInsightsProps {
  news: NewsItem[];
}

export default function NewsInsights({ news }: NewsInsightsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Latest News Coverage</h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {news.map((item, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${
              item.sentiment === 'positive'
                ? 'border-green-200 bg-green-50'
                : item.sentiment === 'negative'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="font-medium mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{item.source}</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-500 hover:text-blue-600 shrink-0"
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