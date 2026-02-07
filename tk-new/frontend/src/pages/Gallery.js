import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Lightbox from '../components/Lightbox';
import { API } from '../context/AuthContext';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setImages(response.data);
      const uniqueCategories = ['all', ...new Set(response.data.map(img => img.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

  const handleNext = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 px-4 md:px-8" data-testid="gallery-page">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 font-heading" data-testid="gallery-page-title">
              Gallery
            </h1>
            <p className="text-white/60 text-lg" data-testid="gallery-page-subtitle">A visual journey through our lens</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-16" data-testid="gallery-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                data-testid={`filter-${category}`}
                className={`px-6 py-2 text-xs tracking-widest uppercase transition-all ${
                  filter === category
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-white/20 text-white hover:border-primary hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="columns-1 md:columns-3 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setLightboxIndex(index)}
                data-testid={`gallery-image-${index}`}
              >
                <img
                  src={image.image_url}
                  alt={image.caption || `Gallery image ${index + 1}`}
                  className="w-full h-auto object-cover group-hover:opacity-80 transition-opacity"
                />
              </motion.div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-20" data-testid="no-images-message">
              <p className="text-white/60">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
