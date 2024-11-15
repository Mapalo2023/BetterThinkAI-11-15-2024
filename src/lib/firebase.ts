import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  User,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import toast from 'react-hot-toast';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth functions with enhanced error handling
export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    let message = 'Failed to sign in';
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
    }
    toast.error(message);
    throw new Error(message);
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Sign up error:', error);
    let message = 'Failed to create account';
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'An account already exists with this email';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password accounts are not enabled';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
    }
    toast.error(message);
    throw new Error(message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    toast.success('Signed out successfully');
  } catch (error: any) {
    console.error('Sign out error:', error);
    toast.error('Failed to sign out');
    throw new Error('Failed to sign out');
  }
};

// Profile update functions with enhanced error handling
export const updateUserProfile = async (profileData: {
  displayName?: string | null;
  photoURL?: string | null;
}) => {
  const user = auth.currentUser;
  if (!user) {
    const message = 'No user logged in';
    toast.error(message);
    throw new Error(message);
  }

  try {
    await updateProfile(user, profileData);
    toast.success('Profile updated successfully');
  } catch (error: any) {
    console.error('Profile update error:', error);
    toast.error('Failed to update profile');
    throw new Error('Failed to update profile');
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user?.email) {
    const message = 'No user logged in';
    toast.error(message);
    throw new Error(message);
  }

  try {
    // Re-authenticate user before password change
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await firebaseUpdatePassword(user, newPassword);
    toast.success('Password updated successfully');
  } catch (error: any) {
    console.error('Password update error:', error);
    let message = 'Failed to update password';
    switch (error.code) {
      case 'auth/wrong-password':
        message = 'Current password is incorrect';
        break;
      case 'auth/weak-password':
        message = 'New password is too weak';
        break;
      case 'auth/requires-recent-login':
        message = 'Please sign in again to update your password';
        break;
    }
    toast.error(message);
    throw new Error(message);
  }
};

// Auth state observer
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Helper functions
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

export const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    toast.error('Please sign in to continue');
    throw new Error('No user logged in');
  }
  return user.uid;
};

export const requireAuth = () => {
  if (!isAuthenticated()) {
    toast.error('Please sign in to continue');
    throw new Error('Authentication required');
  }
  return auth.currentUser!;
};