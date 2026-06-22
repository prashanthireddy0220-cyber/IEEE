import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiLock, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { roleConfig } from '../data/siteContent';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleCards = Object.entries(roleConfig)
    .filter(([key]) => key !== 'student')
    .map(([key, value]) => ({ key, ...value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
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
          <span className="eyebrow">Role-Based Access</span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Secure IEEE chapter portal for leadership and operations.</h1>
          <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">
            Access a premium control center designed for chairman approvals, faculty oversight, content management, event coordination, and chapter analytics.
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
          className="glassmorphism rounded-[32px] p-8 sm:p-10"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="mb-8">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Login</div>
            <h2 className="mt-3 text-3xl font-bold">Welcome back to the chapter dashboard</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Use your assigned IEEE chapter credentials to continue.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input-field pl-11"
                  placeholder="chairman@ieee.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-field pl-11"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Signing in...' : 'Access Dashboard'}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Protected Access</div>
            <div className="mt-3 text-sm text-slate-300">Use only your assigned chapter credentials.</div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link to="/forgot-password" className="font-semibold text-sky-600 dark:text-sky-300">Forgot password?</Link>
          </div>

          <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Need a member account? <Link to="/register" className="font-semibold text-sky-600 dark:text-sky-300">Create one here</Link>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
