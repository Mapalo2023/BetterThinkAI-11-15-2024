import React, { useState, useEffect, useRef } from 'react';
import { BarChart2 } from 'lucide-react';
import { countries } from '../countries';
import { fetchData } from '../../../lib/dataFetcher';
import Chart from 'chart.js/auto';

export default function ComparisonTool() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const chartRefs = useRef<(Chart | null)[]>([]);

  const handleCountrySelect = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(prev => prev.filter(c => c !== country));
    } else if (selectedCountries.length < 3) {
      setSelectedCountries(prev => [...prev, country]);
    }
  };

  const generateComparison = async () => {
    const data = await fetchData(selectedCountries);
    data.forEach((dataset: any, index: number) => {
      const ctx = document.getElementById(`comparison-chart-${index}`) as HTMLCanvasElement;
      if (chartRefs.current[index]) {
        chartRefs.current[index]!.data = dataset;
        chartRefs.current[index]!.update();
      } else {
        chartRefs.current[index] = new Chart(ctx, {
          type: 'line', // Example chart type for comparison
          data: dataset,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: selectedCountries[index]
              }
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup chart instances on component unmount
      chartRefs.current.forEach(chart => chart?.destroy());
    };
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Comparison Tool</h3>
      
      <div className="space-y-4">
        <select 
          className="input w-full"
          onChange={(e) => handleCountrySelect(e.target.value)}
          value=""
        >
          <option value="" disabled>Compare Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <div className="flex gap-2 flex-wrap">
          {selectedCountries.map(country => (
            <div 
              key={country}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {country}
              <button 
                onClick={() => handleCountrySelect(country)}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button 
          className="btn btn-primary w-full"
          disabled={selectedCountries.length === 0}
          onClick={generateComparison}
        >
          <BarChart2 className="w-4 h-4" />
          Compare
        </button>

        <div id="comparison-charts">
          {selectedCountries.map((country, index) => (
            <canvas id={`comparison-chart-${index}`} key={index}></canvas>
          ))}
        </div>
      </div>
    </div>
  );
}
