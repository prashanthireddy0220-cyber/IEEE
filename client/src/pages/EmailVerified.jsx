import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function EmailVerified() {
  return (
    <div className="section-shell flex min-h-screen items-center justify-center pt-24">
      <div className="glassmorphism w-full max-w-md rounded-[32px] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
          <FiCheckCircle size={34} />
        </div>
        <div className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">
          Email Verified
        </div>
        <h1 className="mt-3 text-3xl font-bold">Your account is ready</h1>
        <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Thank you for verifying your email address. You can now sign in to the IEEE Education Society portal.
        </p>
        <Link to="/login" className="btn btn-primary mt-8 w-full">
          Continue to login
        </Link>
      </div>
    </div>
  );
}
