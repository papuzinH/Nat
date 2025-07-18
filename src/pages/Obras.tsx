import React from 'react';
import { Title, Subtitle } from '../components/shared';
import HeroSection from '@/components/shared/HeroSection';
import ObrasGrid from '@/components/obras/ObrasGrid';

const Obras: React.FC = () => {
  // Datos de los tipos de obras
  const tiposObras = [
    {
      id: 'acrilicos',
      title: 'Acrílicos',
      image: 'src/assets/obras/acrilico.jpg',
      description: 'Pinturas hechas con acrílico sobre papel o sobre bastidores de tela.',
      route: '/obras/acrilicos'
    },
    {
      id: 'acuarelas',
      title: 'Acuarelas',
      image: 'src/assets/obras/acuarela.jpg',
      description: 'Sobre papel 100% algodón de alto gramaje, con grano fino o grueso.',
      route: '/obras/acuarelas'
    },
    {
      id: 'flores-prensadas',
      title: 'Flores Prensadas',
      image: 'src/assets/obras_acrilicos.webp',
      description: 'Plantas recolectadas, prensadas y enmarcadas.',
      route: '/obras/flores-prensadas'
    },
    {
      id: 'gouache',
      title: 'Gouache',
      image: 'src/assets/obras_acrilicos.webp',
      description: 'Pinturas hechas con HIMI GOUACHE sobre papel de alto gramaje.',
      route: '/obras/gouache'
    },
    {
      id: 'ilustraciones',
      title: 'Ilustraciones',
      image: 'src/assets/obras_acrilicos.webp',
      description: 'Dibujos hechos con estilógrafos en distintos tamaños de punta fina.',
      route: '/obras/ilustraciones'
    },
    {
      id: 'tecnicas-mixtas',
      title: 'Técnicas Mixtas',
      image: 'src/assets/obras_acrilicos.webp',
      description: 'Obras que combinan distintos medios en una misma superficie.',
      route: '/obras/tecnicas-mixtas'
    },
    {
      id: 'marcadores',
      title: 'Marcadores',
      image: 'src/assets/obras_acrilicos.webp',
      description: 'Pinturas hechas con marcadores de colores en formato pequeño.',
      route: '/obras/marcadores'
    },
    {
      id: 'ceramicas',
      title: 'Cerámicas',
      image: 'src/assets/obras_acrilicos.webp',
      description: 'Piezas únicas hechas con arcilla y técnicas varias de esmaltado.',
      route: '/obras/ceramicas'
    },
    {
      id: 'stickers',
      title: 'Stickers',
      image: 'src/assets/obras_acrilicos.webp',
      description: 'Para que puedas tener un pedacito de NAT en cualquier objeto.',
      route: '/obras/stickers'
    }
  ];

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
    <div className="mx-auto">
      {/* Hero Section */}
      <HeroSection video="src/assets/obras_hero.MOV" content={contentHero()} />

      {/* Title Section */}

      {/* Cards Grid */}
      <ObrasGrid tiposObras={tiposObras} />
    </div>
  );
};

export default Obras;
