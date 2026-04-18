// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ProductTone = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

export type ProductCategory =
  | 'laminas'
  | 'ceramica'
  | 'acuarela'
  | 'textil'
  | 'gouache'
  | 'abanicos'
  | 'stickers'
  | 'mandalas'
  | 'ilustracion'
  | 'mixta'

export type ProductStatus = 'active' | 'coming-soon' | 'out-of-stock'

export interface ProductVariant {
  size: string            // 'A6' | 'A5' | 'A4' | 'A3'
  priceMultiplier: number // 0.55 | 0.75 | 1 | 1.6
}

export interface Product {
  slug: string
  title: string
  category: ProductCategory
  catLabel: string         // 'Lámina — Giclée', 'Cerámica — Gres esmaltado', etc.
  basePrice: number        // en ARS, precio del tamaño base (A4 o unidad)
  size: string             // descripción de medidas: 'A4 · 21×29,7 cm', '∅ 14 cm', etc.
  tone: ProductTone
  tall: number             // aspect ratio tall para placeholder: 1.3 = 1:1.3
  medium: string           // 'Impresión giclée sobre papel Hahnemühle 308g'
  edition: string          // 'Edición abierta · firmada', 'Pieza única', etc.
  description: string      // párrafo descriptivo, copy aprobado
  images: string[]         // paths a imágenes reales (vacío → placeholder)
  tags: string[]
  variants: ProductVariant[] | null
  hasFrame: boolean
  framePrice: number       // precio del addon de marco en ARS
  onDemand: boolean
  status: ProductStatus
}

export interface ProductCategoryMeta {
  slug: string
  label: string
}

// ─── Tokens de color por tono ────────────────────────────────────────────────

export const TONE_COLORS: Record<ProductTone, string> = {
  a: '#ece2d1',
  b: '#dde2d1',
  c: '#e5d9c7',
  d: '#d5ddcf',
  e: '#e8dfd0',
  f: '#dfdfd1',
}

// ─── Categorías ───────────────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES: ProductCategoryMeta[] = [
  { slug: 'todos',       label: 'Todos' },
  { slug: 'laminas',     label: 'Láminas' },
  { slug: 'ceramica',    label: 'Cerámica' },
  { slug: 'acuarela',    label: 'Acuarelas' },
  { slug: 'gouache',     label: 'Gouache' },
  { slug: 'textil',      label: 'Textiles' },
  { slug: 'ilustracion', label: 'Ilustraciones' },
  { slug: 'mixta',       label: 'Técnica mixta' },
  { slug: 'stickers',    label: 'Stickers' },
  { slug: 'mandalas',    label: 'Mandalas' },
  { slug: 'abanicos',    label: 'Abanicos' },
]

// ─── Variantes comunes ────────────────────────────────────────────────────────

const LAMINA_VARIANTS: ProductVariant[] = [
  { size: 'A6', priceMultiplier: 0.55 },
  { size: 'A5', priceMultiplier: 0.75 },
  { size: 'A4', priceMultiplier: 1 },
  { size: 'A3', priceMultiplier: 1.6 },
]

const MANDALA_VARIANTS: ProductVariant[] = [
  { size: 'A5', priceMultiplier: 0.75 },
  { size: 'A4', priceMultiplier: 1 },
  { size: 'A3', priceMultiplier: 1.6 },
]

