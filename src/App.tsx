import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Brainstorm from './components/brainstorm/Brainstorm';
import Automation from './components/automation/Automation';
import DesignThinking from './components/designThinking/DesignThinking';
import ProblemSolver from './components/problemSolver/ProblemSolver';
import TrendTracker from './components/trendTracker/TrendTracker';
import Connect from './components/connect/Connect';
import Settings from './components/settings/Settings';
import LandingPage from './components/LandingPage';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import UserManagement from './components/admin/UserManagement';

// Feature Components
import FeatureAnalysis from './components/features/FeatureAnalysis';
import RiskAssessment from './components/features/RiskAssessment';
import CostEstimation from './components/features/CostEstimation';
import TimelinePlanning from './components/features/TimelinePlanning';
import MarketAnalysis from './components/features/MarketAnalysis';
import ResourcePlanning from './components/features/ResourcePlanning';
import TechStackAdvisor from './components/features/TechStackAdvisor';
import FundingStrategy from './components/features/FundingStrategy';
import LegalCompliance from './components/features/LegalCompliance';
import GrowthMetrics from './components/features/GrowthMetrics';
import PivotAnalysis from './components/features/PivotAnalysis';

// Footer Pages
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import API from './pages/API';
import About from './pages/About';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Documentation from './pages/Documentation';
import Support from './pages/Support';
import Status from './pages/Status';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Product Routes */}
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/api" element={<API />} />
          
          {/* Company Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          
          {/* Resources Routes */}
          <Route path="/docs" element={<Documentation />} />
          <Route path="/support" element={<Support />} />
          <Route path="/status" element={<Status />} />
          
          {/* Legal Routes */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />

          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="brainstorm" element={<Brainstorm />} />
            <Route path="automation" element={<Automation />} />
            <Route path="design-thinking" element={<DesignThinking />} />
            <Route path="problem-solver" element={<ProblemSolver />} />
            <Route path="trend-tracker" element={<TrendTracker />} />
            <Route path="connect" element={<Connect />} />
            <Route path="feature-analysis" element={<FeatureAnalysis />} />
            <Route path="risk-assessment" element={<RiskAssessment />} />
            <Route path="cost-estimation" element={<CostEstimation />} />
            <Route path="timeline-planning" element={<TimelinePlanning />} />
            <Route path="market-analysis" element={<MarketAnalysis />} />
            <Route path="resource-planning" element={<ResourcePlanning />} />
            <Route path="tech-stack" element={<TechStackAdvisor />} />
            <Route path="funding-strategy" element={<FundingStrategy />} />
            <Route path="legal-compliance" element={<LegalCompliance />} />
            <Route path="growth-metrics" element={<GrowthMetrics />} />
            <Route path="pivot-analysis" element={<PivotAnalysis />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}