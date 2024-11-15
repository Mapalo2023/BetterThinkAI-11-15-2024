import React from 'react';
import { Lightbulb } from 'lucide-react';

interface RecommendationSectionProps {
  recommendations: string[];
}

export default function RecommendationSection({ recommendations }: RecommendationSectionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Strategic Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
          >
            <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-gray-700">{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}