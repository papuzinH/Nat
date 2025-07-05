import React from 'react';
import { Title, Subtitle } from '../../components/shared';

const Ceramicas: React.FC = () => {
  // Datos de ejemplo para las obras de cerámica
  const ceramicasData = [
    { id: 1, title: 'Vasija Artesanal', description: 'Cerámica esmaltada 15x20cm' },
    { id: 2, title: 'Plato Decorativo', description: 'Cerámica pintada a mano 25cm diámetro' },
    { id: 3, title: 'Escultura Pequeña', description: 'Cerámica cocida 20x15x10cm' },
    { id: 4, title: 'Taza Única', description: 'Cerámica esmaltada 12x10cm' },
    { id: 5, title: 'Bowl Artístico', description: 'Cerámica texturizada 18x8cm' },
    { id: 6, title: 'Pieza Experimental', description: 'Cerámica raku 25x30cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title variant="titlePage" as="h1" className="mb-6">
          Cerámicas
        </Title>
        <Subtitle variant="large" className="max-w-3xl mx-auto">
          El trabajo en cerámica combina la tradición artesanal con la expresión contemporánea, 
          creando piezas únicas que fusionan funcionalidad y arte.
        </Subtitle>
      </div>

      {/* Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ceramicasData.map((obra) => (
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

export default Ceramicas;
