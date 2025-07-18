import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

const Acrilicos: React.FC = () => {
  // Datos de ejemplo para las obras acrílicas
  const acrilicosData = [
    { id: 1, title: 'Paisaje Nocturno', description: 'Acrílico sobre lienzo 40x50cm', image: '/src/assets/obras/acrilico1.jpg' },
    { id: 2, title: 'Retrato Abstracto', description: 'Acrílico sobre tabla 30x40cm', image: '/src/assets/obras/acrilico2.jpg' },
    { id: 3, title: 'Naturaleza Muerta', description: 'Acrílico sobre lienzo 35x45cm', image: '/src/assets/obras/acrilico3.jpg' },
    { id: 4, title: 'Composición Geométrica', description: 'Acrílico sobre lienzo 50x60cm', image: '/src/assets/obras/acrilico.jpg' },
    { id: 5, title: 'Estudio de Color', description: 'Acrílico sobre papel 25x35cm', image: '/src/assets/obras/acuarela.jpg' },
    { id: 6, title: 'Serie Experimental', description: 'Acrílico sobre lienzo 40x50cm', image: '/src/assets/obras/hero-acrilico.webp' },
    { id: 7, title: 'Bosque Encantado', description: 'Acrílico sobre lienzo 45x55cm', image: '/src/assets/obras/acrilico1.jpg' },
    { id: 8, title: 'Reflejos Urbanos', description: 'Acrílico sobre tabla 35x45cm', image: '/src/assets/obras/acrilico2.jpg' },
    { id: 9, title: 'Texturas Marinas', description: 'Acrílico sobre lienzo 40x50cm', image: '/src/assets/obras/acrilico3.jpg' },
    { id: 10, title: 'Sombras y Luz', description: 'Acrílico sobre papel 30x40cm', image: '/src/assets/obras/acrilico.jpg' },
    { id: 11, title: 'Expresión Libre', description: 'Acrílico sobre lienzo 50x70cm', image: '/src/assets/obras/acuarela.jpg' },
    { id: 12, title: 'Melodía Visual', description: 'Acrílico sobre tabla 40x50cm', image: '/src/assets/obras/hero-acrilico.webp' },
  ];

  return (
    <div className="">
      <HeaderObras 
        title="Acrílicos"
        description="Obras realizadas con pintura acrílica, explorando texturas, colores vibrantes y técnicas que permiten capturar la esencia de cada composición."
        imagebg="/src/assets/obras/hero-acrilico.webp"
      />
      <GridObras obras={acrilicosData} />
    </div>
  );
};

export default Acrilicos;
