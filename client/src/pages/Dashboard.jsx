import React, { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiAward,
  FiCalendar,
  FiCheckSquare,
  FiHome,
  FiImage,
  FiLogOut,
  FiMenu,
  FiUsers,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { roleConfig } from '../data/siteContent';
import DashboardHome from '../components/Dashboard/DashboardHome';
import EventsManager from '../components/Dashboard/EventsManager';
import GalleryManager from '../components/Dashboard/GalleryManager';
import TeamManager from '../components/Dashboard/TeamManager';
import AchievementsManager from '../components/Dashboard/AchievementsManager';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const currentRole = roleConfig[user?.role] || roleConfig.student;

  const menuItems = useMemo(
    () => [
      { icon: FiHome, label: 'Overview', path: '/dashboard' },
      { icon: FiCalendar, label: 'Events', path: '/dashboard/events' },
      { icon: FiImage, label: 'Gallery', path: '/dashboard/gallery' },
      { icon: FiUsers, label: 'Team', path: '/dashboard/team' },
      { icon: FiAward, label: 'Achievements', path: '/dashboard/achievements' }
    ],
    []
  );

  if (!user) return null;

  return (
    <div className="section-shell min-h-screen pt-24 sm:pt-28">
      <div className="section-frame pb-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="btn btn-outline">
            <FiMenu size={16} />
            Menu
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="btn btn-outline"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
          <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed bottom-2 left-0 top-[92px] z-[70] w-full max-w-[calc(100vw-1rem)] bg-slate-950/30 p-2 backdrop-blur-sm transition-transform duration-300 sm:top-[96px] sm:max-w-[320px] sm:p-4 lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:bg-transparent lg:p-0`}>
            <div className="glassmorphism flex h-full max-h-[calc(100vh-100px)] flex-col overflow-y-auto rounded-[28px] p-4 sm:max-h-[calc(100vh-112px)] sm:rounded-[32px] sm:p-6 lg:max-h-none">
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <div className="text-lg font-bold">Dashboard</div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-full p-2 hover:bg-white/10">
                  <FiX size={18} />
                </button>
              </div>

              <div className="rounded-[28px] bg-slate-950 p-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Signed In As</div>
                <div className="mt-3 break-words text-lg font-bold sm:text-xl">{user.name || 'IEEE Member'}</div>
                <div className="mt-1 break-words text-sm text-slate-300">{currentRole.label}</div>
                <div className="mt-4 inline-flex max-w-full rounded-full bg-white/10 px-3 py-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                  {currentRole.badge}
                </div>
              </div>

              <nav className="mt-6 grid gap-2">
                {menuItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        active
                          ? 'bg-sky-600 text-white shadow-lg'
                          : 'hover:bg-white/50 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <item.icon size={16} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <FiArrowRight size={14} />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 rounded-[28px] border border-slate-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <FiCheckSquare className="text-sky-500" size={18} />
                  <div className="font-bold">Your Access</div>
                </div>
                <div className="mt-4 grid gap-3">
                  {currentRole.permissions.slice(0, 4).map((permission) => (
                    <div key={permission} className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {permission}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn btn-outline mt-auto hidden w-full lg:flex"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </aside>

          <motion.main
            className="min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="events" element={<EventsManager />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="team" element={<TeamManager />} />
              <Route path="achievements" element={<AchievementsManager />} />
            </Routes>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
