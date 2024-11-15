import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export type Role = 'admin' | 'user';

export interface AuthGuardProps {
  requiredRoles?: Role[];
  ownerOnly?: boolean;
  ownerId?: string;
}

export function useAuthGuard({ requiredRoles, ownerOnly, ownerId }: AuthGuardProps = {}) {
  const { user, userRole } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/');
      return;
    }

    // Check role requirements
    if (requiredRoles?.length && !requiredRoles.includes(userRole?.isAdmin ? 'admin' : 'user')) {
      toast.error('You do not have permission to access this resource');
      navigate('/app/dashboard');
      return;
    }

    // Check ownership requirements
    if (ownerOnly && ownerId && user.uid !== ownerId && !userRole?.isAdmin) {
      toast.error('You can only access your own resources');
      navigate('/app/dashboard');
      return;
    }
  }, [user, userRole, requiredRoles, ownerOnly, ownerId, navigate]);

  return {
    isAuthenticated: !!user,
    isAdmin: userRole?.isAdmin || false,
    userId: user?.uid
  };
}

export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: AuthGuardProps = {}
) {
  return function GuardedComponent(props: P) {
    const { isAuthenticated } = useAuthGuard(guardProps);
    
    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}