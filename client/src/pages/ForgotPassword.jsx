import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMail } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('If the email is registered, password reset instructions will be sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell flex min-h-screen items-center justify-center pt-24">
      <div className="glassmorphism w-full max-w-md rounded-[32px] p-8">
        <div className="mb-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Password Reset</div>
          <h1 className="mt-3 text-3xl font-bold">Request a reset link</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Enter your email and check your inbox for next steps.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl bg-emerald-500/15 p-4 text-sm text-emerald-700 dark:text-emerald-300">
            {message}
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
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-70">
            {loading ? 'Sending...' : 'Send reset link'}
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
