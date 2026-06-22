import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export default function GalleryManager() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    albumName: '',
    category: 'general',
    description: ''
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await axios.get('/api/gallery');
      setGalleries(res.data);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/gallery', formData);
      setGalleries([res.data, ...galleries]);
      setFormData({ albumName: '', category: 'general', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating gallery:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this gallery?')) {
      try {
        await axios.delete(`/api/gallery/${id}`);
        setGalleries(galleries.filter(g => g._id !== id));
      } catch (error) {
        console.error('Error deleting gallery:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gallery Manager</h2>
          <p className="text-gray-600 dark:text-gray-400">Upload and manage photo albums</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus />
          New Album
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          className="glassmorphism p-8 rounded-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-6">Create New Album</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Album Name"
              value={formData.albumName}
              onChange={(e) => setFormData({ ...formData, albumName: e.target.value })}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
            >
              <option value="general">General</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="meetup">Meetup</option>
            </select>
            <textarea
              placeholder="Album Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none resize-none"
            />
            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary">Create Album</button>
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

      {/* Galleries List */}
      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-center py-8 col-span-full">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : galleries.length > 0 ? (
          galleries.map((gallery, idx) => (
            <motion.div
              key={gallery._id}
              className="glassmorphism p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{gallery.albumName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{gallery.category}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-all">
                    <FiEdit2 className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(gallery._id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{gallery.description}</p>
              <div className="text-sm text-blue-600 font-semibold">{gallery.images?.length || 0} images</div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 col-span-full text-gray-600 dark:text-gray-400">
            No galleries yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
