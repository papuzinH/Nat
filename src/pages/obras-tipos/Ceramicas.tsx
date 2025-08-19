import React from 'react';
import { HeaderObras, GridObras } from '../../components/shared';
// Import placeholder image
import heroAcrilico from '../../assets/obras/hero-acrilico.webp';

const Ceramicas: React.FC = () => {
  // Datos de ejemplo para las obras de cerámica
  const ceramicasData = [
    { id: 1, title: 'Vasija Artesanal', description: 'Cerámica esmaltada 15x20cm', image: heroAcrilico },
    { id: 2, title: 'Plato Decorativo', description: 'Cerámica pintada a mano 25cm diámetro', image: heroAcrilico },
    { id: 3, title: 'Escultura Pequeña', description: 'Cerámica cocida 20x15x10cm', image: heroAcrilico },
    { id: 4, title: 'Taza Única', description: 'Cerámica esmaltada 12x10cm', image: heroAcrilico },
    { id: 5, title: 'Bowl Artístico', description: 'Cerámica texturizada 18x8cm', image: heroAcrilico },
    { id: 6, title: 'Pieza Experimental', description: 'Cerámica raku 25x30cm', image: heroAcrilico },
  ];

  return (
    <div >
      <HeaderObras 
        title="Cerámicas"
        description="El trabajo en cerámica combina la tradición artesanal con la expresión contemporánea, creando piezas únicas que fusionan funcionalidad y arte."
      />
      <GridObras obras={ceramicasData} />
    </div>
  );
};

export default Ceramicas;
