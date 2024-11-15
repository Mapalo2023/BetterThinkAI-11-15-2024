import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Careers() {
  const positions = [
    {
      id: 1,
      title: 'Senior ML Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$150k - $200k',
      description: 'Lead the development of our core AI models and help scale our machine learning infrastructure.'
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $160k',
      description: 'Create intuitive and beautiful interfaces for our AI-powered tools and features.'
    },
    {
      id: 3,
      title: 'Technical Writer',
      department: 'Documentation',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90k - $120k',
      description: 'Create comprehensive documentation and guides for our API and platform features.'
    }
  ];

  const perks = [
    {
      title: 'Competitive Compensation',
      description: 'Top-tier salary and equity packages',
      icon: DollarSign
    },
    {
      title: 'Flexible Work',
      description: 'Remote-first with flexible hours',
      icon: Clock
    },
    {
      title: 'Career Growth',
      description: 'Mentorship and learning opportunities',
      icon: Briefcase
    },
    {
      title: 'Global Team',
      description: 'Work with talent from around the world',
      icon: MapPin
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Help us shape the future of business intelligence and AI technology.
            We're always looking for exceptional talent to join our mission.
          </p>
        </div>

        {/* Perks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <perk.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{perk.title}</h3>
              <p className="text-gray-400">{perk.description}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Open Positions
          </h2>
          <div className="space-y-6">
            {positions.map((position) => (
              <div
                key={position.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {position.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{position.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-400">
                        <Briefcase className="w-4 h-4" />
                        {position.department}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        {position.type}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        {position.salary}
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Don't see the right position?
          </h2>
          <p className="text-gray-400 mb-8">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Send Resume
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}