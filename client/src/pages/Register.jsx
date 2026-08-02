import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function Register() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-lg glassmorphism p-8 sm:p-10 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">KLU Member Portal</span>
          <h1 className="text-3xl font-bold mt-2 mb-3">Join IEEE Education Society</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Registration is automatic for all KL University students using Google OAuth with <span className="font-semibold text-sky-600 dark:text-sky-400">@klu.ac.in</span>.
          </p>
        </div>

        {error && (
          <motion.div
            className="p-4 bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 rounded-2xl mb-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6 mb-8">
          <div className="rounded-2xl border border-sky-500/20 bg-sky-50/50 p-4 text-sm dark:bg-sky-950/20">
            <div className="flex items-center gap-2 font-semibold text-sky-700 dark:text-sky-300">
              <FiCheckCircle size={18} />
              <span>Instant KLU Account Provisioning</span>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300 text-xs leading-5">
              Simply click below to authenticate with your official student email. Your profile will be created automatically.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-800 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-lg focus:outline-none dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span>{loading ? 'Connecting...' : 'Continue with Google (@klu.ac.in)'}</span>
            {!loading && <FiArrowRight className="ml-auto" size={18} />}
          </button>
        </div>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-600 dark:text-sky-300">
            Go to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
