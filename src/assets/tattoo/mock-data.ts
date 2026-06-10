import type { StaticImageData } from 'next/image';
import tat1 from './tat1.jpg';
import tat2 from './tat2.jpg';
import tat3 from './tat3.jpg';
import tat4 from './tat4.jpg';

export type TatTone = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

export interface TattooCard {
  id: number
  tone: TatTone
  tall: number
  label: string
  kind: string
  image?: string | StaticImageData
}

export const TATTOO_CARDS: TattooCard[] = [
  { id: 1,  tone: 'a', tall: 1.4,  label: 'BOCETO · 2025', kind: 'Helecho antebrazo',          image: tat1 },
  { id: 2,  tone: 'd', tall: 0.9,  label: 'EN PIEL',        kind: 'Rama de olivo · clavícula',   image: tat2 },
  { id: 3,  tone: 'c', tall: 1.2,  label: 'BOCETO',         kind: 'Ornamental · esternón',        image: tat3 },
  { id: 4,  tone: 'b', tall: 1.6,  label: 'EN PIEL',        kind: 'Flor silvestre · espalda',     image: tat4 },
  { id: 5,  tone: 'e', tall: 1.1,  label: 'BOCETO · 2024',  kind: 'Serie luna + hojas',           image: tat1 },
  { id: 6,  tone: 'f', tall: 1.35, label: 'EN PIEL',        kind: 'Colibrí en línea fina',        image: tat2 },
  { id: 7,  tone: 'd', tall: 1.0,  label: 'BOCETO',         kind: 'Jazmín del país · brazo',      image: tat3 },
  { id: 8,  tone: 'a', tall: 1.45, label: 'EN PIEL',        kind: 'Mandala minimal · muñeca',     image: tat4 },
  { id: 9,  tone: 'c', tall: 0.95, label: 'BOCETO',         kind: 'Hoja monstera · tobillo',      image: tat1 },
  { id: 10, tone: 'b', tall: 1.3,  label: 'EN PIEL',        kind: 'Ornamental pecho',             image: tat2 },
  { id: 11, tone: 'e', tall: 1.55, label: 'BOCETO · 2025',  kind: 'Botánico minimal · costado',   image: tat3 },
  { id: 12, tone: 'a', tall: 1.05, label: 'EN PIEL',        kind: 'Line art · antebrazo',         image: tat4 },
]

// Mock data para tatuajes con contenido SEO/LLMO optimizado
export interface Tattoo {
  id: number;
  slug: string;
  title: string;
  image: string | StaticImageData;
  category: string;
  location: string;
  description: string[];
  tags: string[];
}

