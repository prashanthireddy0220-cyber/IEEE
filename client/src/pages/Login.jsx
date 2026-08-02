import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { roleConfig } from '../data/siteContent';

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

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const roleCards = Object.entries(roleConfig)
    .filter(([key]) => key !== 'student')
    .map(([key, value]) => ({ key, ...value }));

  const handleGoogleLogin = async () => {
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
    <div className="section-shell min-h-screen pt-28">
      <div className="section-frame grid gap-8 py-12 lg:grid-cols-[1fr_0.95fr]">
        <motion.div
          className="premium-card p-8 sm:p-10"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="eyebrow">KL University IEEE Portal</span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Student & Chapter Access Portal</h1>
          <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">
            Sign in seamlessly using your official KL University student email address. Access event registrations, chapter statistics, committee details, and personalized member services.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {roleCards.map((role) => (
              <div key={role.key} className="glassmorphism-sm rounded-[24px] p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-600 dark:text-sky-300">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{role.label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{role.badge}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{role.permissions[0]}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glassmorphism rounded-[32px] p-8 sm:p-10 flex flex-col justify-between"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Authentication</div>
            <h2 className="mt-3 text-3xl font-bold">Sign In to IEEE Chapter</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Only official KL University email accounts (<span className="font-semibold text-sky-600 dark:text-sky-400">@klu.ac.in</span>) are permitted.
            </p>
          </div>

          {error && (
            <div className="my-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}

          <div className="my-8 space-y-6">
            <div className="rounded-2xl border border-sky-500/20 bg-sky-50/50 p-4 text-sm dark:bg-sky-950/20">
              <div className="flex items-center gap-2 font-semibold text-sky-700 dark:text-sky-300">
                <FiCheckCircle size={18} />
                <span>Single Sign-On (SSO) Active</span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-xs leading-5">
                No passwords required. Authenticate directly with your official Google student account (@klu.ac.in).
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-800 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-lg focus:outline-none dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              <span>{loading ? 'Authenticating...' : 'Sign in with Google (@klu.ac.in)'}</span>
              {!loading && <FiArrowRight className="ml-auto" size={18} />}
            </button>
          </div>

          <div>
            <div className="rounded-[28px] bg-slate-950 p-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Notice for KLU Students</div>
              <div className="mt-2 text-xs leading-5 text-slate-300">
                If you encounter any access issues, please verify that you are selecting your official @klu.ac.in Google Account.
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Need assistance? <Link to="/contact" className="font-semibold text-sky-600 dark:text-sky-300">Contact Support</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

