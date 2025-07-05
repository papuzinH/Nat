import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

const Gouache: React.FC = () => {
  // Datos de ejemplo para las obras gouache
  const gouacheData = [
    { id: 1, title: 'Estudio Cromático', description: 'Gouache sobre papel 25x35cm' },
    { id: 2, title: 'Paisaje Onírico', description: 'Gouache sobre papel 30x40cm' },
    { id: 3, title: 'Retrato Expresivo', description: 'Gouache sobre papel 20x30cm' },
    { id: 4, title: 'Composición Abstracta', description: 'Gouache sobre papel 35x45cm' },
    { id: 5, title: 'Naturaleza Viva', description: 'Gouache sobre papel 25x35cm' },
    { id: 6, title: 'Juego de Luces', description: 'Gouache sobre papel 30x40cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <HeaderObras 
        title="Gouache"
        description="La opacidad y versatilidad del gouache permite crear obras con colores intensos y acabados únicos, combinando la fluidez de la acuarela con la cobertura del acrílico."
      />
      <GridObras obras={gouacheData} />
    </div>
  );
};

export default Gouache;
