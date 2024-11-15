import React from 'react';
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Status() {
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const services = [
    {
      name: 'API',
      status: 'operational',
      latency: '45ms',
      uptime: '99.99%'
    },
    {
      name: 'Web Application',
      status: 'operational',
      latency: '120ms',
      uptime: '99.95%'
    },
    {
      name: 'ML Models',
      status: 'operational',
      latency: '230ms',
      uptime: '99.97%'
    },
    {
      name: 'Database',
      status: 'operational',
      latency: '25ms',
      uptime: '99.99%'
    }
  ];

  const incidents = [
    {
      date: '2024-03-10',
      title: 'API Performance Degradation',
      status: 'resolved',
      description: 'Temporary latency increase in API endpoints. Issue resolved within 15 minutes.'
    },
    {
      date: '2024-03-05',
      title: 'Scheduled Maintenance',
      status: 'completed',
      description: 'Planned database optimization and system updates.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-500 bg-green-500/20';
      case 'investigating':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'completed':
        return 'text-blue-500 bg-blue-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-500 mb-4">
            <CheckCircle className="w-5 h-5" />
            All Systems Operational
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            System Status
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Current status of BetterThink AI services and infrastructure
          </p>
        </div>

        {/* Services Status */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Services</h2>
            <button 
              onClick={() => setLastUpdated(new Date())}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <span className="text-white font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-gray-400">Latency: {service.latency}</span>
                  <span className="text-gray-400">Uptime: {service.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident History */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Incident History</h2>
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">
                      {new Date(incident.date).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm ${getIncidentStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {incident.title}
                </h3>
                <p className="text-gray-400">
                  {incident.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      </div>

      <Footer />
    </div>
  );
}