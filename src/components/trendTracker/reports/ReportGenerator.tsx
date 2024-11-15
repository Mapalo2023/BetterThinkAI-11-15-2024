import React from 'react';
import { TrendReport } from '../../../types/trendTracker';
import { Download, FileText } from 'lucide-react';

interface ReportGeneratorProps {
  report: TrendReport;
}

export default function ReportGenerator({ report }: ReportGeneratorProps) {
  const generatePDF = () => {
    // In a real implementation, this would generate a PDF report
    const data = JSON.stringify(report, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trend-report-${report.createdAt.toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Report Summary</h3>
          <p className="text-sm text-gray-500">
            Generated on {report.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Key Insights
          </h4>
          <ul className="space-y-2">
            {report.insights.map((insight, index) => (
              <li 
                key={index}
                className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            Recommendations
          </h4>
          <ul className="space-y-2">
            {report.recommendations.map((recommendation, index) => (
              <li 
                key={index}
                className="p-3 bg-purple-50 rounded-lg text-gray-700 text-sm"
              >
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}