import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    filterAchievements();
  }, [achievements, category]);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get('/api/achievements');
      setAchievements(res.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAchievements = () => {
    if (category === 'all') {
      setFilteredAchievements(achievements);
    } else {
      setFilteredAchievements(achievements.filter(a => a.category === category));
    }
  };

  const categories = ['all', 'award', 'competition', 'recognition', 'milestone'];

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
            Our Achievements
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Celebrating our milestones and recognizing excellence in innovation and education.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg capitalize font-medium transition-all duration-300 ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAchievements.length > 0 ? (
            <div className="space-y-8">
              {filteredAchievements.map((achievement, idx) => (
                <motion.div
                  key={achievement._id}
                  className="glassmorphism p-8 rounded-2xl border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 8 }}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {achievement.image && (
                      <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{achievement.title}</h3>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold rounded-full capitalize">
                          {achievement.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{achievement.description}</p>
                      {achievement.honorees && achievement.honorees.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {achievement.honorees.map((name, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">No achievements found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
