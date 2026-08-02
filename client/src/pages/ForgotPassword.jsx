import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function ForgotPassword() {
  return (
    <div className="section-shell flex min-h-screen items-center justify-center pt-24 pb-16">
      <div className="glassmorphism w-full max-w-md rounded-[32px] p-8 sm:p-10 text-center">
        <div className="mb-6">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Authentication</div>
          <h1 className="mt-3 text-3xl font-bold">Password Reset Not Needed</h1>
        </div>

        <div className="my-6 rounded-2xl border border-sky-500/20 bg-sky-50/50 p-5 text-sm text-left dark:bg-sky-950/20">
          <div className="flex items-center gap-2 font-semibold text-sky-700 dark:text-sky-300">
            <FiCheckCircle size={20} />
            <span>Google Authentication Active</span>
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-xs leading-5">
            Passwords are no longer used. KL University students authenticate directly through Google single sign-on using your <span className="font-semibold text-sky-600 dark:text-sky-400">@klu.ac.in</span> email account.
          </p>
        </div>

        <RouterLink to="/login" className="btn btn-primary w-full block">
          Back to Google Sign In
        </RouterLink>
      </div>
    </div>
  );
}
