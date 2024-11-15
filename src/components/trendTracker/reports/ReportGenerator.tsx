import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { fetchData } from '../../../lib/dataFetcher'; // Corrected path
import Chart from 'chart.js/auto';

export default function ReportGenerator() {
  const reportOptions = [
    'Trending Topics', 'Sentiment Analysis', 'Top Influencers',
    'Platform Overview', 'Content Performance', 'Competitor Insights',
    'Geographic Distribution', 'Keyword Analysis'
  ];

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(prev => prev.filter(o => o !== option));
    } else {
      setSelectedOptions(prev => [...prev, option]);
    }
  };

  const generateReport = async () => {
    const data = await fetchData(selectedOptions);
    data.forEach((dataset: any, index: number) => {
      const ctx = document.getElementById(`chart-${index}`) as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: dataset,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: selectedOptions[index]
            }
          }
        }
      });
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Custom Report Generator</h3>
        <button className="btn btn-primary" onClick={generateReport}>
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {reportOptions.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
          >
            <input 
              type="checkbox" 
              className="form-checkbox" 
              onChange={() => handleOptionSelect(option)}
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>

      <div id="charts">
        {selectedOptions.map((option, index) => (
          <canvas id={`chart-${index}`} key={index}></canvas>
        ))}
      </div>
    </div>
  );
}
