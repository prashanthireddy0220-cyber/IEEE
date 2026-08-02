import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth, googleProvider, firebaseConfigMissingMessage } from '../firebase';

const AuthContext = createContext();

const isKluEmail = (email) => {
  return Boolean(email && email.toLowerCase().trim().endsWith('@klu.ac.in'));
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
    'auth/popup-closed-by-user': 'Sign-in window was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in popup request cancelled.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/account-exists-with-different-credential': 'An account already exists with a different credential.'
  };

  return messages[error?.code] || fallbackMessage;
};

const syncMongoProfile = async (firebaseUser, name) => {
  const idToken = await firebaseUser.getIdToken(true);
  axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;
  const response = await axios.post('/api/auth/session', { name });
  return response.data.user;
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

      if (!isKluEmail(firebaseUser.email)) {
        await signOut(auth);
        setUser(null);
        delete axios.defaults.headers.common.Authorization;
        setLoading(false);
        return;
      }

      try {
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

  const loginWithGoogle = async () => {
    if (!auth) throw firebaseConfigMissingMessage;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user?.email || '';

      if (!isKluEmail(email)) {
        await signOut(auth);
        throw new Error('Access restricted: Only KL University email addresses (@klu.ac.in) are allowed to sign in.');
      }

      const userData = await syncMongoProfile(result.user, result.user.displayName);
      setUser(userData);
      return userData;
    } catch (error) {
      if (typeof error === 'string') throw error;
      if (error?.message?.includes('Access restricted')) throw error.message;
      if (error.response) {
        throw getApiErrorMessage(error, 'Access denied for this account.');
      }
      throw getFirebaseErrorMessage(error, error.message || 'Google sign-in failed');
    }
  };

  const logout = async () => {
    axios.post('/api/auth/logout').catch(() => {});
    if (auth) await signOut(auth);
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

