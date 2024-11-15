import React from 'react';
import { Coins } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function CreditsDisplay() {
  const { credits, subscription } = useAuthStore();

  if (!credits || !subscription) return null;

  return (
    <Link
      to="/app/settings?tab=subscription"
      className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <Coins className="w-4 h-4 text-yellow-500" />
      <span className="text-sm font-medium">
        {credits.available} credits
      </span>
    </Link>
  );
}