import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { applyActionCode } from 'firebase/auth';
import { auth, firebaseConfigMissingMessage } from '../firebase';

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying your email address...');
  const [verified, setVerified] = useState(false);
  const oobCode = searchParams.get('oobCode') || '';

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!auth) {
          setStatus(firebaseConfigMissingMessage);
          return;
        }

        if (!oobCode) {
          setStatus('This verification link is missing or invalid.');
          return;
        }

        await applyActionCode(auth, oobCode);
        setVerified(true);
        setStatus('Your email address has been verified successfully. Your KARE IEEE Education Society account is now active.');
      } catch (error) {
        setStatus('This verification link is invalid or expired.');
      }
    };

    verifyEmail();
  }, [oobCode]);

  return (
    <div className="section-shell flex min-h-screen items-center justify-center pt-24">
      <div className="glassmorphism w-full max-w-md rounded-[32px] p-8 text-center">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${verified ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' : 'bg-sky-500/15 text-sky-600 dark:text-sky-300'}`}>
          <FiCheckCircle size={34} />
        </div>
        <div className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">
          Email Verified
        </div>
        <h1 className="mt-3 text-3xl font-bold">Email Verified Successfully</h1>
        <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
          {status}
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link to="/login" className="btn btn-primary w-full">Login</Link>
          <Link to="/" className="btn btn-outline w-full">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
