import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

const Marcadores: React.FC = () => {
  // Datos de ejemplo para las obras con marcadores
  const marcadoresData = [
    { id: 1, title: 'Dibujo Lineal', description: 'Marcadores sobre papel 20x30cm' },
    { id: 2, title: 'Estudio de Forma', description: 'Marcadores sobre papel 25x35cm' },
    { id: 3, title: 'Boceto Expresivo', description: 'Marcadores sobre papel 30x40cm' },
    { id: 4, title: 'Trazo Gestual', description: 'Marcadores sobre papel 15x20cm' },
    { id: 5, title: 'Composición Rápida', description: 'Marcadores sobre papel 35x45cm' },
    { id: 6, title: 'Sketch Urbano', description: 'Marcadores sobre papel 20x30cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <HeaderObras 
        title="Marcadores"
        description="La inmediatez y precisión de los marcadores permite capturar gestos espontáneos y crear obras con trazos seguros y colores vibrantes."
      />
      <GridObras obras={marcadoresData} />
    </div>
  );
};

export default Marcadores;
