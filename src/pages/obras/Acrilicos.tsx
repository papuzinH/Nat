import React from 'react';
import { Title, Subtitle } from '../../components/shared';

const Acrilicos: React.FC = () => {
  // Datos de ejemplo para las obras acrílicas
  const acrilicosData = [
    { id: 1, title: 'Paisaje Nocturno', description: 'Acrílico sobre lienzo 40x50cm' },
    { id: 2, title: 'Retrato Abstracto', description: 'Acrílico sobre tabla 30x40cm' },
    { id: 3, title: 'Naturaleza Muerta', description: 'Acrílico sobre lienzo 35x45cm' },
    { id: 4, title: 'Composición Geométrica', description: 'Acrílico sobre lienzo 50x60cm' },
    { id: 5, title: 'Estudio de Color', description: 'Acrílico sobre papel 25x35cm' },
    { id: 6, title: 'Serie Experimental', description: 'Acrílico sobre lienzo 40x50cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title variant="titlePage" as="h1" className="mb-6">
          Acrílicos
        </Title>
        <Subtitle variant="large" className="max-w-3xl mx-auto">
          Obras realizadas con pintura acrílica, explorando texturas, colores vibrantes 
          y técnicas que permiten capturar la esencia de cada composición.
        </Subtitle>
      </div>

      {/* Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {acrilicosData.map((obra) => (
          <div key={obra.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg bg-cream-100 aspect-square mb-4 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-cream-300 flex items-center justify-center">
                <span className="text-cream-600 font-body text-sm">Imagen {obra.id}</span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            <Title variant="titleCard" as="h3" className="mb-2 group-hover:text-cream-700 transition-colors">
              {obra.title}
            </Title>
            <Subtitle variant="small" as="p" className="text-cream-600">
              {obra.description}
            </Subtitle>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Acrilicos;
