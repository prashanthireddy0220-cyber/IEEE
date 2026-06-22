import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiAward, FiCalendar, FiImage, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { roleConfig } from '../../data/siteContent';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    galleries: 0,
    achievements: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, eventsRes, galleriesRes, achievementsRes] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/events'),
          axios.get('/api/gallery'),
          axios.get('/api/achievements')
        ]);

        setStats({
          users: usersRes.data.length,
          events: eventsRes.data.length,
          galleries: galleriesRes.data.length,
          achievements: achievementsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const currentRole = roleConfig[user?.role] || roleConfig.student;
  const statCards = [
    { icon: FiUsers, label: 'Members', value: stats.users, accent: 'from-sky-700 to-cyan-500' },
    { icon: FiCalendar, label: 'Events', value: stats.events, accent: 'from-cyan-600 to-emerald-400' },
    { icon: FiImage, label: 'Albums', value: stats.galleries, accent: 'from-emerald-500 to-sky-500' },
    { icon: FiAward, label: 'Achievements', value: stats.achievements, accent: 'from-sky-700 to-emerald-500' }
  ];

  return (
    <div className="space-y-8">
      <div className="premium-card p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="eyebrow">Dashboard Overview</span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Chapter command center for {currentRole.label}.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Manage the public website, review chapter assets, and keep content aligned with IEEE Education Society quality and governance.
            </p>
          </div>

          <div className="w-full max-w-sm rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Role Focus</div>
            <div className="mt-3 break-words text-xl font-bold">{currentRole.badge}</div>
            <div className="mt-2 max-w-xs text-sm text-slate-300">{currentRole.permissions[0]}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            className="premium-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}>
              <card.icon size={22} />
            </div>
            <div className="mt-5 text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{card.label}</div>
            <div className="mt-2 text-4xl font-bold">{loading ? '-' : card.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="premium-card p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-600 dark:text-sky-300">
              <FiTrendingUp size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">Operational Highlights</div>
              <div className="text-2xl font-bold">What this role can drive</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {currentRole.permissions.map((permission) => (
              <div key={permission} className="glassmorphism-sm rounded-[24px] p-5">
                <div className="text-sm leading-7 text-slate-600 dark:text-slate-300">{permission}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-card p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Quick Start</div>
          <h2 className="mt-3 text-2xl font-bold">Recommended next actions</h2>
          <div className="mt-6 grid gap-4">
            {[
              'Review upcoming event listings and registration links.',
              'Upload event galleries with clean categorization.',
              'Refresh faculty and core team member profiles.',
              'Publish notable chapter achievements and reports.'
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-slate-200/70 bg-white/70 p-5 text-sm leading-7 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
