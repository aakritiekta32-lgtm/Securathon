import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firestoreInstance = null;
let authInstance = null;
let isInitialized = false;

// In-memory fallback stores for when Firebase Admin credentials are not yet configured
const inMemoryStore = {
  users: new Map(),
  farmers: new Map(),
  cropListings: new Map(),
  conversations: new Map(),
  webhookEvents: new Set()
};

/**
 * Initializes the Firebase Admin SDK using the configured service account.
 */
export function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    isInitialized = true;
    firestoreInstance = admin.firestore();
    authInstance = admin.auth();
    return { admin, db: firestoreInstance, auth: authInstance, isInitialized };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'securathon-d8800';
  const serviceAccountConfigPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';

  // Resolve service account path relative to backend root or absolute path
  let resolvedPath = path.isAbsolute(serviceAccountConfigPath)
    ? serviceAccountConfigPath
    : path.resolve(__dirname, '../../', serviceAccountConfigPath);

  // Also check if placed directly in backend root
  if (!fs.existsSync(resolvedPath)) {
    const alternativePath = path.resolve(process.cwd(), serviceAccountConfigPath);
    if (fs.existsSync(alternativePath)) {
      resolvedPath = alternativePath;
    }
  }

  if (fs.existsSync(resolvedPath)) {
    try {
      const rawData = fs.readFileSync(resolvedPath, 'utf8');
      const serviceAccount = JSON.parse(rawData);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId
      });

      firestoreInstance = admin.firestore();
      authInstance = admin.auth();
      isInitialized = true;

      console.log(`[Firebase Admin] Successfully initialized with project: ${serviceAccount.project_id || projectId}`);
      console.log(`[Firebase Admin] Service account loaded from: ${resolvedPath}`);
    } catch (err) {
      console.error('[Firebase Admin] Error loading service account JSON:', err.message);
      isInitialized = false;
    }
  } else {
    console.warn(`[Firebase Admin] Service account JSON not found at: ${resolvedPath}`);
    console.warn(`[Firebase Admin] To connect live Firestore & Auth, place 'serviceAccountKey.json' in backend/ and configure FIREBASE_SERVICE_ACCOUNT_PATH.`);
    console.warn(`[Firebase Admin] Backend is currently operating in active in-memory development mode.`);
    isInitialized = false;
  }

  return { admin, db: firestoreInstance, auth: authInstance, isInitialized };
}

/**
 * Returns whether live Firebase Admin is initialized.
 */
export function isFirebaseInitialized() {
  return isInitialized;
}

/**
 * Returns Firestore instance or in-memory fallback adapter.
 */
export function getDb() {
  if (isInitialized && firestoreInstance) {
    return firestoreInstance;
  }
  return null;
}

/**
 * Returns Firebase Auth instance.
 */
export function getAuth() {
  if (isInitialized && authInstance) {
    return authInstance;
  }
  return null;
}

/**
 * Returns in-memory fallback store for development/testing when credentials are not yet mounted.
 */
export function getInMemoryStore() {
  return inMemoryStore;
}

export default admin;
