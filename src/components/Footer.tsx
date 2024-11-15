import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-500 hover:text-gray-400">Features</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-500 hover:text-gray-400">Pricing</Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-500 hover:text-gray-400">API</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-gray-400">About</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-500 hover:text-gray-400">Blog</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-500 hover:text-gray-400">Careers</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/docs" className="text-gray-500 hover:text-gray-400">Documentation</Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-500 hover:text-gray-400">Support</Link>
              </li>
              <li>
                <Link to="/status" className="text-gray-500 hover:text-gray-400">Status</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-gray-400">Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-gray-400">Terms</Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-500 hover:text-gray-400">Security</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-500" />
              <span className="text-gray-500">
                © {new Date().getFullYear()} BetterThink AI. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com/betterthink" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">
                Twitter
              </a>
              <a href="https://github.com/betterthink" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">
                GitHub
              </a>
              <a href="https://linkedin.com/company/betterthink" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}