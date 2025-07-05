import React from 'react';
import { Title, Subtitle } from '../../components/shared';

const Gouache: React.FC = () => {
  // Datos de ejemplo para las obras gouache
  const gouacheData = [
    { id: 1, title: 'Estudio Cromático', description: 'Gouache sobre papel 25x35cm' },
    { id: 2, title: 'Paisaje Onírico', description: 'Gouache sobre papel 30x40cm' },
    { id: 3, title: 'Retrato Expresivo', description: 'Gouache sobre papel 20x30cm' },
    { id: 4, title: 'Composición Abstracta', description: 'Gouache sobre papel 35x45cm' },
    { id: 5, title: 'Naturaleza Viva', description: 'Gouache sobre papel 25x35cm' },
    { id: 6, title: 'Juego de Luces', description: 'Gouache sobre papel 30x40cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title variant="titlePage" as="h1" className="mb-6">
          Gouache
        </Title>
        <Subtitle variant="large" className="max-w-3xl mx-auto">
          La opacidad y versatilidad del gouache permite crear obras con colores intensos 
          y acabados únicos, combinando la fluidez de la acuarela con la cobertura del acrílico.
        </Subtitle>
      </div>

      {/* Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {gouacheData.map((obra) => (
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

export default Gouache;
