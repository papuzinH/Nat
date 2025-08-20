import React, { useState } from 'react';
import { Title, Section, Button } from '@/components/shared';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
// Import studio images
import heroRoomImage from '../../assets/hero_room_image.webp';
import sobremi1 from '../../assets/sobremi_1.webp';
import sobremi2 from '../../assets/sobremi_2.webp';
import sobremi3 from '../../assets/sobremi_3.webp';
import natProfile from '../../assets/nat_profile.webp';

const StudioCTA: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Imágenes del estudio para la galería
  const studioImages = [
    {
      src: heroRoomImage,
      alt: 'Vista general del estudio de tatuajes',
      title: 'Estudio de Tatuajes',
      description: 'Un espacio profesional y acogedor para crear arte en la piel'
    },
    {
      src: sobremi1,
      alt: 'Natalia trabajando en el estudio',
      title: 'Proceso Creativo',
      description: 'Natalia en pleno proceso de diseño y creación'
    },
    {
      src: sobremi2,
      alt: 'Detalles del espacio de trabajo',
      title: 'Espacio de Trabajo',
      description: 'Cada detalle pensado para ofrecer la mejor experiencia'
    },
    {
      src: sobremi3,
      alt: 'Ambiente del estudio',
      title: 'Ambiente Relajado',
      description: 'Un lugar donde el arte y la comodidad se encuentran'
    },
    {
      src: natProfile,
      alt: 'Natalia en su estudio',
      title: 'La Artista',
      description: 'Natalia Heller en su espacio creativo'
    }
  ];

  const handleOpenGallery = () => {
    setOpen(true);
  };

  return (
    <>
      <div
        className='relative bg-cover bg-center bg-no-repeat my-16 py-32'
        style={{ backgroundImage: `url(${heroRoomImage})` }}
      >
        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
          <svg
            className="absolute top-0 w-full h-full z-30 rotate-180 scale-x-[-1]"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 60 C 600 180 600 -60 1200 60 L 1200 120 L 0 120 Z"
              fill="#fdfcfb"
            />
          </svg>
        </div>
        <Section className='relative z-20 py-32 flex flex-col items-center justify-center text-center gap-8'>
          <Title as="h2" variant="titleSection" className="font-normal text-white text-center">
            Conocé el estudio
          </Title>
          <Button 
            className='mx-auto'
            onClick={handleOpenGallery}
          >
            Ver galería
          </Button>
        </Section>
        <div className='absolute inset-0 backdrop-blur-sm bg-black/30 z-10'></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-full z-30"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 60 C 600 180 600 -60 1200 60 L 1200 120 L 0 120 Z"
              fill="#fdfcfb"
            />
          </svg>
        </div>
      </div>

      {/* Lightbox para la galería del estudio */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={studioImages}
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

export default StudioCTA;
