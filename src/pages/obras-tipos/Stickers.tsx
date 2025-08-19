import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';
// Import placeholder image
import heroAcrilico from '../../assets/obras/hero-acrilico.webp';

const Stickers: React.FC = () => {
  // Datos de ejemplo para los stickers
  const stickersData = [
    { id: 1, title: 'Serie Botánica', description: 'Sticker impreso en vinilo 5x7cm', image: heroAcrilico },
    { id: 2, title: 'Personajes Cute', description: 'Sticker holográfico 6x6cm', image: heroAcrilico },
    { id: 3, title: 'Frases Motivacionales', description: 'Sticker impreso en papel 8x4cm', image: heroAcrilico },
    { id: 4, title: 'Animales Estilizados', description: 'Sticker transparente 7x5cm', image: heroAcrilico },
    { id: 5, title: 'Elementos Decorativos', description: 'Sticker metálico 4x4cm', image: heroAcrilico },
    { id: 6, title: 'Pack Temático', description: 'Set de 6 stickers variados', image: heroAcrilico },
  ];

  return (
    <div>
      <HeaderObras 
        title="Stickers"
        description="Diseños únicos y divertidos que transforman cualquier superficie en un lienzo para la expresión personal y la creatividad cotidiana."
      />
      <GridObras obras={stickersData} />
    </div>
  );
};

export default Stickers;
