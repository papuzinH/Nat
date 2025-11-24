import { useState, useEffect } from 'react';
import type { Tattoo } from '@/assets/tattoo/mock-data';
import tat1 from '@/assets/tattoo/tat1.jpg';
import tat2 from '@/assets/tattoo/tat2.jpg';
import tat3 from '@/assets/tattoo/tat3.jpg';
import tat4 from '@/assets/tattoo/tat4.jpg';

// Mapa de imágenes para resolver los paths del JSON a los imports de Vite
// Esto es necesario porque las imágenes están en src/assets y no en public/
const imageMap: Record<number, string> = {
  1: tat1,
  2: tat2,
  3: tat3,
  4: tat4
};

export const fetchTattooData = async (): Promise<Tattoo[]> => {
  try {
    const response = await fetch('/data/tattoos.json');
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const jsonData = await response.json();
    
    // Mapear las imágenes importadas a los datos del JSON
    // Esto permite mantener la gestión de assets de Vite mientras desacoplamos los datos
    return jsonData.map((item: Tattoo) => ({
      ...item,
      image: imageMap[item.id] || item.image
    }));
  } catch (error) {
    console.error('Error fetching tattoo data:', error);
    throw error;
  }
};

export const useDataLoader = () => {
  const [data, setData] = useState<Tattoo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        // Simulamos un pequeño delay para ver el estado de carga (opcional, UX)
        // await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = await fetchTattooData();
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos');
          // Fallback a datos vacíos o manejo de error UI
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
};
