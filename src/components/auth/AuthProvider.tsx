import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext<ReturnType<typeof useAuthStore>>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Load user data
          const [roleDoc, subDoc, creditsDoc] = await Promise.all([
            getDoc(doc(db, 'userRoles', user.uid)),
            getDoc(doc(db, 'subscriptions', user.uid)),
            getDoc(doc(db, 'credits', user.uid))
          ]);

          store.setUser(user);
          store.setUserRole(roleDoc.exists() ? roleDoc.data() : { isAdmin: false });
          store.setSubscription(subDoc.exists() ? subDoc.data() : null);
          store.setCredits(creditsDoc.exists() ? creditsDoc.data() : null);

          // Only redirect if we're not already in the app
          if (!location.pathname.startsWith('/app')) {
            navigate('/app/dashboard');
          }
        } else {
          store.setUser(null);
          store.setUserRole(null);
          store.setSubscription(null);
          store.setCredits(null);

          if (location.pathname.startsWith('/app')) {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user data');
      }
    });

    return () => unsubscribe();
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);