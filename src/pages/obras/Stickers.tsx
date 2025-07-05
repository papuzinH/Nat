import React from 'react';
import { Title, Subtitle } from '../../components/shared';

const Stickers: React.FC = () => {
  // Datos de ejemplo para los stickers
  const stickersData = [
    { id: 1, title: 'Serie Botánica', description: 'Sticker impreso en vinilo 5x7cm' },
    { id: 2, title: 'Personajes Cute', description: 'Sticker holográfico 6x6cm' },
    { id: 3, title: 'Frases Motivacionales', description: 'Sticker impreso en papel 8x4cm' },
    { id: 4, title: 'Animales Estilizados', description: 'Sticker transparente 7x5cm' },
    { id: 5, title: 'Elementos Decorativos', description: 'Sticker metálico 4x4cm' },
    { id: 6, title: 'Pack Temático', description: 'Set de 6 stickers variados' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title variant="titlePage" as="h1" className="mb-6">
          Stickers
        </Title>
        <Subtitle variant="large" className="max-w-3xl mx-auto">
          Diseños únicos y divertidos que transforman cualquier superficie en un lienzo 
          para la expresión personal y la creatividad cotidiana.
        </Subtitle>
      </div>

      {/* Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stickersData.map((obra) => (
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

export default Stickers;
