import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type BlogPost } from './BlogPostCard';

interface FeaturedCarouselProps {
  posts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ posts, onPostClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const nextSlide = () => {
    setSlideDirection('left'); // El contenido se desliza hacia la izquierda (avanzar)
    setCurrentIndex((prev) => (prev + 1) % Math.min(posts.length, 6));
  };

  const prevSlide = () => {
    setSlideDirection('right'); // El contenido se desliza hacia la derecha (retroceder)
    setCurrentIndex((prev) => (prev - 1 + Math.min(posts.length, 6)) % Math.min(posts.length, 6));
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    // Determinar dirección basada en la posición relativa
    setSlideDirection(index > currentIndex ? 'left' : 'right');
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-title text-gray-800">Artículo Destacado</h3>
        <div className="flex gap-2">
          <motion.button
            onClick={prevSlide}
            className="p-2 rounded-full bg-cream-100 text-cream-600 hover:bg-cream-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Anterior"
            disabled={posts.length <= 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="p-2 rounded-full bg-cream-100 text-cream-600 hover:bg-cream-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Siguiente"
            disabled={posts.length <= 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Featured Post Display */}
      {posts.length > 0 && (
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.article 
              key={posts[currentIndex].id}
              custom={slideDirection}
              initial={{ x: slideDirection === 'left' ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: slideDirection === 'left' ? -300 : 300, opacity: 0 }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.4
              }}
              className="bg-white rounded-lg shadow-lg border border-cream-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              onClick={() => onPostClick?.(posts[currentIndex])}
            >
          <div className="flex flex-col lg:flex-row">
            {/* Content Section - Left */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-cream-600 text-sm uppercase tracking-wide bg-cream-100 px-3 py-1 rounded-full font-medium">
                  {posts[currentIndex].category}
                </span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-500 text-sm font-body">{posts[currentIndex].readTime}</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-title text-gray-800 mb-4 group-hover:text-cream-700 transition-colors leading-tight">
                {posts[currentIndex].title}
              </h2>
              
              <p className="text-gray-600 font-body text-lg leading-relaxed mb-6 line-clamp-4">
                {posts[currentIndex].excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-body text-sm">{posts[currentIndex].date}</span>
                <span className="text-cream-600 font-medium group-hover:text-cream-700 transition-colors flex items-center gap-2">
                  Leer artículo completo
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Image Section - Right */}
            <div className="lg:w-1/2">
              <div className="aspect-[4/3] lg:h-full bg-cream-200 overflow-hidden">
                {posts[currentIndex].image ? (
                  <img
                    src={posts[currentIndex].image}
                    alt={posts[currentIndex].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-100 to-cream-200">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-cream-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-cream-600 font-body">Imagen del artículo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.article>
        </AnimatePresence>
        </div>
      )}

      {/* Indicators */}
      {posts.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {posts.slice(0, 6).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-cream-600' : 'bg-cream-200 hover:bg-cream-300'
              }`}
              aria-label={`Ir al artículo ${index + 1}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ scale: index === currentIndex ? 1.2 : 1 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedCarousel;
