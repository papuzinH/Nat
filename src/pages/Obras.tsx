import React from 'react';
import { Title, Subtitle, SchemaMarkup } from '../components/shared';
import HeroSection from '@/components/shared/HeroSection';
import ObrasGrid from '@/components/obras/ObrasGrid';
import obrasHero from '../assets/obras_hero.MOV';
import { tiposObras } from '@/data/obras';

const Obras: React.FC = () => {
  const collectionSchema = {
    name: 'Obras de Arte - Natalia Heller',
    description: 'Colección de obras artísticas: Acuarelas, Acrílicos, Cerámicas y más.',
    url: 'https://tatuajesnaty.com/obras',
    numberOfItems: tiposObras.length,
    itemListElement: tiposObras.map((tipo, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Collection',
        name: tipo.title,
        description: tipo.description,
        url: `https://tatuajesnaty.com${tipo.route}`
      }
    }))
  };

  const contentHero = () => (
    <>
      <Title variant="titlePage" as="h1" className="mb-6 text-white">
        Mis Obras
      </Title>
      <Subtitle variant="large" className="max-w-3xl mx-auto text-white">
        Cada obra es una expresión única de creatividad y técnica.
        Explora mi colección de trabajos artísticos organizados por categorías.
      </Subtitle>
    </>

  )


  return (
    <div className="min-h-screen">
      <SchemaMarkup type="CollectionPage" data={collectionSchema} />
      {/* Hero Section */}
      <HeroSection video={obrasHero} content={contentHero()} />

      {/* Title Section */}

      {/* Cards Grid */}
      <ObrasGrid tiposObras={tiposObras} />
    </div>
  );
};

export default Obras;
