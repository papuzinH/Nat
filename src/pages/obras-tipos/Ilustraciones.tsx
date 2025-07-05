import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

const Ilustraciones: React.FC = () => {
  // Datos de ejemplo para las ilustraciones
  const ilustracionesData = [
    { id: 1, title: 'Personaje Fantástico', description: 'Ilustración digital sobre papel 20x30cm' },
    { id: 2, title: 'Escena Narrativa', description: 'Ilustración mixta sobre papel 25x35cm' },
    { id: 3, title: 'Retrato Ilustrado', description: 'Ilustración tradicional sobre papel 30x40cm' },
    { id: 4, title: 'Mundo Imaginario', description: 'Ilustración digital sobre papel 35x45cm' },
    { id: 5, title: 'Concepto Artístico', description: 'Ilustración mixta sobre papel 25x35cm' },
    { id: 6, title: 'Historia Visual', description: 'Ilustración tradicional sobre papel 30x40cm' },
    { id: 7, title: 'Criatura Mágica', description: 'Ilustración digital sobre papel 20x30cm' },
    { id: 8, title: 'Aventura Épica', description: 'Ilustración mixta sobre papel 40x50cm' },
    { id: 9, title: 'Universo Paralelo', description: 'Ilustración digital sobre papel 35x45cm' },
    { id: 10, title: 'Sueño Ilustrado', description: 'Ilustración tradicional sobre papel 30x40cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <HeaderObras 
        title="Ilustraciones"
        description="Creaciones que narran historias, desarrollan personajes y exploran mundos imaginarios a través de técnicas tradicionales y digitales."
      />
      <GridObras obras={ilustracionesData} />
    </div>
  );
};

export default Ilustraciones;
