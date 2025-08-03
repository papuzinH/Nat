import { useState, useEffect } from 'react';

// Mock data extendido con contenido completo para algunos posts
const extendedMockContent: { [key: number]: string } = {
  1: `
    <h2>Introducción al Cuidado de Tatuajes</h2>
    <p>Un tatuaje es una inversión importante, tanto económica como personal. El cuidado adecuado durante las primeras semanas es crucial para asegurar que tu nuevo tatuaje cicatrice correctamente y mantenga su belleza durante toda la vida.</p>
    
    <h3>Los Primeros Días: Críticos para el Éxito</h3>
    <p>Durante las primeras 24-48 horas, tu tatuaje es esencialmente una herida abierta. Es fundamental mantenerlo limpio y protegido. Aquí te explico paso a paso cómo cuidar tu nuevo tatuaje:</p>
    
    <blockquote>
      "El cuidado post-tatuaje no es solo sobre seguir instrucciones, es sobre respetar el arte que ahora forma parte de ti."
    </blockquote>
    
    <h3>Limpieza Diaria</h3>
    <p>Lava tu tatuaje suavemente con agua tibia y jabón neutro, sin fragancia. Evita frotar vigorosamente; usa movimientos suaves y circulares. Después del lavado, sécalo con toques suaves usando una toalla limpia.</p>
    
    <h3>Hidratación Adecuada</h3>
    <p>Una vez que tu tatuaje esté completamente seco, aplica una fina capa de crema especial para tatuajes o una crema hidratante sin fragancia. No apliques demasiada cantidad; el tatuaje debe poder respirar.</p>
  `,
  4: `
    <h2>Los Pilares del Diseño de Tatuajes</h2>
    <p>El diseño de un tatuaje exitoso se basa en principios fundamentales que he perfeccionado a lo largo de mis años de experiencia. Cada elemento debe trabajar en armonía para crear una pieza cohesiva y visualmente impactante.</p>
    
    <h3>Composición y Equilibrio</h3>
    <p>La composición es el fundamento de cualquier diseño exitoso. Considero cuidadosamente cómo cada elemento interactúa con los demás, creando un equilibrio visual que sea agradable a la vista y funcione con la anatomía del cuerpo.</p>
    
    <blockquote>
      "Un buen diseño no es solo lo que se ve bien en papel, sino lo que funcionará hermosamente en la piel durante décadas."
    </blockquote>
    
    <h3>Flujo y Movimiento</h3>
    <p>Los tatuajes deben fluir naturalmente con las líneas del cuerpo. Esto significa considerar la musculatura, las articulaciones y los movimientos naturales de la zona donde se colocará el tatuaje.</p>
    
    <h3>Escala y Proporción</h3>
    <p>La escala correcta es crucial. Un diseño debe ser lo suficientemente grande para mantener su integridad visual a medida que la piel cambia con el tiempo, pero también debe ser apropiado para la zona del cuerpo elegida.</p>
  `
};

export const useBlogPostLogic = (postId: number) => {
  const [extendedContent, setExtendedContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de contenido extendido
    const loadExtendedContent = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Obtener contenido extendido o usar contenido por defecto
      const content = extendedMockContent[postId] || generateDefaultContent();
      setExtendedContent(content);
      setLoading(false);
    };

    loadExtendedContent();
  }, [postId]);

  const generateDefaultContent = () => {
    return `
      <h2>Introducción</h2>
      <p>Este artículo explora conceptos importantes relacionados con el arte del tatuaje y mi experiencia personal en este campo.</p>
      
      <h3>Mi Enfoque</h3>
      <p>A lo largo de mi carrera, he desarrollado técnicas y metodologías que me permiten crear obras únicas y significativas para cada cliente.</p>
      
      <blockquote>
        "Cada tatuaje cuenta una historia única, y mi trabajo es ayudar a que esa historia se exprese de la manera más bella posible."
      </blockquote>
      
      <h3>Técnicas y Proceso</h3>
      <p>Mi proceso creativo combina técnicas tradicionales con innovaciones modernas, siempre priorizando la calidad y la satisfacción del cliente.</p>
      
      <p>Si estás interesado en conocer más sobre este tema o tienes preguntas específicas, no dudes en contactarme para una consulta personalizada.</p>
    `;
  };

  return {
    extendedContent,
    loading
  };
};
