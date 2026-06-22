import React from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import brandLogo from '../assets/ieee-educational-society-logo.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: FiLinkedin, href: 'https://www.linkedin.com/in/ieee-education-society-kare-97b490381/', label: 'LinkedIn' },
    { icon: FiInstagram, href: 'https://www.instagram.com/kare_ieee_eds_official/', label: 'Instagram' },
    { icon: FiMail, href: 'mailto:ieee-eds-sbc@college.edu', label: 'Email' }
  ];

  return (
    <footer className="section-shell pb-6 pt-16">
      <div className="section-frame">
        <motion.div
          className="premium-card overflow-hidden px-6 py-10 sm:px-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.85fr_0.9fr]">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={brandLogo}
                  alt="IEEE Education Society"
                  className="h-14 w-auto"
                />
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">IEEE Education Society</div>
                  <div className="text-lg font-bold">Student Branch Chapter</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
                A premium chapter experience focused on innovation, education, technology leadership, and student development through IEEE-powered opportunities.
              </p>
            </div>

            <div>
              <div className="text-lg font-bold">Contact</div>
              <div className="mt-5 grid gap-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <FiMail className="mt-1 text-sky-500" />
                  <span>ieee-eds-sbc@college.edu</span>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="mt-1 text-cyan-500" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="mt-1 text-emerald-500" />
                  <span>Kalasalingam University, Krishnankoil</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-lg font-bold">Connect</div>
              <div className="mt-5 flex gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={item.label}
                    className="rounded-full border border-slate-200 bg-white/70 p-3 text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-sky-300"
                  >
                    <item.icon size={16} />
                  </a>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Follow chapter announcements, technical updates, event recaps, and member achievements across our social channels.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-200/70 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {currentYear} IEEE Education Society Student Branch Chapter. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
