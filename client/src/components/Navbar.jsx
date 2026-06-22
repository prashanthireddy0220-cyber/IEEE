import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogIn, FiLogOut, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { roleConfig } from '../data/siteContent';
import brandLogo from '../assets/ieee-educational-society-logo.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Events', path: '/events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Core Team', path: '/team' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'Contact', path: '/contact' }
  ];

  const shellClass = isScrolled || isOpen
    ? 'glassmorphism border border-white/40 shadow-[0_18px_50px_rgba(15,23,42,0.08)]'
    : 'border border-transparent bg-transparent';

  return (
    <motion.nav
      className="fixed inset-x-0 top-0 z-[90] px-4 pt-4 sm:px-6 lg:px-8"
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className={`mx-auto max-w-7xl overflow-hidden transition-all duration-300 ${isOpen ? 'rounded-[32px]' : 'rounded-full'} ${shellClass}`}>
        <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src={brandLogo}
              alt="IEEE Education Society"
              className="h-10 w-auto sm:h-14"
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-full border border-white/20 p-3 transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                <Link to="/dashboard" className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition-all duration-300 hover:-translate-y-0.5 dark:bg-white/5 dark:text-slate-100">
                  {roleConfig[user.role]?.label || 'Dashboard'}
                </Link>
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
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link to="/login" className="btn btn-outline">
                  <FiLogIn size={16} />
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Join Community
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen((current) => !current)}
              className="rounded-full border border-white/20 p-3 transition-all duration-300 hover:bg-white/50 dark:hover:bg-white/5 lg:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <motion.div
            className="space-y-3 border-t border-white/10 bg-slate-950/65 px-4 pb-5 pt-4 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="grid gap-3 pt-2">
                <Link to="/dashboard" className="btn btn-secondary w-full">
                  {roleConfig[user.role]?.label || 'Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="btn btn-outline w-full"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid gap-3 pt-2">
                <Link to="/login" className="btn btn-outline w-full">
                  <FiLogIn size={16} />
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary w-full">
                  Join Community
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
