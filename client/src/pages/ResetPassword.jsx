import React, { useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiLock } from 'react-icons/fi';

export default function ResetPassword() {
  const passwordHelp = 'Use at least 8 characters and include one special character.';
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token') || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Invalid request');
      return;
    }

    if (password.length < 8 || !/[^A-Za-z0-9]/.test(password)) {
      setError(passwordHelp);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', { token, password });
      setMessage(response.data.message);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell flex min-h-screen items-center justify-center pt-24">
      <div className="glassmorphism w-full max-w-md rounded-[32px] p-8">
        <div className="mb-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">New Password</div>
          <h1 className="mt-3 text-3xl font-bold">Reset your password</h1>
        </div>

        {message && <div className="mb-6 rounded-2xl bg-emerald-500/15 p-4 text-sm text-emerald-700 dark:text-emerald-300">{message}</div>}
        {error && <div className="mb-6 rounded-2xl bg-rose-500/15 p-4 text-sm text-rose-700 dark:text-rose-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            ['Password', password, setPassword],
            ['Confirm Password', confirmPassword, setConfirmPassword]
          ].map(([label, value, setter]) => (
            <div key={label}>
              <label className="mb-2 block text-sm font-semibold">{label}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                  className="input-field pl-11"
                  required
                  minLength={8}
                  pattern={label === 'Password' ? '.*[^A-Za-z0-9].*' : undefined}
                  title={label === 'Password' ? passwordHelp : undefined}
                />
              </div>
              {label === 'Password' && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{passwordHelp}</p>}
            </div>
          ))}

          <button type="submit" disabled={loading || !token} className="btn btn-primary w-full disabled:opacity-70">
            {loading ? 'Resetting...' : 'Reset password'}
            {!loading && <FiArrowRight size={16} />}
          </button>
        </form>

        <Link to="/login" className="mt-6 block text-center text-sm font-semibold text-sky-600 dark:text-sky-300">
          Back to login
        </Link>
      </div>
    </div>
  );
}
