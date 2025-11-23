import { useState, useEffect } from 'react';

export const useBlogPostLogic = (slug: string | undefined) => {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No se proporcionó un identificador de post');
      setLoading(false);
      return;
    }

    // Simular carga de post completo
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Buscar post por ID (slug en este mock es el ID)
        const postId = Number(slug);
        const mockPosts = [
          {
            id: 1,
            slug: '1',
            title: 'El cuidado de tatuajes recién hechos: Guía completa',
            excerpt: 'Todo lo que necesitas saber para cuidar tu nuevo tatuaje durante las primeras semanas.',
            date: '2024-07-15',
            category: 'Cuidados',
            readTime: '8 min',
            featured: true,
            author: 'Natalia Heller',
            tags: ['cuidados', 'cicatrización', 'aftercare', 'consejos'],
            image: undefined,
            content: [
              'Un tatuaje es una inversión importante, tanto económica como personal. El cuidado adecuado durante las primeras semanas es crucial para asegurar que tu nuevo tatuaje cicatrice correctamente y mantenga su belleza durante toda la vida.',
              'Durante las primeras 24-48 horas, tu tatuaje es esencialmente una herida abierta. Es fundamental mantenerlo limpio y protegido. Lava tu tatuaje suavemente con agua tibia y jabón neutro, sin fragancia. Evita frotar vigorosamente; usa movimientos suaves y circulares.',
              'Una vez que tu tatuaje esté completamente seco, aplica una fina capa de crema especial para tatuajes o una crema hidratante sin fragancia. No apliques demasiada cantidad; el tatuaje debe poder respirar. Repite este proceso 2-3 veces al día durante las primeras dos semanas.',
              'Evita exponer tu tatuaje al sol directo, no lo sumerjas en agua (piscinas, mar, bañeras) durante al menos 2 semanas, y no uses ropa ajustada que pueda rozar el área tatuada. La picazón es normal durante la cicatrización, pero nunca rasques tu tatuaje.',
              'Después de las primeras dos semanas, continúa hidratando tu tatuaje diariamente y protégelo del sol con protector solar de alto factor. Un tatuaje bien cuidado mantendrá sus colores vibrantes y líneas nítidas durante décadas. Si notas signos de infección (enrojecimiento excesivo, calor, pus), consulta inmediatamente a un médico.'
            ]
          },
          {
            id: 2,
            slug: '2',
            title: 'Inspiración para tu próximo tatuaje: Tendencias 2024',
            date: '2024-07-08',
            category: 'Inspiración',
            readTime: '6 min',
            author: 'Natalia Heller',
            image: undefined,
            content: [
              'El mundo del tatuaje está en constante evolución, y 2024 trae consigo tendencias fascinantes que combinan lo clásico con lo contemporáneo. Desde el minimalismo refinado hasta el realismo hiperrealista, hay un estilo para cada personalidad y historia.',
              'El minimalismo continúa siendo una de las tendencias más solicitadas. Diseños pequeños, líneas finas y delicadas, y composiciones simples pero significativas. Estos tatuajes suelen llevar un significado profundo en su simplicidad, perfectos para quienes buscan algo discreto pero memorable.',
              'Por otro lado, el realismo botánico ha ganado terreno este año. Flores, hojas y elementos naturales renderizados con un nivel de detalle impresionante, capturando texturas y sombras que parecen fotografías en la piel. Esta tendencia conecta con la búsqueda de belleza natural y conexión con la tierra.',
              'La geometría sagrada y los mandalas personalizados también están en auge, combinando simetría perfecta con elementos únicos que representan el viaje personal de cada individuo. Estos diseños no solo son estéticamente impactantes, sino que también llevan una profunda carga simbólica.',
              'Mi recomendación es siempre buscar inspiración, pero también trabajar con tu tatuador para crear algo único. Las tendencias son excelentes puntos de partida, pero tu tatuaje debe ser una expresión auténtica de quien eres. Tómate tu tiempo, explora diferentes estilos, y cuando encuentres el diseño correcto, lo sabrás.'
            ]
          }
        ];
        
        const foundPost = mockPosts.find(p => p.id === postId);
        
        if (!foundPost) {
          setError('Post no encontrado');
          setPost(null);
        } else {
          setPost(foundPost);
        }
      } catch (err) {
        setError('Error al cargar el artículo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  return {
    post,
    loading,
    error
  };
};
