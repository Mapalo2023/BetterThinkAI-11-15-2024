import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, Download, ArrowUp, ArrowDown } from 'lucide-react';

interface Metric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 }
];

const metrics: Metric[] = [
  {
    name: 'Total Integrations',
    value: 12,
    change: 8,
    trend: 'up'
  },
  {
    name: 'Active Workflows',
    value: 8,
    change: 12,
    trend: 'up'
  },
  {
    name: 'Data Processed',
    value: 2.4,
    change: 15,
    trend: 'up'
  }
];

export default function DataInsights() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Data Insights</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search insights..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.name}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {metric.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}% from last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Workflow Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            {
              event: 'Workflow Completed',
              details: 'Lead Processing workflow completed successfully',
              time: '5 minutes ago'
            },
            {
              event: 'Integration Added',
              details: 'Connected to Salesforce CRM',
              time: '2 hours ago'
            },
            {
              event: 'Data Sync',
              details: 'Synchronized 1,234 records from Google Workspace',
              time: '4 hours ago'
            }
          ].map((activity, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{activity.event}</h4>
                  <p className="text-sm text-gray-500">{activity.details}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}