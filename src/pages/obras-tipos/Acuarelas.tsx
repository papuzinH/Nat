import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

const Acuarelas: React.FC = () => {
  // Datos de ejemplo para las obras de acuarela
  const acuarelasData = [
    { id: 1, title: 'Jardín Primaveral', description: 'Acuarela sobre papel 30x40cm' },
    { id: 2, title: 'Retrato Femenino', description: 'Acuarela sobre papel 25x35cm' },
    { id: 3, title: 'Paisaje Marino', description: 'Acuarela sobre papel 40x50cm' },
    { id: 4, title: 'Estudio Botánico', description: 'Acuarela sobre papel 20x30cm' },
    { id: 5, title: 'Atmósfera Urbana', description: 'Acuarela sobre papel 35x45cm' },
    { id: 6, title: 'Composición Floral', description: 'Acuarela sobre papel 30x40cm' },
    { id: 7, title: 'Amanecer en el Campo', description: 'Acuarela sobre papel 35x45cm' },
    { id: 8, title: 'Transparencias', description: 'Acuarela sobre papel 25x35cm' },
    { id: 9, title: 'Cielo Tormentoso', description: 'Acuarela sobre papel 40x50cm' },
    { id: 10, title: 'Delicadeza Floral', description: 'Acuarela sobre papel 20x30cm' },
    { id: 11, title: 'Fluir del Agua', description: 'Acuarela sobre papel 30x40cm' },
    { id: 12, title: 'Serenidad', description: 'Acuarela sobre papel 25x35cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <HeaderObras 
        title="Acuarelas"
        description="La delicadeza y transparencia de la acuarela permite crear obras llenas de sutileza y expresión, jugando con la fluidez del agua y los pigmentos."
      />
      <GridObras obras={acuarelasData} />
    </div>
  );
};

export default Acuarelas;
