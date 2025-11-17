import tat1 from './tat1.jpg';
import tat2 from './tat2.jpg';
import tat3 from './tat3.jpg';
import tat4 from './tat4.jpg';

// Mock data para tatuajes destacados
export interface Tattoo {
  id: number;
  title: string;
  image: string;
  category: string;
  description?: string;
}

export const tattoos: Tattoo[] = [
  {
    id: 1,
    title: 'Diseño Único',
    image: tat1,
    category: 'Personalizado',
    description: 'Tatuaje personalizado con técnica mixta'
  },
  {
    id: 2,
    title: 'Arte en Piel',
    image: tat2,
    category: 'Original',
    description: 'Diseño original con detalles únicos'
  },
  {
    id: 3,
    title: 'Expresión Artística',
    image: tat3,
    category: 'Creativo',
    description: 'Expresión creativa en cada trazo'
  },
  {
    id: 4,
    title: 'Obra Maestra',
    image: tat4,
    category: 'Exclusivo',
    description: 'Diseño exclusivo y memorable'
  }
];
