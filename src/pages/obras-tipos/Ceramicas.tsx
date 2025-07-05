import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';

const Ceramicas: React.FC = () => {
  // Datos de ejemplo para las obras de cerámica
  const ceramicasData = [
    { id: 1, title: 'Vasija Artesanal', description: 'Cerámica esmaltada 15x20cm' },
    { id: 2, title: 'Plato Decorativo', description: 'Cerámica pintada a mano 25cm diámetro' },
    { id: 3, title: 'Escultura Pequeña', description: 'Cerámica cocida 20x15x10cm' },
    { id: 4, title: 'Taza Única', description: 'Cerámica esmaltada 12x10cm' },
    { id: 5, title: 'Bowl Artístico', description: 'Cerámica texturizada 18x8cm' },
    { id: 6, title: 'Pieza Experimental', description: 'Cerámica raku 25x30cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <HeaderObras 
        title="Cerámicas"
        description="El trabajo en cerámica combina la tradición artesanal con la expresión contemporánea, creando piezas únicas que fusionan funcionalidad y arte."
      />
      <GridObras obras={ceramicasData} />
    </div>
  );
};

export default Ceramicas;
