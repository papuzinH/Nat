import React from 'react';
import { Title, Subtitle, Button } from '../components/shared';

const Obras: React.FC = () => {
  // Datos de los tipos de obras
  const tiposObras = [
    {
      id: 'acrilicos',
      title: 'Acrílicos',
      description: 'Obras realizadas con pintura acrílica, explorando texturas y colores vibrantes.',
      route: '/obras/acrilicos'
    },
    {
      id: 'acuarelas',
      title: 'Acuarelas',
      description: 'La delicadeza y transparencia de la acuarela en composiciones únicas.',
      route: '/obras/acuarelas'
    },
    {
      id: 'flores-prensadas',
      title: 'Flores Prensadas',
      description: 'Técnica ancestral que conserva la belleza natural en composiciones artísticas.',
      route: '/obras/flores-prensadas'
    },
    {
      id: 'gouache',
      title: 'Gouache',
      description: 'Opacidad y versatilidad en obras con colores intensos y acabados únicos.',
      route: '/obras/gouache'
    },
    {
      id: 'ilustraciones',
      title: 'Ilustraciones',
      description: 'Creaciones que narran historias y desarrollan mundos imaginarios.',
      route: '/obras/ilustraciones'
    },
    {
      id: 'tecnicas-mixtas',
      title: 'Técnicas Mixtas',
      description: 'Combinación de materiales y técnicas para crear obras innovadoras.',
      route: '/obras/tecnicas-mixtas'
    },
    {
      id: 'marcadores',
      title: 'Marcadores',
      description: 'Inmediatez y precisión en trazos seguros y colores vibrantes.',
      route: '/obras/marcadores'
    },
    {
      id: 'ceramicas',
      title: 'Cerámicas',
      description: 'Tradición artesanal fusionada con expresión contemporánea.',
      route: '/obras/ceramicas'
    },
    {
      id: 'stickers',
      title: 'Stickers',
      description: 'Diseños únicos y divertidos para la expresión personal cotidiana.',
      route: '/obras/stickers'
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title variant="titlePage" as="h1" className="mb-6">
          Mis Obras
        </Title>
        <Subtitle variant="large" className="max-w-3xl mx-auto">
          Cada obra es una expresión única de creatividad y técnica. 
          Explora mi colección de trabajos artísticos organizados por categorías.
        </Subtitle>
      </div>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tiposObras.map((tipo) => (
          <div key={tipo.id} className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Image Container */}
            <div className="relative h-64 bg-gradient-to-br from-cream-200 to-cream-300 flex items-center justify-center">
              <span className="text-cream-600 font-body text-sm">Imagen {tipo.title}</span>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              {/* Button - aparece solo en hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="medium"
                  as="link"
                  to={tipo.route}
                  className="bg-white/90 border-white text-cream-800 hover:bg-white hover:text-cream-900 shadow-lg"
                >
                  Ver Obras
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <Title variant="titleCard" as="h3" className="mb-3 group-hover:text-cream-700 transition-colors">
                {tipo.title}
              </Title>
              <Subtitle variant="small" as="p" className="text-cream-600 leading-relaxed">
                {tipo.description}
              </Subtitle>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Obras;
