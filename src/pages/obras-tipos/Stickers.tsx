import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <HeaderObras 
        title="Stickers"
        description="Diseños únicos y divertidos que transforman cualquier superficie en un lienzo para la expresión personal y la creatividad cotidiana."
      />
      <GridObras obras={stickersData} />
    </div>
  );
};

export default Stickers;
