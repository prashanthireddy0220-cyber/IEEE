import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const allImages = galleries.flatMap(g =>
    g.images.map(img => ({ ...img, album: g.albumName, category: g.category }))
  );

  const filteredImages = selectedCategory === 'all'
    ? allImages
    : allImages.filter(img => img.category === selectedCategory);

  const categories = ['all', ...new Set(galleries.map(g => g.category))];

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
            Photo Gallery
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Relive the moments from our amazing events and activities.
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
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg capitalize font-medium transition-all duration-300 ${
                  selectedCategory === cat
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

      {/* Gallery Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl cursor-pointer bg-gradient-to-br from-blue-600 to-cyan-500 aspect-square"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-4">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-semibold text-sm">{img.caption}</p>
                      <p className="text-xs text-gray-300">{img.album}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">No images found</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <img src={selectedImage.url} alt={selectedImage.caption} className="w-full h-auto rounded-lg" />
            <div className="mt-4 text-center">
              <p className="text-white font-semibold">{selectedImage.caption}</p>
              <p className="text-gray-400 text-sm">{selectedImage.album}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
