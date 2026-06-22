import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiGlobe, FiInstagram, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';
import { roleConfig } from '../data/siteContent';

export default function TeamMemberCard({ member }) {
  const displayRoleMap = {
    faculty: 'Faculty',
    chairman: 'Chairperson',
    'student-chairperson': 'Vice Chairperson',
    president: 'President',
    'core-team': 'Core Team',
  };

  const displayRole = displayRoleMap[member?.role] || roleConfig[member?.role]?.label || member?.role || 'Team Member';
  const primaryContactLinks = [
    { icon: FiPhone, url: member?.phone ? `tel:${member.phone}` : '', label: 'Phone' },
    { icon: FiLinkedin, url: member?.socialMedia?.linkedin, label: 'LinkedIn' },
    { icon: FiInstagram, url: member?.socialMedia?.instagram, label: 'Instagram' },
    { icon: FiMail, url: member?.email ? `mailto:${member.email}` : '', label: 'Email' }
  ];
  const socialLinks = [
    { icon: FiGithub, url: member?.socialMedia?.github, label: 'GitHub' },
    { icon: FiGlobe, url: member?.socialMedia?.portfolio, label: 'Portfolio' }
  ].filter((item) => item.url);

  return (
    <motion.article className="premium-card group overflow-hidden" whileHover={{ y: -8 }}>
      <div className="overflow-hidden rounded-[22px] border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/20 transition-transform duration-300 group-hover:-translate-y-2 sm:rounded-[28px]">
        {member?.photo ? (
          <div className="relative h-52 overflow-hidden bg-slate-900 sm:h-72">
            <img
              src={member.photo}
              alt={member.name}
              className="h-full w-full object-contain object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-3 left-3 max-w-[78%] rounded-[16px] bg-slate-950/70 px-3 py-2 backdrop-blur-md sm:bottom-5 sm:left-5 sm:max-w-none sm:rounded-[24px] sm:px-4 sm:py-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300 sm:text-xs sm:tracking-[0.2em]">{displayRole}</div>
                <div className="mt-1 text-xs font-bold text-white sm:text-lg">{member?.department || 'IEEE Chapter'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex h-52 items-end overflow-hidden rounded-[22px] bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-500 sm:h-72 sm:rounded-[28px]">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent" />
            <div className="relative p-4 sm:p-6">
              <div className="rounded-[20px] bg-white/12 p-4 text-white backdrop-blur-md sm:rounded-[28px] sm:p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">IEEE Leadership</div>
                <div className="mt-2 text-lg font-bold sm:text-xl">{member?.name}</div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-white sm:text-2xl">{member?.name}</h3>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300 sm:text-sm">{displayRole}</p>
            <p className="text-xs text-slate-400 sm:text-sm">{member?.year ? `${member.year} Year` : member?.department || 'Core Team'}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            {primaryContactLinks.map((link) => {
              const isMissing = !link.url;

              if (isMissing) {
                return (
                  <span
                    key={`${member?._id || member?.name}-${link.label}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-slate-700 bg-slate-900/60 text-slate-600 sm:h-11 sm:w-11"
                    aria-label={`${link.label} placeholder`}
                    title={`${link.label} can be added later`}
                  >
                    <link.icon size={16} />
                  </span>
                );
              }

              return (
                <a
                  key={`${member?._id || member?.name}-${link.label}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-all duration-300 hover:bg-sky-500/20 hover:text-sky-300 sm:h-11 sm:w-11"
                  aria-label={link.label}
                >
                  <link.icon size={16} />
                </a>
              );
            })}

            {socialLinks.map((link) => (
              <a
                key={`${member?._id || member?.name}-${link.label}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-all duration-300 hover:bg-sky-500/20 hover:text-sky-300 sm:h-11 sm:w-11"
                aria-label={link.label}
              >
                <link.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
