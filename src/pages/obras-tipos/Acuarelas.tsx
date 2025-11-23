import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';
import CategoryNavigation from '../../components/obras/CategoryNavigation';
import { tiposObras } from '../../data/obras';
// Import placeholder image
import heroAcrilico from '../../assets/obras/hero-acrilico.webp';

const Acuarelas: React.FC = () => {
  // Datos de ejemplo para las obras de acuarela
  const acuarelasData = [
    { id: 1, title: 'Jardín Primaveral', description: 'Acuarela sobre papel 30x40cm', image: heroAcrilico },
    { id: 2, title: 'Retrato Femenino', description: 'Acuarela sobre papel 25x35cm', image: heroAcrilico },
    { id: 3, title: 'Paisaje Marino', description: 'Acuarela sobre papel 40x50cm', image: heroAcrilico },
    { id: 4, title: 'Estudio Botánico', description: 'Acuarela sobre papel 20x30cm', image: heroAcrilico },
    { id: 5, title: 'Atmósfera Urbana', description: 'Acuarela sobre papel 35x45cm', image: heroAcrilico },
    { id: 6, title: 'Composición Floral', description: 'Acuarela sobre papel 30x40cm', image: heroAcrilico },
    { id: 7, title: 'Amanecer en el Campo', description: 'Acuarela sobre papel 35x45cm', image: heroAcrilico },
    { id: 8, title: 'Transparencias', description: 'Acuarela sobre papel 25x35cm', image: heroAcrilico },
    { id: 9, title: 'Cielo Tormentoso', description: 'Acuarela sobre papel 40x50cm', image: heroAcrilico },
    { id: 10, title: 'Delicadeza Floral', description: 'Acuarela sobre papel 20x30cm', image: heroAcrilico },
    { id: 11, title: 'Fluir del Agua', description: 'Acuarela sobre papel 30x40cm', image: heroAcrilico },
    { id: 12, title: 'Serenidad', description: 'Acuarela sobre papel 25x35cm', image: heroAcrilico },
  ];

  return (
    <div>
      <HeaderObras 
        title="Acuarelas"
        description="La delicadeza y transparencia de la acuarela permite crear obras llenas de sutileza y expresión, jugando con la fluidez del agua y los pigmentos."
      />
      <GridObras obras={acuarelasData} />
      <CategoryNavigation tiposObras={tiposObras} currentRoute="/obras/acuarelas" />
    </div>
  );
};

export default Acuarelas;
