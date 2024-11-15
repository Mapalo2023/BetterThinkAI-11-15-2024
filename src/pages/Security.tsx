import React from 'react';
import { Lock, Shield, Key, Eye, Server, UserCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Security() {
  const features = [
    {
      title: 'End-to-End Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard protocols.',
      icon: Lock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Access Control',
      description: 'Role-based access control with multi-factor authentication support.',
      icon: Key,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Data Privacy',
      description: 'Strict data isolation and privacy controls for all customer data.',
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Infrastructure Security',
      description: 'Secure cloud infrastructure with regular security audits.',
      icon: Server,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20'
    }
  ];

  const certifications = [
    'SOC 2 Type II',
    'ISO 27001',
    'GDPR Compliant',
    'HIPAA Compliant',
    'PCI DSS'
  ];

  const practices = [
    {
      title: 'Regular Security Audits',
      description: 'We conduct regular security assessments and penetration testing.'
    },
    {
      title: 'Incident Response',
      description: '24/7 security monitoring and incident response team.'
    },
    {
      title: 'Data Backups',
      description: 'Automated backups with encryption and secure storage.'
    },
    {
      title: 'Access Logging',
      description: 'Comprehensive audit logs of all system access.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-5xl font-bold text-white">Security</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn about our comprehensive security measures and data protection practices.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${feature.bgColor} rounded-lg`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-semibold text-white">
              Certifications & Compliance
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center"
              >
                <span className="text-gray-300">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Practices */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            Security Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {practices.map((practice) => (
              <div
                key={practice.title}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {practice.title}
                </h3>
                <p className="text-gray-400">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Security Issue */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-500 mb-4">
            <AlertTriangle className="w-5 h-5" />
            Found a security issue?
          </div>
          <p className="text-gray-400 mb-6">
            We take security seriously. If you discover a security issue, please let us know right away.
          </p>
          <a
            href="mailto:security@betterthink.ai"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shield className="w-5 h-5" />
            Report Security Issue
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}