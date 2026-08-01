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
        throw new Error('Please verify your email before logging in.');
      }

      const userData = await syncMongoProfile(credential.user, credential.user.displayName);
      setUser(userData);
      return userData;
    } catch (error) {
      if (typeof error === 'string') throw error;
      throw getFirebaseErrorMessage(error, 'Invalid credentials');
    }
  };

  const register = async (name, email, password) => {
    if (!auth) throw firebaseConfigMissingMessage;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await updateProfile(userCredential.user, { displayName: name.trim() });
      await sendEmailVerification(userCredential.user);
      await syncMongoProfile(userCredential.user, name.trim());
      await signOut(auth);

      return {
        message: 'Account created successfully.\nPlease check your email (including Spam folder) and verify your email before logging in.'
      };
    } catch (error) {
      if (error.response) {
        throw getApiErrorMessage(error, 'Unable to process request');
      }
      throw getFirebaseErrorMessage(error, 'Unable to process request');
    }
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
