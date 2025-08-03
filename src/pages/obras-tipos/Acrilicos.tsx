import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';
// Import images
import acrilico1 from '../../assets/obras/acrilico1.jpg';
import acrilico2 from '../../assets/obras/acrilico2.jpg';
import acrilico3 from '../../assets/obras/acrilico3.jpg';
import acrilico from '../../assets/obras/acrilico.jpg';
import acuarela from '../../assets/obras/acuarela.jpg';
import heroAcrilico from '../../assets/obras/hero-acrilico.webp';

const Acrilicos: React.FC = () => {
  // Datos de ejemplo para las obras acrílicas
  const acrilicosData = [
    { id: 1, title: 'Paisaje Nocturno', description: 'Acrílico sobre lienzo 40x50cm', image: acrilico1 },
    { id: 2, title: 'Retrato Abstracto', description: 'Acrílico sobre tabla 30x40cm', image: acrilico2 },
    { id: 3, title: 'Naturaleza Muerta', description: 'Acrílico sobre lienzo 35x45cm', image: acrilico3 },
    { id: 4, title: 'Composición Geométrica', description: 'Acrílico sobre lienzo 50x60cm', image: acrilico },
    { id: 5, title: 'Estudio de Color', description: 'Acrílico sobre papel 25x35cm', image: acuarela },
    { id: 6, title: 'Serie Experimental', description: 'Acrílico sobre lienzo 40x50cm', image: heroAcrilico },
    { id: 7, title: 'Bosque Encantado', description: 'Acrílico sobre lienzo 45x55cm', image: acrilico1 },
    { id: 8, title: 'Reflejos Urbanos', description: 'Acrílico sobre tabla 35x45cm', image: acrilico2 },
    { id: 9, title: 'Texturas Marinas', description: 'Acrílico sobre lienzo 40x50cm', image: acrilico3 },
    { id: 10, title: 'Sombras y Luz', description: 'Acrílico sobre papel 30x40cm', image: acrilico },
    { id: 11, title: 'Expresión Libre', description: 'Acrílico sobre lienzo 50x70cm', image: acuarela },
    { id: 12, title: 'Melodía Visual', description: 'Acrílico sobre tabla 40x50cm', image: heroAcrilico },
  ];

  return (
    <div className="">
      <HeaderObras 
        title="Acrílicos"
        description="Obras realizadas con pintura acrílica, explorando texturas, colores vibrantes y técnicas que permiten capturar la esencia de cada composición."
        imagebg={heroAcrilico}
      />
      <GridObras obras={acrilicosData} />
    </div>
  );
};

export default Acrilicos;
