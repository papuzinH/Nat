import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type BlogPost } from '../components/blog';

// Mock data - en una aplicación real esto vendría de una API
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'El cuidado de tatuajes recién hechos: Guía completa',
    excerpt: 'Todo lo que necesitas saber para cuidar tu nuevo tatuaje durante las primeras semanas. Consejos profesionales para una cicatrización perfecta.',
    date: '2024-07-15',
    category: 'Cuidados',
    readTime: '8 min',
    featured: true,
    author: 'Natalia Heller',
    tags: ['cuidados', 'cicatrización', 'aftercare', 'consejos'],
    content: 'Contenido completo del artículo sobre cuidados...'
  },
  {
    id: 2,
    title: 'Inspiración para tu próximo tatuaje: Tendencias 2024',
    excerpt: 'Descubre las tendencias actuales y encuentra la inspiración para tu próxima obra de arte corporal. Desde minimalismo hasta realismo.',
    date: '2024-07-08',
    category: 'Inspiración',
    readTime: '6 min',
    author: 'Natalia Heller',
    tags: ['tendencias', 'inspiración', 'diseño', '2024'],
    content: 'Contenido completo del artículo sobre tendencias...'
  },
  {
    id: 3,
    title: 'Técnicas de sombreado en tatuajes: Masterclass',
    excerpt: 'Una guía completa sobre las diferentes técnicas de sombreado que utilizo en mis trabajos. Aprende los secretos del degradado perfecto.',
    date: '2024-07-01',
    category: 'Técnicas',
    readTime: '12 min',
    author: 'Natalia Heller',
    tags: ['técnicas', 'sombreado', 'masterclass', 'tutorial'],
    content: 'Contenido completo del artículo sobre sombreado...'
  },
  {
    id: 4,
    title: 'Los fundamentos del diseño de tatuajes',
    excerpt: 'Exploro los principios fundamentales que guían el diseño de tatuajes únicos y significativos. Composición, equilibrio y flujo.',
    date: '2024-06-22',
    category: 'Diseño',
    readTime: '10 min',
    featured: true,
    author: 'Natalia Heller',
    tags: ['diseño', 'composición', 'fundamentos', 'arte'],
    content: 'Contenido completo del artículo sobre diseño...'
  },
  {
    id: 5,
    title: 'Preparación antes de hacerte un tatuaje',
    excerpt: 'Consejos esenciales para prepararte física y mentalmente antes de tu sesión de tatuaje. Qué hacer y qué evitar.',
    date: '2024-06-15',
    category: 'Cuidados',
    readTime: '5 min',
    author: 'Natalia Heller',
    tags: ['preparación', 'consejos', 'sesión', 'cuidados'],
    content: 'Contenido completo del artículo sobre preparación...'
  },
  {
    id: 6,
    title: 'El significado detrás de los símbolos',
    excerpt: 'Un viaje por la simbología en los tatuajes y cómo elegir diseños que realmente representen tu esencia personal.',
    date: '2024-06-08',
    category: 'Inspiración',
    readTime: '7 min',
    author: 'Natalia Heller',
    tags: ['simbolos', 'significado', 'inspiración', 'personal'],
    content: 'Contenido completo del artículo sobre símbolos...'
  },
  {
    id: 7,
    title: 'Técnicas de color en tatuajes: Teoría y práctica',
    excerpt: 'Domina el uso del color en tus tatuajes. Desde la teoría del color hasta las técnicas de aplicación profesional.',
    date: '2024-06-01',
    category: 'Técnicas',
    readTime: '15 min',
    author: 'Natalia Heller',
    tags: ['color', 'teoría', 'técnicas', 'aplicación'],
    content: 'Contenido completo del artículo sobre color...'
  },
  {
    id: 8,
    title: 'Anatomía y tatuajes: Flujo corporal',
    excerpt: 'Cómo diseñar tatuajes que sigan las líneas naturales del cuerpo para crear composiciones armoniosas y estéticamente perfectas.',
    date: '2024-05-25',
    category: 'Diseño',
    readTime: '11 min',
    author: 'Natalia Heller',
    tags: ['anatomía', 'flujo', 'diseño', 'cuerpo'],
    content: 'Contenido completo del artículo sobre anatomía...'
  },
  {
    id: 9,
    title: 'Historia del tatuaje: De la tradición a la modernidad',
    excerpt: 'Un recorrido por la rica historia del arte del tatuaje, desde las culturas ancestrales hasta las técnicas contemporáneas.',
    date: '2024-05-18',
    category: 'Historia',
    readTime: '9 min',
    author: 'Natalia Heller',
    tags: ['historia', 'tradición', 'cultura', 'evolución'],
    content: 'Contenido completo del artículo sobre historia...'
  },
  {
    id: 10,
    title: 'Cuidados post-tatuaje: Errores comunes',
    excerpt: 'Los errores más frecuentes en el cuidado post-tatuaje y cómo evitarlos para garantizar una cicatrización óptima.',
    date: '2024-05-11',
    category: 'Cuidados',
    readTime: '6 min',
    author: 'Natalia Heller',
    tags: ['cuidados', 'errores', 'cicatrización', 'consejos'],
    content: 'Contenido completo del artículo sobre errores comunes...'
  }
];

export const useBlogLogic = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simular carga de datos
    const loadPosts = async () => {
      try {
        setLoading(true);
        // En una aplicación real, esto sería una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 500));
        setPosts(mockBlogPosts);
      } catch (err) {
        setError('Error al cargar los artículos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handlePostClick = (post: BlogPost) => {
    // Navegar al artículo individual
    navigate(`/blog/${post.id}`);
  };

  return {
    posts,
    loading,
    error,
    handlePostClick
  };
};
