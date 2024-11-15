import React from 'react';
import { LifeBuoy, MessageCircle, Mail, Phone, Search, ArrowRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Support() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = [
    {
      title: 'Getting Started',
      description: 'New to BetterThink AI? Start here.',
      icon: LifeBuoy,
      articles: [
        'Quick Start Guide',
        'Account Setup',
        'Basic Concepts',
        'First Analysis'
      ]
    },
    {
      title: 'API & Integration',
      description: 'Technical documentation and guides.',
      icon: MessageCircle,
      articles: [
        'API Authentication',
        'Rate Limits',
        'Error Handling',
        'SDK Setup'
      ]
    },
    {
      title: 'Billing & Plans',
      description: 'Subscription and payment information.',
      icon: Mail,
      articles: [
        'Pricing Plans',
        'Payment Methods',
        'Credits System',
        'Invoices'
      ]
    },
    {
      title: 'Account & Security',
      description: 'Manage your account settings.',
      icon: Phone,
      articles: [
        'Account Settings',
        'Security Features',
        'Team Management',
        'API Keys'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with BetterThink AI?',
      answer: "Sign up for a free account, complete the onboarding process, and you'll be ready to start using our AI-powered tools. Check out our Quick Start Guide for detailed instructions."
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay via invoice.'
    },
    {
      question: 'How does the credits system work?',
      answer: 'Credits are used for AI generations and analyses. Each plan comes with a monthly credit allowance. You can monitor your credit usage in your dashboard.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            How can we help?
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Find answers in our documentation, get help from our support team, or join our community.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <category.icon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">{category.title}</h3>
              </div>
              <p className="text-gray-400 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.articles.map((article) => (
                  <li key={article}>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                      {article}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQs Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still need help?
          </h2>
          <p className="text-gray-400 mb-8">
            Our support team is available 24/7 to help you with any questions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Mail className="w-5 h-5" />
              Email Support
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}