import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

const Acrilicos: React.FC = () => {
  // Datos de ejemplo para las obras acrílicas
  const acrilicosData = [
    { id: 1, title: 'Paisaje Nocturno', description: 'Acrílico sobre lienzo 40x50cm' },
    { id: 2, title: 'Retrato Abstracto', description: 'Acrílico sobre tabla 30x40cm' },
    { id: 3, title: 'Naturaleza Muerta', description: 'Acrílico sobre lienzo 35x45cm' },
    { id: 4, title: 'Composición Geométrica', description: 'Acrílico sobre lienzo 50x60cm' },
    { id: 5, title: 'Estudio de Color', description: 'Acrílico sobre papel 25x35cm' },
    { id: 6, title: 'Serie Experimental', description: 'Acrílico sobre lienzo 40x50cm' },
    { id: 7, title: 'Bosque Encantado', description: 'Acrílico sobre lienzo 45x55cm' },
    { id: 8, title: 'Reflejos Urbanos', description: 'Acrílico sobre tabla 35x45cm' },
    { id: 9, title: 'Texturas Marinas', description: 'Acrílico sobre lienzo 40x50cm' },
    { id: 10, title: 'Sombras y Luz', description: 'Acrílico sobre papel 30x40cm' },
    { id: 11, title: 'Expresión Libre', description: 'Acrílico sobre lienzo 50x70cm' },
    { id: 12, title: 'Melodía Visual', description: 'Acrílico sobre tabla 40x50cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <HeaderObras 
        title="Acrílicos"
        description="Obras realizadas con pintura acrílica, explorando texturas, colores vibrantes y técnicas que permiten capturar la esencia de cada composición."
      />
      <GridObras obras={acrilicosData} />
    </div>
  );
};

export default Acrilicos;
