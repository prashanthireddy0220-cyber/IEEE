import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowRight, FiCheckCircle, FiPlayCircle } from 'react-icons/fi';
import { heroStats } from '../data/siteContent';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute inset-0 mesh-bg" />
      <motion.div
        className="floating-orb absolute left-[8%] top-28 h-28 w-28 rounded-full bg-cyan-400/40"
        animate={{ y: [0, -18, 0], x: [0, 14, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="floating-orb absolute right-[10%] top-44 h-40 w-40 rounded-full bg-sky-500/30"
        animate={{ y: [0, 24, 0], x: [0, -16, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="floating-orb absolute bottom-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-emerald-300/20"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      <div className="section-frame relative z-10 grid min-h-[calc(100vh-7rem)] items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-3xl">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            IEEE Education Society
          </motion.span>

          <motion.h1
            className="mt-4 text-5xl font-bold leading-[0.95] text-slate-900 dark:text-white sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Empowering Innovation Through Education & Technology
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            A premium student-led IEEE platform where technical learning, mentorship, leadership, and community action come together to shape future-ready innovators.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
          >
            <Link to="/register" className="btn btn-primary">
              Join Community
              <FiArrowRight size={16} />
            </Link>
            <Link to="/events" className="btn btn-secondary">
              Explore Events
              <FiPlayCircle size={16} />
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
          >
            {['Workshops and seminars', 'Leadership pathways', 'Industry-aligned exposure'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <FiCheckCircle className="text-cyan-500" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          <div className="premium-card relative overflow-hidden p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-4 left-4 h-28 w-28 rounded-full bg-emerald-300/10 blur-3xl" />

            <div className="glassmorphism-sm mb-6 rounded-[24px] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Chapter Pulse</div>
                  <div className="mt-2 text-2xl font-bold">Student innovation ecosystem</div>
                </div>
                <div className="animate-pulse-ring relative rounded-2xl bg-sky-500/10 p-3 text-sky-600 dark:text-sky-300">
                  <FiPlayCircle size={22} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:bg-white/5">
                    <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[24px] bg-slate-950 p-5 text-white shadow-2xl">
                <div className="text-xs uppercase tracking-[0.26em] text-cyan-300">Featured Track</div>
                <div className="mt-3 text-xl font-bold">Education, AI, and leadership blended into real chapter outcomes.</div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                </div>
                <div className="mt-3 text-sm text-slate-300">Semester roadmap aligned with workshops, mentorship, and chapter growth.</div>
              </div>

              <div className="space-y-4">
                <div className="glassmorphism-sm rounded-[24px] p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Leadership</div>
                  <div className="mt-2 text-lg font-bold">Role-based chapter operations</div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Chairman, faculty, core team, and student chairperson workflows in one portal.</div>
                </div>
                <div className="glassmorphism-sm rounded-[24px] p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-300">Community</div>
                  <div className="mt-2 text-lg font-bold">High-engagement student experience</div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">From technical skill-building to achievements, everything is presented as a premium chapter journey.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about-ieee"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        Scroll
        <FiArrowDown size={18} />
      </motion.a>
    </section>
  );
}
