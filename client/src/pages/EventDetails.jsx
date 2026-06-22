import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiCalendar, FiMapPin, FiUsers, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getFallbackEventById } from '../data/fallbackEvents';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setEvent(getFallbackEventById(id));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Event not found</p>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'Date to be announced';

    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Back Button */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <Link to="/events" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
          <FiArrowLeft />
          Back to Events
        </Link>
      </div>

      {/* Hero Image */}
      {event.poster && (
        <div className="w-full h-96 bg-gradient-to-br from-blue-600 to-cyan-500 overflow-hidden">
          <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full capitalize">
                  {event.category}
                </span>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full capitalize">
                  {event.status}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{event.title}</h1>
            </div>

            {/* Meta Information */}
            <div className="grid sm:grid-cols-3 gap-6 mb-12 glassmorphism p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-blue-600 text-2xl" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Date & Time</div>
                  <div className="font-semibold">{formatDate(event.date)}</div>
                  {event.time && <div className="text-sm text-gray-600 dark:text-gray-400">{event.time}</div>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="text-cyan-600 text-2xl" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Venue</div>
                  <div className="font-semibold">{event.venue || 'Online'}</div>
                  {event.location && <div className="text-sm text-gray-600 dark:text-gray-400">{event.location}</div>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiUsers className="text-purple-600 text-2xl" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Registrations</div>
                  <div className="font-semibold">{event.registrations || 0}</div>
                  {event.capacity && <div className="text-sm text-gray-600 dark:text-gray-400">/ {event.capacity}</div>}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12 glassmorphism p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {event.winners && event.winners.length > 0 && (
              <div className="mb-12 glassmorphism p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">Top 3 Winners</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {event.winners.map((winner) => (
                    <div key={winner.position} className="rounded-xl bg-white/5 p-5 border border-white/10">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">
                        <span className="text-xl" aria-hidden="true">{winner.symbol || '🏆'}</span>
                        <span>{winner.position}</span>
                      </div>
                      <div className="mt-3 text-lg font-bold">{winner.teamName}</div>
                      {winner.prizeMoney && (
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          Prize Money: <span className="font-semibold">{winner.prizeMoney}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Speakers</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker, i) => (
                    <motion.div
                      key={i}
                      className="glassmorphism p-6 rounded-xl"
                      whileHover={{ y: -5 }}
                    >
                      {speaker.photo && (
                        <img src={speaker.photo} alt={speaker.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                      )}
                      <h3 className="text-lg font-bold">{speaker.name}</h3>
                      <p className="text-blue-600 font-semibold mb-2">{speaker.designation}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{speaker.bio}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-4">
              {event.registrationLink && (
                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Register Now
                </a>
              )}
              <button className="btn btn-outline">Share Event</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
