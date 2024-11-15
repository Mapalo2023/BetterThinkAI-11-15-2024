import React from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Target, 
  TrendingUp,
  AlertTriangle,
  Users,
  Calendar,
  DollarSign,
  Bot,
  Lightbulb,
  Puzzle,
  LineChart as LineChartIcon,
  Database,
  Scale,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useBrainstormStore } from '../store/brainstormStore';
import { useAutomationStore } from '../store/automationStore';
import { useProblemSolverStore } from '../store/problemSolverStore';
import { useTrendTrackerStore } from '../store/trendTrackerStore';
import { useFeatureAnalysisStore } from '../store/features/featureAnalysisStore';
import { useResourcePlanningStore } from '../store/features/resourcePlanningStore';
import { useTechStackStore } from '../store/features/techStackStore';

const COLORS = {
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#6B7280'
};

export default function Dashboard() {
  const ideas = useBrainstormStore((state) => state.ideas);
  const automationResults = useAutomationStore((state) => state.results);
  const solutions = useProblemSolverStore((state) => state.solutions);
  const trends = useTrendTrackerStore((state) => state.trends);
  const features = useFeatureAnalysisStore((state) => state.features);
  const resources = useResourcePlanningStore((state) => state.plans);
  const techStacks = useTechStackStore((state) => state.stacks);

  // Calculate average metrics from ideas
  const ideaMetrics = ideas.reduce((acc, idea) => {
    acc.marketPotential += idea.analysis.marketPotential;
    acc.innovationScore += idea.analysis.innovationScore;
    acc.feasibilityScore += idea.analysis.feasibilityScore;
    acc.riskLevel += idea.analysis.riskLevel;
    return acc;
  }, {
    marketPotential: 0,
    innovationScore: 0,
    feasibilityScore: 0,
    riskLevel: 0
  });

  if (ideas.length > 0) {
    ideaMetrics.marketPotential = Math.round(ideaMetrics.marketPotential / ideas.length);
    ideaMetrics.innovationScore = Math.round(ideaMetrics.innovationScore / ideas.length);
    ideaMetrics.feasibilityScore = Math.round(ideaMetrics.feasibilityScore / ideas.length);
    ideaMetrics.riskLevel = Math.round(ideaMetrics.riskLevel / ideas.length);
  }

  // Calculate average automation metrics
  const automationMetrics = automationResults.reduce((acc, result) => {
    acc.efficiency += result.analysis.efficiency;
    acc.potential += result.analysis.potential;
    acc.risk += result.analysis.risk;
    acc.roi += result.analysis.roi;
    return acc;
  }, {
    efficiency: 0,
    potential: 0,
    risk: 0,
    roi: 0
  });

  if (automationResults.length > 0) {
    automationMetrics.efficiency = Math.round(automationMetrics.efficiency / automationResults.length);
    automationMetrics.potential = Math.round(automationMetrics.potential / automationResults.length);
    automationMetrics.risk = Math.round(automationMetrics.risk / automationResults.length);
    automationMetrics.roi = Math.round(automationMetrics.roi / automationResults.length);
  }

  // Calculate feature metrics
  const featureMetrics = features.reduce((acc, feature) => {
    acc.impact += feature.analysis.impact;
    acc.feasibility += feature.analysis.feasibility;
    return acc;
  }, {
    impact: 0,
    feasibility: 0
  });

  if (features.length > 0) {
    featureMetrics.impact = Math.round(featureMetrics.impact / features.length);
    featureMetrics.feasibility = Math.round(featureMetrics.feasibility / features.length);
  }

  const stats = [
    {
      title: 'Ideas Generated',
      value: ideas.length.toString(),
      icon: Brain,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Automation ROI',
      value: `${automationMetrics.roi}%`,
      icon: Bot,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Solutions Created',
      value: solutions.length.toString(),
      icon: Puzzle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Trends',
      value: trends.length.toString(),
      icon: LineChartIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Tech Stacks',
      value: techStacks.length.toString(),
      icon: Database,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Resource Plans',
      value: resources.length.toString(),
      icon: Users,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    }
  ];

  // Generate performance data
  const performanceData = [
    {
      name: 'Ideas',
      marketPotential: ideaMetrics.marketPotential,
      innovationScore: ideaMetrics.innovationScore,
      feasibilityScore: ideaMetrics.feasibilityScore
    },
    {
      name: 'Automation',
      efficiency: automationMetrics.efficiency,
      potential: automationMetrics.potential,
      risk: automationMetrics.risk
    },
    {
      name: 'Features',
      impact: featureMetrics.impact,
      feasibility: featureMetrics.feasibility
    }
  ];

  // Recent activities
  const activities = [
    ...(ideas.length > 0 ? [{
      icon: Brain,
      text: `New idea generated: ${ideas[0].title}`,
      time: ideas[0].createdAt.toLocaleString()
    }] : []),
    ...(automationResults.length > 0 ? [{
      icon: Bot,
      text: `Business analysis: ${automationResults[0].businessInfo.name}`,
      time: automationResults[0].createdAt.toLocaleString()
    }] : []),
    ...(solutions.length > 0 ? [{
      icon: Puzzle,
      text: `Problem solved: ${solutions[0].problemInfo.description}`,
      time: solutions[0].createdAt.toLocaleString()
    }] : []),
    ...(features.length > 0 ? [{
      icon: Target,
      text: `Feature analyzed: ${features[0].name}`,
      time: features[0].createdAt.toLocaleString()
    }] : [])
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-500" />
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your project metrics and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="marketPotential" name="Market Potential" fill="#3B82F6" />
                <Bar dataKey="innovationScore" name="Innovation" fill="#10B981" />
                <Bar dataKey="feasibilityScore" name="Feasibility" fill="#8B5CF6" />
                <Bar dataKey="efficiency" name="Efficiency" fill="#F59E0B" />
                <Bar dataKey="potential" name="Potential" fill="#EC4899" />
                <Bar dataKey="impact" name="Impact" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Risk Analysis</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Ideas', risk: ideaMetrics.riskLevel },
                { name: 'Automation', risk: automationMetrics.risk },
                { name: 'Features', risk: featureMetrics.feasibility }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Risk Level"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <activity.icon className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{activity.text}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No recent activities to display
            </p>
          )}
        </div>
      </div>
    </div>
  );
}