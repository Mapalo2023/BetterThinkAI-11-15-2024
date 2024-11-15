import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function cleanupTempDocs() {
  console.log('Cleaning up temporary documents...');
  const collections = [
    'users',
    'userRoles',
    'subscriptions',
    'credits',
    'ideas',
    'analyses',
    'public'
  ];

  for (const collectionName of collections) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs
      .filter(doc => doc.data()._temp)
      .map(doc => deleteDoc(doc.ref));
    
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
      console.log(`Cleaned up ${deletePromises.length} temp docs from ${collectionName}`);
    }
  }
}

async function initializeCollections() {
  try {
    // Create initial collections
    const collections = [
      'users',
      'userRoles',
      'subscriptions',
      'credits',
      'ideas',
      'analyses',
      'public',
      'research',
      'problemStatements',
      'prototypes',
      'testResults'
    ];

    console.log('Creating collections...');
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const tempDoc = doc(collectionRef, 'temp');
      await setDoc(tempDoc, {
        _created: new Date(),
        _temp: true
      });
      console.log(`Created collection: ${collectionName}`);
    }

    console.log('Collections initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing collections:', error);
    return false;
  }
}

async function initializeAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('Admin email and password must be provided in environment variables');
    }

    console.log('Setting up admin account...');
    let userCredential;

    try {
      // Try to create new admin account
      userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Admin account created successfully');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // If admin exists, try to sign in
        console.log('Admin account exists, signing in...');
        userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log('Signed in successfully');
      } else {
        throw error;
      }
    }

    const adminUid = userCredential.user.uid;
    const timestamp = new Date();

    // Create admin documents
    const adminData = {
      userRole: {
        isAdmin: true,
        appointedAt: timestamp,
        appointedBy: 'system'
      },
      subscription: {
        userId: adminUid,
        type: 'enterprise',
        features: ['customApi', 'unlimited'],
        startDate: timestamp,
        status: 'active'
      },
      credits: {
        userId: adminUid,
        amount: 1000,
        lastUpdated: timestamp
      },
      profile: {
        email: adminEmail,
        role: 'admin',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    // Write admin data to collections
    await Promise.all([
      setDoc(doc(db, 'userRoles', adminUid), adminData.userRole),
      setDoc(doc(db, 'subscriptions', adminUid), adminData.subscription),
      setDoc(doc(db, 'credits', adminUid), adminData.credits),
      setDoc(doc(db, 'users', adminUid), adminData.profile)
    ]);

    console.log('Admin data initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing admin:', error);
    return false;
  }
}

// Run initialization
async function initialize() {
  try {
    console.log('Starting Firestore initialization...');

    const collectionsInitialized = await initializeCollections();
    if (!collectionsInitialized) {
      throw new Error('Failed to initialize collections');
    }

    const adminInitialized = await initializeAdmin();
    if (!adminInitialized) {
      throw new Error('Failed to initialize admin');
    }

    await cleanupTempDocs();

    console.log('Firestore initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

initialize();