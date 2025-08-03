import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';
// Import placeholder image
import heroAcrilico from '../../assets/obras/hero-acrilico.webp';

const TecnicasMixtas: React.FC = () => {
  // Datos de ejemplo para las obras de técnicas mixtas
  const tecnicasData = [
    { id: 1, title: 'Collage Experimental', description: 'Técnica mixta sobre lienzo 40x50cm', image: heroAcrilico },
    { id: 2, title: 'Textura y Color', description: 'Técnica mixta sobre papel 30x40cm', image: heroAcrilico },
    { id: 3, title: 'Composición Híbrida', description: 'Técnica mixta sobre tabla 35x45cm', image: heroAcrilico },
    { id: 4, title: 'Exploración Material', description: 'Técnica mixta sobre lienzo 50x60cm', image: heroAcrilico },
    { id: 5, title: 'Fusión Artística', description: 'Técnica mixta sobre papel 25x35cm', image: heroAcrilico },
    { id: 6, title: 'Innovación Creativa', description: 'Técnica mixta sobre lienzo 40x50cm', image: heroAcrilico },
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
