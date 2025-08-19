import React from 'react';
import ImageGallery, { type GalleryImage } from './ImageGallery';

interface ObraData {
  id: number;
  title: string;
  description: string;
  image?: string;
}

interface GridObrasProps {
  obras: ObraData[];
}

const GridObras: React.FC<GridObrasProps> = ({ obras }) => {
  // Convertir las obras al formato requerido por ImageGallery
  const galleryImages: GalleryImage[] = obras.map(obra => ({
    id: obra.id,
    src: obra.image || '',
    alt: obra.title,
    title: obra.title,
    description: obra.description
  }));

  return (
    <ImageGallery
      images={galleryImages}
      cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}
      aspectRatio="square"
      showOverlay={true}
    />
  );
};

export default GridObras;
