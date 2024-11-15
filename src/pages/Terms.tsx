import React from 'react';
import { FileText, CheckSquare, AlertTriangle, HelpCircle } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Terms() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using BetterThink AI's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you should not use our services.`
    },
    {
      title: 'Use License',
      content: `We grant you a limited, non-exclusive, non-transferable license to use our services in accordance with these terms. This license is subject to your compliance with our usage policies and guidelines.`
    },
    {
      title: 'User Obligations',
      list: [
        'Maintain accurate account information',
        'Protect account credentials',
        'Use services in compliance with laws',
        'Respect intellectual property rights',
        'Not engage in unauthorized access',
        'Not use services for illegal purposes'
      ]
    },
    {
      title: 'Service Limitations',
      list: [
        'API rate limits and quotas',
        'Usage restrictions',
        'Service availability',
        'Feature limitations by plan',
        'Data storage limits',
        'Processing capacity'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-blue-500" />
            <h1 className="text-5xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
            <p className="text-gray-300 mb-4">
              Last updated: March 14, 2024
            </p>
            <p className="text-gray-400">
              These Terms of Service ("Terms") govern your access to and use of 
              BetterThink AI's website, products, and services. These Terms affect 
              your legal rights, so please read them carefully.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {section.title}
                </h2>
                {section.content && (
                  <p className="text-gray-400 mb-4">{section.content}</p>
                )}
                {section.list && (
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {section.list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Additional Sections */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-semibold text-white">
                  Disclaimer
                </h2>
              </div>
              <p className="text-gray-400">
                Our services are provided "as is" without any warranties, expressed
                or implied. We do not warrant that the services will be error-free
                or uninterrupted. Your use of our services is at your sole risk.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-semibold text-white">
                  Questions?
                </h2>
              </div>
              <p className="text-gray-400">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="text-gray-400 mt-4 space-y-2">
                <li>Email: legal@betterthink.ai</li>
                <li>Address: 123 AI Street, Tech City, TC 12345</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}