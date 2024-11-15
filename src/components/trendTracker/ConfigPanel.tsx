import React from 'react';
import { Search } from 'lucide-react';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' }
].sort((a, b) => a.name.localeCompare(b.name));

const platforms = [
  { id: 'twitter', name: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'news', name: 'News' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'instagram', name: 'Instagram' }
];

interface ConfigPanelProps {
  onGenerate: (keyword: string, country: string, selectedPlatforms: string[]) => Promise<void>;
  isLoading: boolean;
}

export default function ConfigPanel({ onGenerate, isLoading }: ConfigPanelProps) {
  const [keyword, setKeyword] = React.useState('');
  const [country, setCountry] = React.useState('US');
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<string[]>(['twitter', 'news']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim() && selectedPlatforms.length > 0) {
      onGenerate(keyword.trim(), country, selectedPlatforms);
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-6">Configure Analysis</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Keyword or Phrase
          </label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input"
            placeholder="Enter keyword to track"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input"
            required
          >
            {countries.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Sources
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map(platform => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPlatforms.includes(platform.id)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !keyword.trim() || selectedPlatforms.length === 0}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          {isLoading ? 'Analyzing...' : 'Generate Report'}
        </button>
      </form>
    </div>
  );
}