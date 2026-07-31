import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your account...');
  const oobCode = searchParams.get('oobCode') || '';

  useEffect(() => {
    const verify = async () => {
      try {
        if (!oobCode) {
          setMessage('This verification link is missing or invalid.');
          return;
        }

        await applyActionCode(auth, oobCode);
        setMessage('Your email has been verified. You can now log in.');
      } catch (error) {
        setMessage('This verification link is invalid or expired.');
      }
    };

    verify();
  }, [oobCode]);

  return (
    <div className="section-shell flex min-h-screen items-center justify-center pt-24">
      <div className="glassmorphism w-full max-w-md rounded-[32px] p-8 text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Email Verification</div>
        <h1 className="mt-3 text-3xl font-bold">Account verification</h1>
        <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{message}</p>
        <Link to="/login" className="btn btn-primary mt-8 w-full">
          Continue to login
        </Link>
      </div>
    </div>
  );
}
