import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, firebaseConfigMissingMessage } from '../firebase';

const AuthContext = createContext();
const FRONTEND_URL = 'https://ieee-jpc3.vercel.app';

const emailVerificationActionCodeSettings = {
  url: `${FRONTEND_URL}/auth/email-verified`,
  handleCodeInApp: false
};

const getApiErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;

  if (typeof data?.message === 'string') return data.message;
  if (typeof data === 'string' && data.trim()) return data;
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Unable to reach the server. Please try again later.';
  }

  return fallbackMessage;
};

const getFirebaseErrorMessage = (error, fallbackMessage) => {
  const messages = {
    'auth/email-already-in-use': 'An account already exists for this email. Please login or use Forgot password.',
    'auth/invalid-credential': 'Invalid credentials',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/weak-password': 'Use a stronger password.'
  };

  return messages[error?.code] || error?.message || fallbackMessage;
};

const syncMongoProfile = async (firebaseUser, name) => {
  const idToken = await firebaseUser.getIdToken(true);
  axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;
  const response = await axios.post('/api/auth/session', { name });
  return response.data.user;
};

const logRegistrationStep = (step, status, details) => {
  const log = status === 'failed' ? console.error : console.log;
  log(`[Registration] ${step} ${status}`, details || '');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        delete axios.defaults.headers.common.Authorization;
        setLoading(false);
        return;
      }

      try {
        await firebaseUser.reload();
        if (!firebaseUser.emailVerified) {
          setUser(null);
          delete axios.defaults.headers.common.Authorization;
          setLoading(false);
          return;
        }

        const userData = await syncMongoProfile(firebaseUser, firebaseUser.displayName);
        setUser(userData);
      } catch (error) {
        setUser(null);
        delete axios.defaults.headers.common.Authorization;
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    if (!auth) throw firebaseConfigMissingMessage;

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await credential.user.reload();

      if (!credential.user.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email before signing in.');
      }

      const userData = await syncMongoProfile(credential.user, credential.user.displayName);
      setUser(userData);
      return userData;
    } catch (error) {
      if (typeof error === 'string') throw error;
      if (error?.message === 'Please verify your email before signing in.') {
        throw error.message;
      }
      throw getFirebaseErrorMessage(error, 'Invalid credentials');
    }
  };

  const register = async (name, email, password) => {
    if (!auth) throw firebaseConfigMissingMessage;

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    let firebaseUser = null;
    const nonCriticalFailures = [];

    try {
      logRegistrationStep('createUserWithEmailAndPassword', 'started', { email: normalizedEmail });
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      firebaseUser = userCredential.user;
      logRegistrationStep('createUserWithEmailAndPassword', 'succeeded', { uid: firebaseUser.uid });
    } catch (error) {
      logRegistrationStep('createUserWithEmailAndPassword', 'failed', error);
      throw getFirebaseErrorMessage(error, 'Unable to create account. Please try again.');
    }

    try {
      logRegistrationStep('updateProfile', 'started', { uid: firebaseUser.uid, displayName: trimmedName });
      await updateProfile(firebaseUser, { displayName: trimmedName });
      logRegistrationStep('updateProfile', 'succeeded', { uid: firebaseUser.uid });
    } catch (error) {
      logRegistrationStep('updateProfile', 'failed', error);
      nonCriticalFailures.push('Your account was created, but we could not save your display name.');
    }

    try {
      logRegistrationStep('syncMongoProfile', 'started', { uid: firebaseUser.uid });
      await syncMongoProfile(firebaseUser, trimmedName);
      logRegistrationStep('syncMongoProfile', 'succeeded', { uid: firebaseUser.uid });
    } catch (error) {
      logRegistrationStep('syncMongoProfile', 'failed', error);
      nonCriticalFailures.push(
        `Your Firebase account was created, but we could not save your profile in MongoDB: ${getApiErrorMessage(error, 'Profile sync failed')}`
      );
    }

    try {
      logRegistrationStep('sendEmailVerification', 'started', { uid: firebaseUser.uid });
      await sendEmailVerification(firebaseUser, emailVerificationActionCodeSettings);
      logRegistrationStep('sendEmailVerification', 'succeeded', { uid: firebaseUser.uid });
    } catch (error) {
      logRegistrationStep('sendEmailVerification', 'failed', error);
      nonCriticalFailures.push(
        `Your account was created, but we could not send the verification email: ${getFirebaseErrorMessage(error, 'Email verification failed')}`
      );
    }

    try {
      logRegistrationStep('signOut', 'started', { uid: firebaseUser.uid });
      await signOut(auth);
      logRegistrationStep('signOut', 'succeeded', { uid: firebaseUser.uid });
    } catch (error) {
      logRegistrationStep('signOut', 'failed', error);
      nonCriticalFailures.push('Your account was created, but we could not sign you out automatically. Please sign out and verify your email before signing in.');
    }

    if (nonCriticalFailures.length) {
      return {
        message: nonCriticalFailures.join(' ')
      };
    }

    return {
      message:
        'Account created successfully. Please check your inbox and verify your email before signing in.'
    };
  };

  const logout = async () => {
    axios.post('/api/auth/logout').catch(() => {});
    if (auth) await signOut(auth);
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
