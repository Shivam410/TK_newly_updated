import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  if (currentIndex === null) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onClick={onClose}
        data-testid="lightbox"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-white hover:text-primary transition-colors z-10"
          data-testid="lightbox-close"
        >
          <X size={32} />
        </button>

        <div className="relative w-full h-full flex items-center justify-center p-8" onClick={(e) => e.stopPropagation()}>
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            src={currentImage.image_url}
            alt={currentImage.caption || `Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            data-testid="lightbox-image"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors text-4xl"
                data-testid="lightbox-prev"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors text-4xl"
                data-testid="lightbox-next"
              >
                ›
              </button>
            </>
          )}
        </div>

        {currentImage.caption && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-sm" data-testid="lightbox-caption">
            {currentImage.caption}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
