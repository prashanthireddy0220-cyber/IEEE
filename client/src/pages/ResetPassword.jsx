import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth, firebaseConfigMissingMessage } from '../firebase';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingCode, setCheckingCode] = useState(true);
  const oobCode = searchParams.get('oobCode') || '';
  const hasResetToken = Boolean(oobCode);

  const requirements = useMemo(() => ([
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) }
  ]), [password]);

  const strength = requirements.filter((item) => item.met).length;
  const passwordIsValid = strength === requirements.length;

  useEffect(() => {
    const verifyCode = async () => {
      if (!hasResetToken) {
        setCheckingCode(false);
        return;
      }

      try {
        if (!auth) {
          setError(firebaseConfigMissingMessage);
          return;
        }

        const email = await verifyPasswordResetCode(auth, oobCode);
        setVerifiedEmail(email);
      } catch (err) {
        setError('This reset link is invalid or expired. Please request a new password reset link.');
      } finally {
        setCheckingCode(false);
      }
    };

    verifyCode();
  }, [hasResetToken, oobCode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!hasResetToken) {
      setError('This reset link is missing or invalid. Please request a new password reset link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!passwordIsValid) {
      setError('Please meet all password requirements before resetting your password.');
      return;
    }

    setLoading(true);
    try {
      if (!auth) {
        setError(firebaseConfigMissingMessage);
        return;
      }

      await confirmPasswordReset(auth, oobCode, password);
      navigate('/password-reset-success');
    } catch (err) {
      setError('This reset link is invalid or expired. Please request a new password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell flex min-h-screen items-center justify-center pt-24">
      <div className="glassmorphism w-full max-w-md rounded-[32px] p-8">
        <div className="mb-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">KARE IEEE Account</div>
          <h1 className="mt-3 text-3xl font-bold">Reset your password</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Create a strong new password for your IEEE Education Society account.
          </p>
          {verifiedEmail && (
            <p className="mt-3 text-xs font-semibold text-sky-600 dark:text-sky-300">{verifiedEmail}</p>
          )}
        </div>

        {error && <div className="mb-6 rounded-2xl bg-rose-500/15 p-4 text-sm text-rose-700 dark:text-rose-300">{error}</div>}
        {checkingCode && (
          <div className="mb-6 rounded-2xl bg-sky-500/15 p-4 text-sm text-sky-700 dark:text-sky-200">
            Checking your reset link...
          </div>
        )}
        {!hasResetToken && !error && !checkingCode && (
          <div className="mb-6 rounded-2xl bg-amber-500/15 p-4 text-sm text-amber-700 dark:text-amber-200">
            Open the reset link from your email, or request a new password reset link.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input-field px-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="input-field px-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-sky-50/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
              <span>Password Strength</span>
              <span>{strength}/5</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {requirements.map((item, index) => (
                <div
                  key={item.label}
                  className={`h-2 rounded-full ${index < strength ? 'bg-sky-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                />
              ))}
            </div>
            <div className="mt-4 grid gap-2 text-sm">
              {requirements.map((item) => (
                <div key={item.label} className={item.met ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}>
                  {item.met ? 'Met:' : 'Needed:'} {item.label}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading || checkingCode || !hasResetToken} className="btn btn-primary w-full disabled:opacity-70">
            {loading ? 'Resetting...' : 'Reset password'}
            {!loading && <FiArrowRight size={16} />}
          </button>
        </form>

        {!hasResetToken && (
          <Link to="/forgot-password" className="mt-6 block text-center text-sm font-semibold text-sky-600 dark:text-sky-300">
            Request a new reset link
          </Link>
        )}

        <Link to="/login" className="mt-4 block text-center text-sm font-semibold text-sky-600 dark:text-sky-300">
          Back to login
        </Link>
      </div>
    </div>
  );
}
