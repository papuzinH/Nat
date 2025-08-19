import React from 'react';
import { Title, Section, Button } from '../components/shared';
import HeroSection from '@/components/shared/HeroSection';
import ContenidoText from '@/components/tattoo/ContenidoText';
import CTATattooSection from '@/components/tattoo/CTATattooSection';
import GallerySection from '@/components/tattoo/GallerySection';
// Import tattoo images
import tat1 from '../assets/tattoo/tat1.jpg';
import tat2 from '../assets/tattoo/tat2.jpg';
import tat3 from '../assets/tattoo/tat3.jpg';
import tat4 from '../assets/tattoo/tat4.jpg';
import heroRoomImage from '../assets/hero_room_image.webp';
import heroVideo from '../assets/hero_video.mov';

const Tattoo: React.FC = () => {
  const tattoos = [
    {
      id: 'tattoo1',
      title: 'Tatuaje Floral',
      image: tat1,
      description: 'Un hermoso tatuaje floral con detalles intrincados.',
    },
    {
      id: 'tattoo2',
      title: 'Tatuaje Geométrico',
      image: tat2,
      description: 'Un tatuaje geométrico moderno y minimalista.',
    },
    {
      id: 'tattoo3',
      title: 'Tatuaje de Animales',
      image: tat3,
      description: 'Un tatuaje realista de un animal salvaje.',
    },
    {
      id: 'tattoo4',
      title: 'Tatuaje de Mandala',
      image: tat4,
      description: 'Un tatuaje mandala con patrones detallados.',
    }
  ];

  const content_first = [
    'Empecé a tatuar en el 2017 en lo que era el cuarto en lo de mis viejxs. Era un espacio bastante pequeño, con menos luz, me acuerdo que siempre nos recibía mi perra con su saludo super emocionada. Quienes me conocen desde entonces saben de lo que hablo.',
    'Al principio me frustraba mucho porque estudiaba al mismo tiempo y para mi era demasiado trabajo. Siempre me encargué de todo sola: las consultas, la agenda de los turnos, el trabajo de diseño, el tatuar todos los días, organizar eventos flash day, mantener el stock de los insumos, crear contenido para redes, etc. Aunque fue cansador, nunca dejé de ponerle todo mi amor. Siempre me sentí muy afortunada de poder dedicarme a esto que me hace tan feliz.',
    'Con los años, se fue volviendo mi trabajo de todos los días y terminé decidiendo dejar la carrera que estaba estudiando para dedicarme full time al tatuaje. Siempre voy a estar orgullosa de haber tomado esa decisión.',
    'Tuve la suerte de poder irme a España a trabajar un tiempito con nuevos colegas y al final, después de haberlo deseado tanto, terminé encontrando un nuevo hogar en donde puedo trabajar mucho más cómoda y también ofrecerles a ustedes una experiencia mucho más completa y profesional.',
    'Aprovecho para agradecer a cada una de las personas que me bancan desde el principio, que me recomiendan, sigo mejorando gracias a ustedes!'
  ];

  const contentHero = () => (
    <>
      <Title as="h1" variant="titlePage" className="mb-4 text-white">
        Tattoo
      </Title>
      <Title as="h2" variant="titleSection" className="font-normal text-white">
        Mi trabajo en el estudio
      </Title>
    </>
  )

  return (
    <div className="min-h-screen">
      <HeroSection video={heroVideo} content={contentHero()} />

      <ContenidoText content={content_first} />

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
          <Button className='mx-auto'>Ver más</Button>
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

      <CTATattooSection />


      <GallerySection tattoos={tattoos} />
    </div>
  );
};

export default Tattoo;
