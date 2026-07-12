import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const hyperLaunchModules = import.meta.glob('../assets/gallery/hyper-launch-*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

const eduthonModules = import.meta.glob('../assets/gallery/eduthon-*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

const coreTeamModules = import.meta.glob('../assets/gallery/core-team-2025-2026-*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});

const createEventImages = (modules, album, category) =>
  Object.entries(modules)
    .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
    .map(([, url], index) => ({
      url,
      caption: `${album} ${index + 1}`,
      album,
      category
    }));

const hyperLaunchImages = createEventImages(hyperLaunchModules, 'Hyper Launch Event', 'hyper launch');
const eduthonImages = createEventImages(eduthonModules, 'Eduthon Event', 'eduthon');
const coreTeamImages = createEventImages(coreTeamModules, 'Core Team 2025 to 2026', 'core team 2025 to 2026');
const localEventImages = [...hyperLaunchImages, ...eduthonImages, ...coreTeamImages];
const isCoreTeamGalleryImage = (image) => image.category === 'core team 2025 to 2026';

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
      setGalleries(res.data || []);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const apiImages = useMemo(
    () =>
      galleries.flatMap((gallery) =>
        (gallery.images || []).map((image) => ({
          ...image,
          album: gallery.albumName,
          category: gallery.category,
          caption: image.caption || gallery.albumName
        }))
      ),
    [galleries]
  );

  const allImages = useMemo(() => [...localEventImages, ...apiImages], [apiImages]);
  const filteredImages = selectedCategory === 'all'
    ? allImages
    : allImages.filter((image) => image.category === selectedCategory);
  const carouselImages = filteredImages.length > 0 ? filteredImages : localEventImages;
  const duplicatedImages = carouselImages.length > 1 ? [...carouselImages, ...carouselImages] : carouselImages;
  const categories = ['all', ...new Set(allImages.map((image) => image.category).filter(Boolean))];
  const showCarousel = selectedCategory !== 'core team 2025 to 2026';
  const isCoreTeamCategory = selectedCategory === 'core team 2025 to 2026';

  return (
    <div className="min-h-screen pt-20">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Gallery</span>
            <h1 className="text-4xl font-bold sm:text-6xl">
              Chapter Event Moments
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Event photos, chapter memories, and uploaded gallery albums in one smooth showcase.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                    : 'border border-white/10 bg-white/10 text-slate-700 hover:bg-white/20 dark:text-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {showCarousel && (
        <section className="px-0 py-10">
          <div className="relative overflow-hidden bg-slate-950 py-10 shadow-2xl shadow-slate-950/30 sm:py-14">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-slate-950 to-transparent sm:w-40" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-slate-950 to-transparent sm:w-40" />

            {loading && allImages.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              </div>
            ) : (
              <div className="gallery-marquee overflow-hidden">
                <div className="marquee-track flex w-max gap-4 px-4 sm:gap-6">
                  {duplicatedImages.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className="group relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl bg-transparent text-left shadow-xl shadow-black/30 sm:h-64 sm:w-96 lg:h-72 lg:w-[28rem]"
                    >
                      <img
                        src={image.url}
                        alt={image.caption}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className={`${isCoreTeamGalleryImage(image) ? 'hidden' : 'absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95'}`} />
                      <div className={`${isCoreTeamGalleryImage(image) ? 'hidden' : 'absolute inset-x-0 bottom-0 p-4 text-white'}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">{image.album}</p>
                        <p className="mt-2 text-lg font-bold">{image.caption}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">Album</span>
              <h2 className="text-3xl font-bold sm:text-4xl">Event Photos</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>

          <div className={`${isCoreTeamCategory ? 'mx-auto grid max-w-6xl grid-cols-1 gap-8' : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredImages.map((image, index) => (
              <motion.button
                key={`${image.url}-grid-${index}`}
                type="button"
                className={`group relative overflow-hidden rounded-2xl bg-transparent shadow-xl shadow-slate-950/15 ${isCoreTeamGalleryImage(image) ? 'aspect-[16/9] sm:rounded-3xl' : 'aspect-[4/3]'}`}
                onClick={() => setSelectedImage(image)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.24) }}
                viewport={{ once: true }}
              >
                <img
                  src={image.url}
                  alt={image.caption}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className={`${isCoreTeamGalleryImage(image) ? 'hidden' : 'absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'}`} />
                <div className={`${isCoreTeamGalleryImage(image) ? 'hidden' : 'absolute inset-x-0 bottom-0 translate-y-4 p-4 text-left text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{image.album}</p>
                  <p className="mt-1 font-bold">{image.caption}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.94, y: 18 }}
            animate={{ scale: 1, y: 0 }}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.caption}
              className="max-h-[82vh] w-full rounded-3xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center">
              <p className="font-semibold text-white">{selectedImage.caption}</p>
              <p className="text-sm text-slate-400">{selectedImage.album}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
