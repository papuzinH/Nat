import acrilico from '@/assets/obras/acrilico.jpg';
import acuarela from '@/assets/obras/acuarela.jpg';
import heroAcrilico from '@/assets/obras/hero-acrilico.webp';

export const tiposObras = [
  {
    id: 'acrilicos',
    title: 'Acrílicos',
    image: acrilico,
    description: 'Pinturas hechas con acrílico sobre papel o sobre bastidores de tela.',
    route: '/obras/acrilicos'
  },
  {
    id: 'acuarelas',
    title: 'Acuarelas',
    image: acuarela,
    description: 'Sobre papel 100% algodón de alto gramaje, con grano fino o grueso.',
    route: '/obras/acuarelas'
  },
  {
    id: 'flores-prensadas',
    title: 'Flores Prensadas',
    image: heroAcrilico,
    description: 'Plantas recolectadas, prensadas y enmarcadas.',
    route: '/obras/flores-prensadas'
  },
  {
    id: 'gouache',
    title: 'Gouache',
    image: heroAcrilico,
    description: 'Pinturas hechas con HIMI GOUACHE sobre papel de alto gramaje.',
    route: '/obras/gouache'
  },
  {
    id: 'ilustraciones',
    title: 'Ilustraciones',
    image: heroAcrilico,
    description: 'Dibujos hechos con estilógrafos en distintos tamaños de punta fina.',
    route: '/obras/ilustraciones'
  },
  {
    id: 'tecnicas-mixtas',
    title: 'Técnicas Mixtas',
    image: heroAcrilico,
    description: 'Obras que combinan distintos medios en una misma superficie.',
    route: '/obras/tecnicas-mixtas'
  },
  {
    id: 'marcadores',
    title: 'Marcadores',
    image: heroAcrilico,
    description: 'Pinturas hechas con marcadores de colores en formato pequeño.',
    route: '/obras/marcadores'
  },
  {
    id: 'ceramicas',
    title: 'Cerámicas',
    image: heroAcrilico,
    description: 'Piezas únicas hechas con arcilla y técnicas varias de esmaltado.',
    route: '/obras/ceramicas'
  },
  {
    id: 'stickers',
    title: 'Stickers',
    image: heroAcrilico,
    description: 'Para que puedas tener un pedacito de NAT en cualquier objeto.',
    route: '/obras/stickers'
  }
];