export const tattoos: Tattoo[] = [
  {
    id: 1,
    slug: 'linea-fina-botanico-antebrazo',
    title: 'Line Art Botánico en Antebrazo',
    image: tat1,
    category: 'Línea Fina',
    location: 'Antebrazo',
    description: [
      'Este diseño de línea fina combina elementos botánicos con una técnica delicada y precisa. Inspirado en la flora nativa argentina, cada trazo fue cuidadosamente planeado para fluir con la anatomía natural del antebrazo, creando un efecto visual armónico que se integra perfectamente con el movimiento del cuerpo.',
      'La técnica de línea fina requiere una mano firme y años de experiencia para lograr trazos uniformes y definidos. En este trabajo, utilicé agujas de configuración específica para lograr líneas limpias de un solo paso, sin necesidad de repasar. El resultado es un tatuaje elegante que resistirá el paso del tiempo manteniendo su nitidez característica.',
      'La inspiración para este diseño surge de la observación directa de plantas autóctonas y el estudio de ilustraciones botánicas clásicas. Cada hoja, cada pétalo y cada detalle orgánico fue adaptado para crear una composición única que cuenta la historia personal del cliente, fusionando su amor por la naturaleza con un estilo minimalista contemporáneo que caracteriza mi trabajo en el estudio.'
    ],
    tags: ['línea fina', 'botánico', 'minimalista', 'antebrazo', 'flora nativa']
  },
  {
    id: 2,
    slug: 'geometrico-ornamental-brazo',
    title: 'Mandala Geométrico Ornamental',
    image: tat2,
    category: 'Geométrico',
    location: 'Brazo',
    description: [
      'Los diseños geométricos y ornamentales representan la perfecta unión entre matemática y arte. Este mandala personalizado fue desarrollado específicamente para envolver el brazo, respetando la simetría natural del cuerpo mientras crea un efecto visual impactante desde cualquier ángulo.',
      'Cada línea de este diseño ornamental fue trazada con precisión milimétrica, utilizando técnicas de stencil personalizado y aplicación meticulosa. El trabajo geométrico requiere una planificación exhaustiva previa, donde cada elemento se conecta armónicamente con el siguiente, creando patrones que se repiten y evolucionan alrededor del brazo.',
      'La filosofía detrás de este tipo de diseños va más allá de lo estético. Los mandalas representan totalidad, equilibrio y el viaje hacia el centro de uno mismo. Este trabajo en particular incorpora elementos de geometría sagrada, combinando círculos, triángulos y patrones fractales que invitan a la contemplación y reflejan la búsqueda de armonía interior del portador.'
    ],
    tags: ['geométrico', 'mandala', 'ornamental', 'brazo', 'simetría']
  },
  {
    id: 3,
    slug: 'ilustrativo-color-pierna',
    title: 'Diseño Ilustrativo con Detalles a Color',
    image: tat3,
    category: 'Ilustrativo',
    location: 'Pierna',
    description: [
      'Este tatuaje ilustrativo combina la técnica de línea negra sólida con toques selectivos de color, creando un diseño que destaca por su expresividad y profundidad visual. La elección estratégica del color agrega dimensión y personalidad sin saturar la composición.',
      'El estilo ilustrativo permite una mayor libertad creativa, combinando elementos realistas con toques estilizados que dan carácter único a cada pieza. En este trabajo, utilicé una paleta de colores limitada pero efectiva, enfocándome en tonos que complementan naturalmente el tono de piel y que se mantendrán vibrantes con el paso del tiempo.',
      'La ubicación en la pierna ofrece un lienzo amplio ideal para composiciones verticales que cuentan historias visuales. Este diseño en particular fue desarrollado en colaboración directa con el cliente, incorporando elementos simbólicos personales que transforman el tatuaje en una narrativa visual única e irrepetible.'
    ],
    tags: ['ilustrativo', 'color', 'pierna', 'personalizado', 'narrativo']
  },
  {
    id: 4,
    slug: 'blackwork-espalda-alta',
    title: 'Blackwork Ornamental en Espalda Alta',
    image: tat4,
    category: 'Blackwork',
    location: 'Espalda Alta',
    description: [
      'El blackwork es una técnica que utiliza exclusivamente tinta negra para crear diseños de alto impacto visual. Este trabajo ornamental en la espalda alta combina áreas sólidas con patrones intrincados, logrando un contraste dramático que define la musculatura y realza la figura.',
      'La espalda alta es una de las ubicaciones más versátiles para tatuajes de gran escala. Permite crear diseños que fluyen naturalmente con los omóplatos y la columna vertebral, como en este caso donde el patrón ornamental se adapta orgánicamente a la anatomía, creando una pieza que parece haber sido diseñada específicamente para ese cuerpo.',
      'Este tipo de trabajo requiere múltiples sesiones y una resistencia considerable por parte del cliente. El resultado final es una obra de arte permanente que combina elegancia, fuerza visual y significado personal. Los patrones ornamentales elegidos incorporan simbolismos de protección y transformación, elementos recurrentes en la tradición del tatuaje blackwork.'
    ],
    tags: ['blackwork', 'ornamental', 'espalda', 'bold', 'grande']
  }
];
