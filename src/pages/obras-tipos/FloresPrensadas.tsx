import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';
// Import placeholder image
import heroAcrilico from '../../assets/obras/hero-acrilico.webp';

const FloresPrensadas: React.FC = () => {
  // Datos de ejemplo para las obras de flores prensadas
  const floresData = [
    { id: 1, title: 'Herbario Romántico', description: 'Flores prensadas sobre papel 20x30cm', image: heroAcrilico },
    { id: 2, title: 'Composición Silvestre', description: 'Flores prensadas sobre papel 25x35cm', image: heroAcrilico },
    { id: 3, title: 'Jardín Eterno', description: 'Flores prensadas sobre papel 30x40cm', image: heroAcrilico },
    { id: 4, title: 'Memoria Botánica', description: 'Flores prensadas sobre papel 15x20cm', image: heroAcrilico },
    { id: 5, title: 'Estaciones del Año', description: 'Flores prensadas sobre papel 35x45cm', image: heroAcrilico },
    { id: 6, title: 'Naturaleza Preservada', description: 'Flores prensadas sobre papel 20x30cm', image: heroAcrilico },
  ];

  return (
    <div>
      <HeaderObras 
        title="Flores Prensadas"
        description="Una técnica ancestral que conserva la belleza natural de las flores, creando composiciones únicas que capturan la esencia de cada estación."
      />
      <GridObras obras={floresData} />
    </div>
  );
};

export default FloresPrensadas;
