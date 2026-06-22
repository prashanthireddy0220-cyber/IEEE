import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

export default function EventCard({ event, onClick }) {
  const eventDate = event?.date ? new Date(event.date) : null;
  const formatDate = (date) =>
    date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) || 'TBA';

  return (
    <motion.article
      className="premium-card group cursor-pointer overflow-hidden"
      whileHover={{ y: -8 }}
      onClick={onClick}
    >
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-500">
        {event?.poster ? (
          <img
            src={event.poster}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.26),_transparent_35%),linear-gradient(135deg,_#0f3f6f,_#00a4d6)] p-6">
            <div className="max-w-[14rem] rounded-3xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">IEEE Event</div>
              <div className="mt-2 text-lg font-bold">{event?.title || 'Chapter Activity'}</div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
        <div className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {event?.category || 'Session'}
        </div>
        <div className="absolute bottom-5 left-5 rounded-3xl bg-white/12 px-4 py-2 text-white backdrop-blur-md">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-100">Status</div>
          <div className="mt-1 text-sm font-semibold capitalize">{event?.status || 'upcoming'}</div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-sky-600 dark:group-hover:text-sky-300">
              {event?.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{event?.description}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-sky-500" />
            <span>{formatDate(eventDate)}</span>
          </div>
          <div className="flex items-center gap-3">
            <FiClock className="text-cyan-500" />
            <span>{event?.time || 'Schedule to be announced'}</span>
          </div>
          <div className="flex items-center gap-3">
            <FiMapPin className="text-emerald-500" />
            <span>{event?.venue || event?.location || 'Campus venue to be announced'}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-colors duration-300 group-hover:text-cyan-600 dark:text-sky-300">
            View details
            <FiArrowRight size={16} />
          </button>
          {event?.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn btn-primary"
            >
              Register Event
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
