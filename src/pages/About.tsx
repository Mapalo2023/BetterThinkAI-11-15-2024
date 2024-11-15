import React from 'react';
import { Brain, Users, Target, Globe } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function About() {
  const stats = [
    {
      id: 'ai-generations',
      number: '10M+',
      label: 'AI Generations',
      icon: Brain,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      id: 'active-users',
      number: '5K+',
      label: 'Active Users',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20'
    },
    {
      id: 'success-rate',
      number: '95%',
      label: 'Success Rate',
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      id: 'countries',
      number: '20+',
      label: 'Countries',
      icon: Globe,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20'
    }
  ];

  const team = [
    {
      id: 'ceo',
      name: 'Mapalo Lukashi',
      role: 'CEO & Co-founder',
      image: 'https://theproducermentality.com/wp-content/uploads/2024/11/mpalo-1024x1024.jpg',
      bio: 'Expert AI research lead with 3+ years of experience in machine learning, data and AI general.'
    },
    {
      id: 'cto',
      name: 'Michael Chen',
      role: 'CTO & Co-founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      bio: 'Previously built ML infrastructure at major tech companies.'
    },
    {
      id: 'product',
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      bio: 'Product leader focused on creating intuitive AI experiences.'
    },
    {
      id: 'engineering',
      name: 'David Kim',
      role: 'Head of Engineering',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      bio: 'Engineering leader specializing in scalable AI systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Our Mission
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            We're on a mission to democratize AI technology and empower businesses 
            of all sizes to make better decisions through advanced analytics and automation.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-24">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 md:p-6 text-center"
            >
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-12">
            We're a team of passionate individuals dedicated to pushing the boundaries 
            of what's possible with AI.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 md:p-6"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 overflow-hidden rounded-full">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-blue-400 mb-3">{member.role}</p>
                <p className="text-sm text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}