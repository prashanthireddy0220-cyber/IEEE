import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { mergeFallbackEvents } from '../data/fallbackEvents';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, category, status]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      setEvents(mergeFallbackEvents(res.data || []));
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(mergeFallbackEvents());
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (category !== 'all') {
      filtered = filtered.filter(e => e.category === category);
    }

    filtered = filtered.filter(e => e.status === status);
    setFilteredEvents(filtered);
  };

  const categories = ['all', 'workshop', 'seminar', 'hackathon', 'competition', 'meetup'];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-50 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-5xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Events & Activities
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover exciting workshops, seminars, hackathons, and more.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <FiFilter size={20} className="text-blue-600" />
              <span className="font-semibold">Filter By:</span>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['upcoming', 'completed', 'cancelled'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-lg capitalize font-medium transition-all duration-300 ${
                    status === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg capitalize text-sm font-medium transition-all duration-300 ${
                    category === cat
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={() => navigate(`/events/${event._id}`)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg text-gray-600 dark:text-gray-400">No events found. Check back soon!</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
