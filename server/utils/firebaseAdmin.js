import fs from 'fs';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const RENDER_FIREBASE_SERVICE_ACCOUNT_FILE = '/etc/secrets/firebase-service-account.json';

const getServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (fs.existsSync(RENDER_FIREBASE_SERVICE_ACCOUNT_FILE)) {
    return JSON.parse(fs.readFileSync(RENDER_FIREBASE_SERVICE_ACCOUNT_FILE, 'utf8'));
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin SDK is not configured');
  }

  return { projectId, clientEmail, privateKey };
};

export const initializeFirebaseAdmin = () => {
  if (getApps().length) return getApp();

  return initializeApp({
    credential: cert(getServiceAccount())
  });
};

export const getFirebaseAdmin = () => initializeFirebaseAdmin();

export const verifyFirebaseIdToken = async (idToken) => {
  const firebase = getFirebaseAdmin();
  return getAuth(firebase).verifyIdToken(idToken);
};
