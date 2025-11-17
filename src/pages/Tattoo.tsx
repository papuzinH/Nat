import React from 'react';
import { Title } from '@/components/shared';
import HeroSection from '@/components/shared/HeroSection';
import ContenidoText from '@/components/tattoo/ContenidoText';
import CTATattooSection from '@/components/tattoo/CTATattooSection';
import TattooGridList from '@/components/tattoo/TattooGridList';
import StudioCTA from '@/components/tattoo/StudioCTA';
import { tattoos } from '@/assets/tattoo/mock-data';
import heroVideo from '@/assets/hero_video.mov';

const Tattoo: React.FC = () => {
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
      <HeroSection video={heroVideo} content={contentHero()} />

      <ContenidoText content={content_first} />

      <StudioCTA />

      <CTATattooSection />

      <TattooGridList tattoos={tattoos} />
    </div>
  );
};

export default Tattoo;
