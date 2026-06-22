import React from 'react';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCode,
  FiCompass,
  FiGlobe,
  FiLayers,
  FiUsers
} from 'react-icons/fi';

export default function BenefitsSection() {
  const benefits = [
    { icon: FiUsers, title: 'Networking Opportunities', description: 'Build lasting relationships with peers, alumni, faculty, and professional IEEE members.' },
    { icon: FiBookOpen, title: 'Workshops & Technical Sessions', description: 'Learn through curated sessions, expert talks, and hands-on educational experiences.' },
    { icon: FiAward, title: 'Certifications', description: 'Strengthen your profile with recognized credentials and documented chapter participation.' },
    { icon: FiCode, title: 'Hackathons & Competitions', description: 'Test your ideas under pressure, collaborate, and earn recognition through innovation challenges.' },
    { icon: FiLayers, title: 'Technical Skill Development', description: 'Gain practical experience across emerging tools, software, systems, and project execution.' },
    { icon: FiCompass, title: 'Leadership Opportunities', description: 'Lead teams, manage chapter initiatives, and grow through structured responsibility.' },
    { icon: FiGlobe, title: 'Industry Exposure', description: 'Connect academic learning to current technology trends, speaker sessions, and professional practice.' },
    { icon: FiBriefcase, title: 'Career Growth', description: 'Translate chapter work into internships, interviews, and a stronger professional portfolio.' }
  ];

  return (
    <section className="section-shell py-24">
      <div className="section-frame">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <span className="eyebrow">Why Join IEEE</span>
          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">A chapter designed for ambitious students who want more than just attendance.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Every activity is structured to deliver technical growth, collaboration, visibility, and leadership in a professional IEEE environment.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="premium-card p-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              viewport={{ once: true }}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 text-white shadow-lg">
                <benefit.icon size={24} />
              </div>
              <h3 className="text-xl font-bold">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
