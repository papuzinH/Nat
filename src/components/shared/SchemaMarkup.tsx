import React, { useEffect } from 'react';

interface LocalBusinessSchema {
  name: string;
  image: string;
  url: string;
  telephone: string;
  address: {
    '@type': 'PostalAddress';
    addressLocality: string;
    addressRegion: string;
    addressCountry?: string;
  };
  priceRange?: string;
  openingHours?: string[];
  serviceType: string[];
  description?: string;
  geo?: {
    '@type': 'GeoCoordinates';
    latitude?: number;
    longitude?: number;
  };
  sameAs?: string[];
}

interface SchemaMarkupProps {
  type: 'LocalBusiness' | 'Person' | 'Organization' | 'Article' | 'Product' | 'CollectionPage' | 'ContactPage' | 'BreadcrumbList';
  data: LocalBusinessSchema | Record<string, any>;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data }) => {
  useEffect(() => {
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    // Crear elemento script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData, null, 2);
    script.id = `schema-${type.toLowerCase()}`;

    // Agregar al head
    document.head.appendChild(script);

    // Cleanup: remover script al desmontar componente
    return () => {
      const existingScript = document.getElementById(`schema-${type.toLowerCase()}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [type, data]);

  // No renderiza nada en el DOM visible
  return null;
};

export default SchemaMarkup;
