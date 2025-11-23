import heroAcrilico from '@/assets/obras/hero-acrilico.webp';

export interface Obra {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface ObraCategory {
  slug: string;
  title: string;
  description: string;
  obras: Obra[];
}

export const obrasData: ObraCategory[] = [
  {
    slug: 'acuarelas',
    title: 'Acuarelas',
    description: 'La delicadeza y transparencia de la acuarela permite crear obras llenas de sutileza y expresión, jugando con la fluidez del agua y los pigmentos.',
    obras: [
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
    ]
  },
  {
    slug: 'ceramicas',
    title: 'Cerámicas',
    description: 'El trabajo en cerámica combina la tradición artesanal con la expresión contemporánea, creando piezas únicas que fusionan funcionalidad y arte.',
    obras: [
      { id: 1, title: 'Vasija Artesanal', description: 'Cerámica esmaltada 15x20cm', image: heroAcrilico },
      { id: 2, title: 'Plato Decorativo', description: 'Cerámica pintada a mano 25cm diámetro', image: heroAcrilico },
      { id: 3, title: 'Escultura Pequeña', description: 'Cerámica cocida 20x15x10cm', image: heroAcrilico },
      { id: 4, title: 'Taza Única', description: 'Cerámica esmaltada 12x10cm', image: heroAcrilico },
      { id: 5, title: 'Bowl Artístico', description: 'Cerámica texturizada 18x8cm', image: heroAcrilico },
      { id: 6, title: 'Pieza Experimental', description: 'Cerámica raku 25x30cm', image: heroAcrilico },
    ]
  },
  {
    slug: 'acrilicos',
    title: 'Acrílicos',
    description: 'Pinturas hechas con acrílico sobre papel o sobre bastidores de tela, explorando texturas y colores vibrantes.',
    obras: Array(6).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Obra en Acrílico ${i + 1}`,
      description: 'Acrílico sobre lienzo',
      image: heroAcrilico
    }))
  },
  {
    slug: 'flores-prensadas',
    title: 'Flores Prensadas',
    description: 'Plantas recolectadas, prensadas y enmarcadas, preservando la belleza efímera de la naturaleza.',
    obras: Array(6).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Composición Botánica ${i + 1}`,
      description: 'Flores prensadas y enmarcadas',
      image: heroAcrilico
    }))
  },
  {
    slug: 'gouache',
    title: 'Gouache',
    description: 'Pinturas hechas con HIMI GOUACHE sobre papel de alto gramaje, caracterizadas por su acabado mate y opaco.',
    obras: Array(6).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Ilustración Gouache ${i + 1}`,
      description: 'Gouache sobre papel',
      image: heroAcrilico
    }))
  },
  {
    slug: 'ilustraciones',
    title: 'Ilustraciones',
    description: 'Dibujos hechos con estilógrafos en distintos tamaños de punta fina, enfocados en el detalle y la línea.',
    obras: Array(6).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Ilustración en Tinta ${i + 1}`,
      description: 'Tinta sobre papel',
      image: heroAcrilico
    }))
  },
  {
    slug: 'tecnicas-mixtas',
    title: 'Técnicas Mixtas',
    description: 'Obras que combinan distintos medios en una misma superficie, rompiendo los límites de una sola técnica.',
    obras: Array(6).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Obra Mixta ${i + 1}`,
      description: 'Técnica mixta sobre papel',
      image: heroAcrilico
    }))
  },
  {
    slug: 'marcadores',
    title: 'Marcadores',
    description: 'Pinturas hechas con marcadores de colores en formato pequeño, vibrantes y llenas de vida.',
    obras: Array(6).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Dibujo con Marcadores ${i + 1}`,
      description: 'Marcadores sobre papel',
      image: heroAcrilico
    }))
  },
  {
    slug: 'stickers',
    title: 'Stickers',
    description: 'Para que puedas tener un pedacito de NAT en cualquier objeto. Diseños adhesivos duraderos y originales.',
    obras: Array(6).fill(null).map((_, i) => ({
      id: i + 1,
      title: `Set de Stickers ${i + 1}`,
      description: 'Vinilo adhesivo troquelado',
      image: heroAcrilico
    }))
  }
];
