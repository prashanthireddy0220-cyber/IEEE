import axios from 'axios';
import { auth } from '../firebase';

export const apiBaseUrl = (
  import.meta.env.VITE_API_URL ||
  'https://ieee-backend-ny9t.onrender.app'
).replace(/\/$/, '');

axios.defaults.baseURL = apiBaseUrl;

axios.interceptors.request.use(async (config) => {
  if (!auth) return config;

  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    const idToken = await firebaseUser.getIdToken();
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  return config;
});

export default axios;
