import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your account...');
  const token = searchParams.get('token') || '';

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.post('/api/auth/verify-email', { token });
        setMessage(response.data.message);
      } catch (error) {
        setMessage('If the verification link is valid, the account has been verified.');
      }
    };

    verify();
  }, [token]);

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
