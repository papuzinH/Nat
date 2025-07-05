import React from 'react';
import { Title, Subtitle } from '../../components/shared';

const FloresPrensadas: React.FC = () => {
  // Datos de ejemplo para las obras de flores prensadas
  const floresData = [
    { id: 1, title: 'Herbario Romántico', description: 'Flores prensadas sobre papel 20x30cm' },
    { id: 2, title: 'Composición Silvestre', description: 'Flores prensadas sobre papel 25x35cm' },
    { id: 3, title: 'Jardín Eterno', description: 'Flores prensadas sobre papel 30x40cm' },
    { id: 4, title: 'Memoria Botánica', description: 'Flores prensadas sobre papel 15x20cm' },
    { id: 5, title: 'Estaciones del Año', description: 'Flores prensadas sobre papel 35x45cm' },
    { id: 6, title: 'Naturaleza Preservada', description: 'Flores prensadas sobre papel 20x30cm' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title variant="titlePage" as="h1" className="mb-6">
          Flores Prensadas
        </Title>
        <Subtitle variant="large" className="max-w-3xl mx-auto">
          Una técnica ancestral que conserva la belleza natural de las flores, 
          creando composiciones únicas que capturan la esencia de cada estación.
        </Subtitle>
      </div>

      {/* Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {floresData.map((obra) => (
          <div key={obra.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg bg-cream-100 aspect-square mb-4 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-cream-300 flex items-center justify-center">
                <span className="text-cream-600 font-body text-sm">Imagen {obra.id}</span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            <Title variant="titleCard" as="h3" className="mb-2 group-hover:text-cream-700 transition-colors">
              {obra.title}
            </Title>
            <Subtitle variant="small" as="p" className="text-cream-600">
              {obra.description}
            </Subtitle>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FloresPrensadas;
