import React from 'react';
import { Code, Terminal, Key, Lock, Copy, CheckCircle } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function API() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExample = `import { BetterThinkAI } from '@betterthink/sdk';

const ai = new BetterThinkAI({
  apiKey: 'your_api_key'
});

// Generate business insights
const insights = await ai.analyze({
  type: 'business',
  data: {
    industry: 'technology',
    market: 'B2B',
    challenges: ['scaling', 'automation']
  }
});`;

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Powerful API Access
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Integrate our AI capabilities directly into your applications with our robust API.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Code Example */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Quick Start
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

          {/* Features */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Code className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">RESTful API</h3>
              </div>
              <p className="text-gray-400">
                Simple and intuitive REST API with comprehensive documentation and examples.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Key className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">Authentication</h3>
              </div>
              <p className="text-gray-400">
                Secure API key authentication with role-based access control.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">Security</h3>
              </div>
              <p className="text-gray-400">
                Enterprise-grade security with encryption at rest and in transit.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Terminal className="w-5 h-5" />
            View Documentation
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}