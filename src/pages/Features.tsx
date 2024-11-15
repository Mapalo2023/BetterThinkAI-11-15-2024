import React from 'react';
import { 
  Brain, Bot, Lightbulb, Puzzle, LineChart, Scale, BarChart2, RefreshCw,
  Target, DollarSign, Calendar, TrendingUp, Users2, Database, Wallet, FileText
} from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI Brainstorming',
      description: 'Generate innovative ideas and get instant feedback with our AI-powered brainstorming tools. Evaluate ideas with SIP/SPIT analysis and detailed SWOT breakdowns.'
    },
    {
      icon: Bot,
      title: 'Business Automation',
      description: 'Discover automation opportunities and optimize your business processes with AI analysis. Get detailed recommendations and ROI calculations.'
    },
    {
      icon: Lightbulb,
      title: 'Design Thinking',
      description: 'Guide your team through the design thinking process with AI assistance at every stage, from empathy mapping to prototype testing.'
    },
    {
      icon: Puzzle,
      title: 'Problem Solving',
      description: 'Get AI-powered solutions and recommendations for your business challenges, complete with implementation roadmaps and resource planning.'
    },
    {
      icon: LineChart,
      title: 'Trend Tracking',
      description: 'Monitor and analyze market trends across platforms with real-time insights, sentiment analysis, and competitive intelligence.'
    },
    {
      icon: Scale,
      title: 'Legal & Compliance',
      description: 'Stay compliant with AI-powered legal analysis, risk assessments, and regulatory requirements across multiple jurisdictions.'
    },
    {
      icon: BarChart2,
      title: 'Growth Metrics',
      description: 'Track and optimize your key growth metrics with AI insights, performance projections, and actionable recommendations.'
    },
    {
      icon: RefreshCw,
      title: 'Pivot Analysis',
      description: 'Evaluate strategic pivot opportunities with AI-driven market analysis, feasibility assessments, and implementation strategies.'
    },
    {
      icon: Target,
      title: 'Risk Assessment',
      description: 'Identify and mitigate potential risks with AI-powered analysis, impact assessments, and mitigation strategies.'
    },
    {
      icon: DollarSign,
      title: 'Cost Estimation',
      description: 'Get accurate cost estimates for your projects with AI analysis of resource requirements, timelines, and market rates.'
    },
    {
      icon: Calendar,
      title: 'Timeline Planning',
      description: 'Create detailed project timelines with AI assistance, including resource allocation, dependencies, and milestone tracking.'
    },
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Deep dive into market opportunities with AI-powered competitor analysis, market sizing, and growth potential assessment.'
    },
    {
      icon: Users2,
      title: 'Resource Planning',
      description: 'Optimize resource allocation with AI recommendations for team composition, skills requirements, and capacity planning.'
    },
    {
      icon: Database,
      title: 'Tech Stack Advisor',
      description: 'Get personalized technology recommendations based on your project requirements, team expertise, and scalability needs.'
    },
    {
      icon: Wallet,
      title: 'Funding Strategy',
      description: 'Develop comprehensive funding strategies with AI insights on valuation, investor targeting, and pitch optimization.'
    },
    {
      icon: FileText,
      title: 'Documentation AI',
      description: 'Generate and maintain professional documentation with AI assistance for technical specs, user guides, and API docs.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Powerful Features for Your Business
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform your business with our comprehensive suite of AI-powered tools designed to drive growth and innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Unlock the Power of AI
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Our AI-powered platform helps you make better decisions, automate processes, and stay ahead of the competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => window.location.href = '/docs'}
              className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              View Documentation
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}