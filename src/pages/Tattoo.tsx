import React from 'react';
import { Title, Section, Button, Subtitle } from '../components/shared';

const Tattoo: React.FC = () => {
  const tattoos = [
    {
      id: 'tattoo1',
      title: 'Tatuaje Floral',
      image: 'src/assets/tat1.jpg',
      description: 'Un hermoso tatuaje floral con detalles intrincados.',
    },
    {
      id: 'tattoo2',
      title: 'Tatuaje Geométrico',
      image: 'src/assets/tat2.jpg',
      description: 'Un tatuaje geométrico moderno y minimalista.',
    },
  ];

  return (
    <div className="container mx-auto py-16">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="src/assets/hero_video.mov" type="video/webm" />
          Tu navegador no soporta el elemento de video.
        </video>

        {/* Background Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/0"></div>

        {/* Content over video */}
        <div className="relative z-10 text-center text-white">
          <Title as="h1" variant="titlePage" className="mb-4 text-white">
            Tattoo
          </Title>
          <Title as="h2" variant="titleSection" className="font-normal text-white">
            Mi trabajo en el estudio
          </Title>
        </div>
      </section>

      <Section>
        <p className='text-lg mb-4'>
          Empecé a tatuar en el 2017 en lo que era el cuarto en lo de mis viejxs. Era un espacio bastante pequeño, con menos luz, me acuerdo que siempre nos recibía mi perra con su saludo super emocionada. Quienes me conocen desde entonces saben de lo que hablo.
        </p>
        <p className='text-lg'>
          Al principio me frustraba mucho porque estudiaba al mismo tiempo y para mi era demasiado trabajo. Siempre me encargué de todo sola: las consultas, la agenda de los turnos, el trabajo de diseño, el tatuar todos los días, organizar eventos flash day, mantener el stock de los insumos, crear contenido para redes, etc. <span className='font-bold'>Aunque fue cansador, nunca dejé de ponerle todo mi amor. Siempre me sentí muy afortunada de poder dedicarme a esto que me hace tan feliz.</span>
        </p>
      </Section>

      <div className='relative bg-[url("src/assets/hero_room_image.webp")] bg-cover bg-center bg-no-repeat py-16'>
        <Section className='relative z-20 py-32 flex flex-col items-center justify-center text-center gap-8'>
          <Title as="h2" variant="titleSection" className="font-normal text-white text-center">
            Conocé el estudio
          </Title>
          <Button className='mx-auto'>Ver más</Button>
        </Section>
        <div className='absolute inset-0 backdrop-blur-sm bg-black/30 z-10'></div>
      </div>

      <Section>
        <p className='text-lg mb-4'>
          Con los años, se fue volviendo mi trabajo de todos los días y terminé decidiendo dejar la carrera que estaba estudiando para dedicarme full time al tatuaje. <span className='font-bold'>Siempre voy a estar orgullosa de haber tomado esa decisión.</span>
        </p>
        <p className='text-lg mb-4'>
          Tuve la suerte de poder irme a España a trabajar un tiempito con nuevos colegas y al final, después de haberlo deseado tanto, terminé encontrando un <span className='font-bold'>nuevo hogar</span> en donde puedo trabajar mucho más cómoda y también ofrecerles a ustedes una <span className='font-bold'>experiencia mucho más completa y profesional.</span>
        </p>
        <p className='text-lg'>Aprovecho para agradecer a cada una de las personas que me bancan desde el principio, que me recomiendan, <span className='font-bold'>sigo mejorando gracias a ustedes!</span></p>
      </Section>

      <Section className="text-center bg-gradient-to-br from-cream-200 to-green-200 rounded-2xl my-16">
        <Title as="h2" variant="titleSection" className="mb-6">
          ¿Tenés una idea en mente?
        </Title>
        <Subtitle className="mb-8 max-w-2xl mx-auto text-gray-700">
          Trabajemos juntos para crear el diseño perfecto que refleje tu personalidad.
          Cada tatuaje es único y está pensado especialmente para vos.
        </Subtitle>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
            Quiero un tatuaje
          </Button>

        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:animate-bounce"></div>
            <span className="text-sm font-medium text-gray-700">Consultás sin compromiso</span>
          </div>
          <div className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animation-delay-150">
            <div className="w-2 h-2 bg-cream-600 rounded-full animate-pulse group-hover:animate-bounce"></div>
            <span className="text-sm font-medium text-gray-700">Diseños personalizados</span>
          </div>
          <div className="group flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animation-delay-300">
            <div className="w-2 h-2 bg-brown-600 rounded-full animate-pulse group-hover:animate-bounce"></div>
            <span className="text-sm font-medium text-gray-700">Ambiente profesional</span>
          </div>
        </div>
      </Section>

      <section>
        <div className='max-w-6xl mx-auto text-center mb-16'>
          <Title className='mb-8'>
            Galería
          </Title>
          <Subtitle className='max-w-4xl mx-auto'>
            Me especializo en trabajos de Linea Fina, Ornamental y Botánico. También hago trabajos de estilo Ilustrativo, con algún detalle a color o trabajos en Black and Grey.
          </Subtitle>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-0 auto-rows-[400px]'>
          {
            tattoos.map(tattoo => (
              <div key={tattoo.id} className="overflow-hidden">
                <img src={tattoo.image} alt={tattoo.title} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
              </div>
            ))}


        </div>
      </section>
    </div>
  );
};

export default Tattoo;
