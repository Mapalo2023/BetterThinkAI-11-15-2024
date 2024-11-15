import React from 'react';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Privacy() {
  const sections = [
    {
      title: 'Data Collection',
      icon: Eye,
      content: `We collect information that you provide directly to us, including:
        • Account information (name, email, company)
        • Usage data and analytics
        • Payment information
        • Communication preferences`
    },
    {
      title: 'Data Protection',
      icon: Lock,
      content: `We implement industry-standard security measures:
        • End-to-end encryption
        • Regular security audits
        • Secure data centers
        • Access controls and monitoring`
    },
    {
      title: 'Data Usage',
      icon: UserCheck,
      content: `Your data is used for:
        • Providing and improving our services
        • Personalizing your experience
        • Communication about updates
        • Legal compliance`
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-5xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We take your privacy seriously. Learn how we collect, use, and protect your data.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
            <p className="text-gray-300 mb-4">
              Last updated: March 14, 2024
            </p>
            <p className="text-gray-400">
              This Privacy Policy describes how BetterThink AI ("we", "our", or "us") 
              collects, uses, and shares your personal information when you use our 
              services. By using our services, you agree to the collection and use 
              of information in accordance with this policy.
            </p>
          </div>

          {/* Key Sections */}
          <div className="grid gap-8">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <section.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="text-gray-400 whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Sections */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Your Rights
              </h2>
              <p className="text-gray-400 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-400 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="text-gray-400 space-y-2">
                <li>Email: privacy@betterthink.ai</li>
                <li>Address: 123 AI Street, Tech City, TC 12345</li>
                <li>Phone: (555) 123-4567</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}