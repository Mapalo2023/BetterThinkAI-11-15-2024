import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  LayoutDashboard, 
  Settings, 
  Bot, 
  LogOut, 
  Lightbulb, 
  Menu, 
  Users,
  Puzzle,
  LineChart,
  LayoutGrid,
  Target,
  DollarSign,
  Calendar,
  TrendingUp,
  Users2,
  Database,
  Wallet,
  Scale,
  BarChart2,
  RefreshCw,
  Network,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import CreditsDisplay from './shared/CreditsDisplay';

interface NavCategory {
  label: string;
  items: {
    path: string;
    icon: React.ElementType;
    label: string;
  }[];
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(['Core']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const navCategories: NavCategory[] = [
    {
      label: 'Core',
      items: [
        { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/app/brainstorm', icon: Brain, label: 'Brainstorm' },
        { path: '/app/automation', icon: Bot, label: 'AI Automation' },
        { path: '/app/design-thinking', icon: Lightbulb, label: 'Design Thinking' },
        { path: '/app/problem-solver', icon: Puzzle, label: 'Problem Solver' },
        { path: '/app/trend-tracker', icon: LineChart, label: 'TrendTracker' },
        { path: '/app/connect', icon: Network, label: 'Connect' }
      ]
    },
    {
      label: 'Analysis',
      items: [
        { path: '/app/feature-analysis', icon: LayoutGrid, label: 'Feature Analysis' },
        { path: '/app/risk-assessment', icon: Target, label: 'Risk Assessment' },
        { path: '/app/market-analysis', icon: TrendingUp, label: 'Market Analysis' },
        { path: '/app/pivot-analysis', icon: RefreshCw, label: 'Pivot Analysis' }
      ]
    },
    {
      label: 'Planning',
      items: [
        { path: '/app/cost-estimation', icon: DollarSign, label: 'Cost Estimation' },
        { path: '/app/timeline-planning', icon: Calendar, label: 'Timeline Planning' },
        { path: '/app/resource-planning', icon: Users2, label: 'Resource Planning' }
      ]
    },
    {
      label: 'Strategy',
      items: [
        { path: '/app/tech-stack', icon: Database, label: 'Tech Stack Advisor' },
        { path: '/app/funding-strategy', icon: Wallet, label: 'Funding Strategy' },
        { path: '/app/legal-compliance', icon: Scale, label: 'Legal & Compliance' },
        { path: '/app/growth-metrics', icon: BarChart2, label: 'Growth Metrics' }
      ]
    }
  ];

  // Add admin and settings items separately
  const systemItems = [
    ...(userRole?.isAdmin ? [{ path: '/app/admin', icon: Users, label: 'User Management' }] : []),
    { path: '/app/settings', icon: Settings, label: 'Settings' }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-bold">BetterThink AI</h1>
        <div className="flex items-center gap-3">
          <CreditsDisplay />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`w-full md:w-64 bg-card border-r border-border overflow-y-auto ${
        isMobileMenuOpen ? 'block' : 'hidden md:block'
      }`}>
        <div className="p-4">
          <div className="hidden md:block mb-8">
            <h1 className="text-2xl font-bold">BetterThink AI</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.email}</p>
          </div>
          
          <div className="space-y-4">
            {navCategories.map((category) => (
              <div key={category.label}>
                <button
                  onClick={() => toggleCategory(category.label)}
                  className="w-full flex items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {category.label}
                  {expandedCategories.includes(category.label) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedCategories.includes(category.label) && (
                  <div className="mt-1 space-y-1">
                    {category.items.map(({ path, icon: Icon, label }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                          location.pathname === path
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* System Items */}
            <div className="pt-4 border-t border-border">
              {systemItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="hidden md:block">
              <CreditsDisplay />
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2 w-full text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>

      <Toaster position="top-right" />
    </div>
  );
}