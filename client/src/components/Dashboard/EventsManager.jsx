import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function EventsManager() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'workshop',
    registrationLink: ''
  });

  const canManageEvents = ['chairman', 'core-team', 'student-chairperson'].includes(user?.role);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/events', formData);
      setEvents([res.data, ...events]);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: 'workshop',
        registrationLink: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/api/events/${id}`);
        setEvents(events.filter((event) => event._id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Events Manager</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {canManageEvents ? 'Create and manage events' : 'Browse chapter events and stay updated'}
          </p>
        </div>
        {canManageEvents && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus />
            New Event
          </button>
        )}
      </div>

      {canManageEvents && showForm && (
        <motion.div
          className="glassmorphism rounded-2xl p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="mb-6 text-xl font-bold">Create New Event</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 focus:border-blue-600 focus:outline-none"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="rounded-lg border border-white/10 bg-slate-900/80 px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
              >
                <option value="workshop" className="bg-slate-900 text-white">Workshop</option>
                <option value="seminar" className="bg-slate-900 text-white">Seminar</option>
                <option value="hackathon" className="bg-slate-900 text-white">Hackathon</option>
                <option value="competition" className="bg-slate-900 text-white">Competition</option>
                <option value="meetup" className="bg-slate-900 text-white">Meetup</option>
              </select>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 focus:border-blue-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 focus:border-blue-600 focus:outline-none"
              />
              <input
                type="url"
                placeholder="Registration Link"
                value={formData.registrationLink}
                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 focus:border-blue-600 focus:outline-none md:col-span-2"
              />
            </div>
            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2 focus:border-blue-600 focus:outline-none"
            />
            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary">Create Event</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length > 0 ? (
          events.map((event, idx) => (
            <motion.div
              key={event._id}
              className="glassmorphism flex items-start justify-between rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-bold">{event.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span>{`Date: ${new Date(event.date).toLocaleDateString()}`}</span>
                  <span>{`Venue: ${event.venue || 'Online'}`}</span>
                  <span className="capitalize">{`Category: ${event.category}`}</span>
                </div>
                {!canManageEvents && (
                  <div className="mt-4">
                    {event.registrationLink ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary inline-flex"
                      >
                        Register Event
                      </a>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Registration link will be available soon.
                      </div>
                    )}
                  </div>
                )}
              </div>
              {canManageEvents && (
                <div className="flex gap-2">
                  <button className="rounded-lg p-2 transition-all hover:bg-blue-500/20">
                    <FiEdit2 className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="rounded-lg p-2 transition-all hover:bg-red-500/20"
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-600 dark:text-gray-400">
            {canManageEvents ? 'No events yet. Create one to get started!' : 'No events have been published yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
