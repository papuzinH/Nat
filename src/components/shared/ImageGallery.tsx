import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export interface GalleryImage {
  id: string | number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  showOverlay?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  aspectRatio = 'square',
  showOverlay = true
}) => {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setOpen(true);
  };

  const getGridCols = () => {
    const classes = [];
    classes.push(`grid-cols-${cols.default}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    return classes.join(' ');
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'landscape':
        return 'aspect-[4/3]';
      case 'auto':
        return 'aspect-auto';
      default:
        return 'aspect-square';
    }
  };

  // Convertir imágenes al formato requerido por yet-another-react-lightbox
  const lightboxImages = images.map(image => ({
    src: image.src,
    alt: image.alt,
    title: image.title,
    description: image.description
  }));

  return (
    <>
      <section className={className || `grid ${getGridCols()} gap-0`}>
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="group cursor-pointer overflow-hidden"
            onClick={() => openLightbox(index)}
          >
            <div className={`relative ${className ? '' : 'bg-cream-100'} ${className ? '' : getAspectRatioClass()} ${className ? '' : 'hover:shadow-2xl'} transition-all duration-500`}>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay con información - aparece solo en hover si está habilitado */}
              {showOverlay && (image.title || image.description) && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 px-4">
                    {image.title && (
                      <h3 className="text-white mb-2 text-xl font-semibold font-heading">
                        {image.title}
                      </h3>
                    )}
                    {image.description && (
                      <p className="text-white/90 text-sm font-body">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={photoIndex}
        slides={lightboxImages}
        styles={{
          container: { 
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)'
          },
          navigationPrev: { 
            color: '#f5f5f4',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          },
          navigationNext: { 
            color: '#f5f5f4',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          },
          toolbar: {
            backgroundColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          },
          button: {
            color: '#f5f5f4'
          }
        }}
        animation={{
          fade: 300,
          swipe: 500
        }}
        carousel={{
          finite: true,
          preload: 2
        }}
        controller={{
          closeOnBackdropClick: true,
          closeOnPullDown: true,
          closeOnPullUp: true
        }}
        render={{
          iconClose: () => (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          iconPrev: () => (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ),
          iconNext: () => (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )
        }}
      />
    </>
  );
};

export default ImageGallery;
