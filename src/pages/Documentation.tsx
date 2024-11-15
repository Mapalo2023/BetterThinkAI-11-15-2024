import React from 'react';
import { Book, Code, FileText, Terminal, Search, Copy, CheckCircle } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Documentation() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExample = `import { BetterThinkAI } from '@betterthink/sdk';

const ai = new BetterThinkAI({
  apiKey: process.env.BETTERTHINK_API_KEY
});

// Generate business insights
const insights = await ai.analyze({
  type: 'business',
  data: {
    industry: 'technology',
    market: 'B2B',
    challenges: ['scaling', 'automation']
  }
});

console.log(insights);`;

  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
      items: [
        'Quick Start Guide',
        'Installation',
        'Authentication',
        'Basic Concepts'
      ]
    },
    {
      title: 'API Reference',
      icon: Code,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      items: [
        'REST API',
        'SDK Reference',
        'Endpoints',
        'Rate Limits'
      ]
    },
    {
      title: 'Guides',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20',
      items: [
        'Authentication',
        'Error Handling',
        'Best Practices',
        'Migration Guide'
      ]
    },
    {
      title: 'Examples',
      icon: Terminal,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20',
      items: [
        'Code Samples',
        'Use Cases',
        'Integrations',
        'Tutorials'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Documentation
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Everything you need to integrate and build with BetterThink AI.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${section.bgColor} rounded-lg`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Start Example */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-16">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Quick Start Example
            </h3>
            <button
              onClick={() => handleCopy(codeExample)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Copy code"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <code className="text-gray-300">{codeExample}</code>
          </pre>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need help getting started?
          </h2>
          <p className="text-gray-400 mb-8">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/support"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/api"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              API Reference
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}