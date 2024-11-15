import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { Coins } from 'lucide-react';

export default function CreditsDisplay() {
  const { user } = useAuthStore();
  const { credits, fetchCredits } = useSubscriptionStore();

  React.useEffect(() => {
    if (user) {
      fetchCredits(user.uid);
    }
  }, [user]);

  if (!credits) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg">
      <Coins className="w-5 h-5" />
      <span className="font-medium">{credits.amount} Credits</span>
    </div>
  );
}