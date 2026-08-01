import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function PasswordResetSuccess() {
  return (
    <div className="section-shell flex min-h-screen items-center justify-center pt-24">
      <div className="glassmorphism w-full max-w-md rounded-[32px] p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
          <FiCheckCircle size={38} />
        </div>
        <div className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">
          Password Updated
        </div>
        <h1 className="mt-3 text-3xl font-bold">Password Reset Successfully</h1>
        <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Your password has been updated successfully.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link to="/login" className="btn btn-primary w-full">Login</Link>
          <Link to="/" className="btn btn-outline w-full">Home</Link>
        </div>
      </div>
    </div>
  );
}
