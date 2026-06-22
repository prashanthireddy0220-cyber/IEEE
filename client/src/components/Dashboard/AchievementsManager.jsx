import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'award'
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get('/api/achievements');
      setAchievements(res.data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/achievements', formData);
      setAchievements([res.data, ...achievements]);
      setFormData({ title: '', description: '', category: 'award' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating achievement:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      try {
        await axios.delete(`/api/achievements/${id}`);
        setAchievements(achievements.filter(a => a._id !== id));
      } catch (error) {
        console.error('Error deleting achievement:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Achievements Manager</h2>
          <p className="text-gray-600 dark:text-gray-400">Record and manage achievements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus />
          New Achievement
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          className="glassmorphism p-8 rounded-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold mb-6">Add New Achievement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Achievement Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none"
            >
              <option value="award">Award</option>
              <option value="competition">Competition Win</option>
              <option value="recognition">Recognition</option>
              <option value="milestone">Milestone</option>
            </select>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-600 focus:outline-none resize-none"
            />
            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary">Create Achievement</button>
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

      {/* Achievements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : achievements.length > 0 ? (
          achievements.map((achievement, idx) => (
            <motion.div
              key={achievement._id}
              className="glassmorphism p-6 rounded-xl flex justify-between items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{achievement.description}</p>
                <span className="text-xs bg-blue-500/20 text-blue-600 px-3 py-1 rounded-full capitalize">
                  {achievement.category}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-all">
                  <FiEdit2 className="text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(achievement._id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <FiTrash2 className="text-red-600" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No achievements yet. Add one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
