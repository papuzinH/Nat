import React from 'react';
import { Title, SchemaMarkup } from '@/components/shared';
import HeroSection from '@/components/shared/HeroSection';
import ContenidoText from '@/components/tattoo/ContenidoText';
import CTATattooSection from '@/components/tattoo/CTATattooSection';
import TattooGridList from '@/components/tattoo/TattooGridList';
import StudioCTA from '@/components/tattoo/StudioCTA';
import { useDataLoader } from '@/hooks/data-loader';
import heroVideo from '@/assets/hero_video.mov';

const Tattoo: React.FC = () => {
  const { data: tattoos, loading, error } = useDataLoader();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-title text-red-800 mb-4">No se pudo cargar la galería</h2>
          <p className="text-brown-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const collectionSchema = {
    name: 'Portfolio de Tatuajes - Natalia Heller',
    description: 'Galería de trabajos realizados: Line Art, Botánico, Minimalista.',
    url: 'https://tatuajesnaty.com/tattoo',
    numberOfItems: tattoos.length,
    itemListElement: tattoos.map((tattoo, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: tattoo.title,
        image: tattoo.image,
        url: `https://tatuajesnaty.com/tattoo/${tattoo.id}`
      }
    }))
  };

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
  );

  return (
    <div className="min-h-screen">
      <SchemaMarkup type="CollectionPage" data={collectionSchema} />
      <HeroSection video={heroVideo} content={contentHero()} />

      <ContenidoText content={content_first} />

      <StudioCTA />

      <CTATattooSection />

      <TattooGridList tattoos={tattoos} />
    </div>
  );
};

export default Tattoo;