// ─── Catálogo ─────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    slug: 'helecho-i',
    title: 'Helecho I',
    category: 'laminas',
    catLabel: 'Lámina — Giclée',
    basePrice: 8500,
    size: 'A4 · 21×29,7 cm',
    tone: 'a',
    tall: 1.3,
    medium: 'Impresión giclée sobre papel Hahnemühle 308g',
    edition: 'Edición abierta · firmada',
    description:
      'Estudio de helecho a tinta, parte de la serie de botánica sensible de 2025. Cada lámina se firma a mano en el dorso.',
    images: [],
    tags: ['botanica', 'tinta', 'papel', 'serie-2025'],
    variants: LAMINA_VARIANTS,
    hasFrame: true,
    framePrice: 12000,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'cuenco-musgo',
    title: 'Cuenco Musgo',
    category: 'ceramica',
    catLabel: 'Cerámica — Gres esmaltado',
    basePrice: 24000,
    size: '∅ 14 cm · 6 cm alto',
    tone: 'b',
    tall: 1,
    medium: 'Gres cocido a 1240°, esmalte ceniza de madera',
    edition: 'Pieza única',
    description:
      'Cuenco tornado a mano, esmaltado con ceniza propia. Superficie porosa, irregular, cálida al tacto.',
    images: [],
    tags: ['ceramica', 'gres', 'pieza-unica', 'cuenco'],
    variants: null,
    hasFrame: false,
    framePrice: 0,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'anemone-studio',
    title: 'Anémonas — estudio',
    category: 'acuarela',
    catLabel: 'Acuarela original',
    basePrice: 46000,
    size: '24×32 cm',
    tone: 'c',
    tall: 1.25,
    medium: 'Acuarela sobre papel Arches 300g',
    edition: 'Obra original',
    description:
      'Estudio libre de anémonas de campo. Pigmentos en capas delgadas, dejando respirar el blanco del papel.',
    images: [],
    tags: ['botanica', 'floral', 'acuarela', 'papel'],
    variants: null,
    hasFrame: true,
    framePrice: 12000,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'tapiz-raiz',
    title: 'Tapiz Raíz',
    category: 'textil',
    catLabel: 'Fibra — telar manual',
    basePrice: 92000,
    size: '38×62 cm',
    tone: 'd',
    tall: 1.5,
    medium: 'Lana cruda teñida con cebolla y yerba mate',
    edition: 'Pieza única',
    description:
      'Tejido en telar de alto lizo. Tonos cálidos obtenidos con tintes naturales cultivados en el estudio.',
    images: [],
    tags: ['textil', 'telar', 'natural', 'pieza-unica'],
    variants: null,
    hasFrame: false,
    framePrice: 0,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'gouache-membrillo',
    title: 'Membrillo en gouache',
    category: 'gouache',
    catLabel: 'Gouache original',
    basePrice: 38000,
    size: '18×24 cm',
    tone: 'e',
    tall: 1.1,
    medium: 'Gouache sobre papel de algodón',
    edition: 'Obra original · enmarcable',
    description:
      'Estudio de membrillo maduro pintado del natural en el huerto del estudio.',
    images: [],
    tags: ['botanica', 'gouache', 'papel', 'frutas'],
    variants: null,
    hasFrame: true,
    framePrice: 12000,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'abanico-jazmin',
    title: 'Abanico Jazmín',
    category: 'abanicos',
    catLabel: 'Abanico pintado a mano',
    basePrice: 28000,
    size: '23 cm plegado',
    tone: 'f',
    tall: 0.95,
    medium: 'Madera de peral y algodón, pintado en tinta india',
    edition: 'Serie de 8',
    description:
      'Abanico clásico pintado a mano con jazmines, cada uno ligeramente distinto.',
    images: [],
    tags: ['floral', 'tinta', 'abanico', 'serie'],
    variants: null,
    hasFrame: false,
    framePrice: 0,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'stickers-botanicos',
    title: 'Stickers botánicos',
    category: 'stickers',
    catLabel: 'Set de 6 stickers',
    basePrice: 4500,
    size: 'Entre 4 y 8 cm',
    tone: 'a',
    tall: 0.9,
    medium: 'Vinilo mate resistente al agua',
    edition: 'Producción continua',
    description:
      'Set de seis stickers con motivos de la serie de botánica. Ideales para cuadernos, notebooks y termos.',
    images: [],
    tags: ['botanica', 'stickers', 'vinilo', 'set'],
    variants: null,
    hasFrame: false,
    framePrice: 0,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'mandala-ornamental',
    title: 'Mandala ornamental — hoja',
    category: 'mandalas',
    catLabel: 'Lámina para pintar',
    basePrice: 3800,
    size: 'A4',
    tone: 'b',
    tall: 1.2,
    medium: 'Impresión en papel marfil 150g',
    edition: 'Producción continua',
    description:
      'Lámina ornamental de línea fina, pensada para pintar con lápices o acuarelas.',
    images: [],
    tags: ['mandala', 'papel', 'colorear', 'linea-fina'],
    variants: MANDALA_VARIANTS,
    hasFrame: false,
    framePrice: 0,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'ilustracion-paloma',
    title: 'Paloma en línea fina',
    category: 'ilustracion',
    catLabel: 'Ilustración original',
    basePrice: 32000,
    size: '20×28 cm',
    tone: 'c',
    tall: 1.3,
    medium: 'Tinta sobre papel',
    edition: 'Obra original',
    description:
      'Ilustración a tinta en trazo continuo. Estudio del gesto de una paloma en reposo.',
    images: [],
    tags: ['ilustracion', 'tinta', 'papel', 'fauna'],
    variants: null,
    hasFrame: true,
    framePrice: 12000,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'mixta-herbario',
    title: 'Herbario II',
    category: 'mixta',
    catLabel: 'Técnica mixta',
    basePrice: 54000,
    size: '30×40 cm',
    tone: 'd',
    tall: 1.15,
    medium: 'Collage, acuarela y costura a mano sobre papel',
    edition: 'Obra original',
    description:
      'Pieza de la serie Herbario: plantas prensadas del huerto intervenidas con acuarela y costura.',
    images: [],
    tags: ['botanica', 'collage', 'mixta', 'herbario'],
    variants: null,
    hasFrame: true,
    framePrice: 12000,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'taza-ceniza',
    title: 'Taza Ceniza',
    category: 'ceramica',
    catLabel: 'Cerámica — taza',
    basePrice: 18000,
    size: '300 ml',
    tone: 'e',
    tall: 1,
    medium: 'Gres tornado, esmalte mate',
    edition: 'Serie pequeña',
    description:
      'Taza de morning coffee, ligera en la mano, borde suave. Cada una con su huella.',
    images: [],
    tags: ['ceramica', 'gres', 'taza', 'serie'],
    variants: null,
    hasFrame: false,
    framePrice: 0,
    onDemand: false,
    status: 'active',
  },
  {
    slug: 'lamina-olivo',
    title: 'Olivo',
    category: 'laminas',
    catLabel: 'Lámina — Giclée',
    basePrice: 8500,
    size: 'A4 · 21×29,7 cm',
    tone: 'f',
    tall: 1.25,
    medium: 'Impresión giclée sobre papel Hahnemühle 308g',
    edition: 'Edición abierta · firmada',
    description:
      'Rama de olivo en tinta, trazo único. De la serie Botánica sensible.',
    images: [],
    tags: ['botanica', 'tinta', 'papel', 'serie-2025'],
    variants: LAMINA_VARIANTS,
    hasFrame: true,
    framePrice: 12000,
    onDemand: false,
    status: 'active',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getVariantPrice(product: Product, size: string | null): number {
  if (!product.variants || !size) return product.basePrice
  const variant = product.variants.find((v) => v.size === size)
  return variant ? Math.round(product.basePrice * variant.priceMultiplier) : product.basePrice
}

export function formatARS(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}
