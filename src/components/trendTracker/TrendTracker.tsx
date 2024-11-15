import { useState, ChangeEvent, ReactElement } from 'react';
import { LineChart } from 'lucide-react';
import { useTrendTrackerStore } from '../../store/trendTrackerStore';
import TrendDashboard from './TrendDashboard';
import ConfigPanel from './ConfigPanel';
import ComparisonTool from './tools/ComparisonTool';
import ReportGenerator from './reports/ReportGenerator';
import { TrendConfig } from '../../types/trendTracker';
import { countries } from './countries';

interface DateRange {
  start: string;
  end: string;
}

interface Props {
  initialCountry?: string;
}

export default function TrendTracker({ initialCountry = 'Zambia' }: Props): ReactElement {
  const { trends, isLoading, generateReport } = useTrendTrackerStore();
  const currentTrend = trends.length > 0 ? trends[0] : null;
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);
  const [dateRange, setDateRange] = useState<DateRange>({ start: '', end: '' });
  const [config, setConfig] = useState<TrendConfig>({
    regions: [],
    keywords: [],
    platforms: ['twitter', 'news'],
    sector: '',
    country: initialCountry,
    timeframe: 'week'
  });

  const handleDateChange = (type: 'start' | 'end', value: string): void => {
    setDateRange((prev: DateRange) => ({
      ...prev,
      [type]: value
    }));
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setConfig((prev: TrendConfig) => ({
      ...prev,
      country: newCountry
    }));
  };

  const handleGenerateReport = async (
    keyword: string,
    country: string,
    platforms: string[]
  ): Promise<void> => {
    await generateReport(keyword, country, platforms);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LineChart className="w-8 h-8 text-blue-500" />
            TrendTracker
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor and analyze trends across platforms and regions
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleDateChange('start', e.target.value)
            }
            className="input"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleDateChange('end', e.target.value)
            }
            className="input"
          />
          <select 
            value={selectedCountry}
            onChange={handleCountryChange}
            className="input"
          >
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ConfigPanel 
            onGenerate={handleGenerateReport}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-8">
          <ComparisonTool />
          <ReportGenerator />
          {currentTrend && <TrendDashboard trends={[currentTrend]} />}
        </div>
      </div>
    </div>
  );
}
