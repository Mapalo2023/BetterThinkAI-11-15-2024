import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupAdmin() {
  const userId = '515wZrM6dgMu8O9Z0BrdzY8GySi1';
  const timestamp = new Date();

  try {
    // Create batch write
    const batch = writeBatch(db);

    // Set admin role
    const roleRef = doc(db, 'userRoles', userId);
    batch.set(roleRef, {
      isAdmin: true,
      appointedAt: timestamp,
      appointedBy: 'system'
    });

    // Set enterprise subscription
    const subscriptionRef = doc(db, 'subscriptions', userId);
    batch.set(subscriptionRef, {
      userId: userId,
      type: 'enterprise',
      features: ['customApi', 'unlimited'],
      startDate: timestamp,
      status: 'active'
    });

    // Set credits
    const creditsRef = doc(db, 'credits', userId);
    batch.set(creditsRef, {
      userId: userId,
      amount: 1000,
      lastUpdated: timestamp
    });

    // Set user profile
    const userRef = doc(db, 'users', userId);
    batch.set(userRef, {
      email: 'mapalolukashi@gmail.com',
      role: 'admin',
      createdAt: timestamp,
      updatedAt: timestamp
    });

    // Commit the batch
    await batch.commit();

    console.log('Admin setup completed successfully!');
    console.log('User ID:', userId);
    console.log('Role: Admin');
    console.log('Subscription: Enterprise');
    console.log('Credits: 1000');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

// Run the setup
setupAdmin();