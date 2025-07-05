import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

const TecnicasMixtas: React.FC = () => {
  // Datos de ejemplo para las obras de técnicas mixtas
  const tecnicasData = [
    { id: 1, title: 'Collage Experimental', description: 'Técnica mixta sobre lienzo 40x50cm' },
    { id: 2, title: 'Textura y Color', description: 'Técnica mixta sobre papel 30x40cm' },
    { id: 3, title: 'Composición Híbrida', description: 'Técnica mixta sobre tabla 35x45cm' },
    { id: 4, title: 'Exploración Material', description: 'Técnica mixta sobre lienzo 50x60cm' },
    { id: 5, title: 'Fusión Artística', description: 'Técnica mixta sobre papel 25x35cm' },
    { id: 6, title: 'Innovación Creativa', description: 'Técnica mixta sobre lienzo 40x50cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <HeaderObras 
        title="Técnicas Mixtas"
        description="La combinación de diferentes materiales y técnicas permite crear obras únicas que exploran nuevas posibilidades expresivas y texturas innovadoras."
      />
      <GridObras obras={tecnicasData} />
    </div>
  );
};

export default TecnicasMixtas;
