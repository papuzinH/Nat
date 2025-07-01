import React from 'react';
import { Title, Subtitle, Button } from '../components/shared';

const Obras: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <Title variant="titlePage" as="h1" className="mb-6">
          Mis Obras
        </Title>
        <Subtitle variant="large" className="max-w-3xl mx-auto">
          Cada obra es una expresión única de creatividad y técnica. 
          Explora mi colección de trabajos artísticos.
        </Subtitle>
      </div>

      {/* Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="group cursor-pointer">
            <div className="bg-cream-200 h-80 rounded-lg mb-4 flex items-center justify-center group-hover:bg-cream-300 transition-colors">
              <span className="text-cream-600 font-body">Obra {item}</span>
            </div>
            <Title variant="titleCard" as="h3" className="mb-2">
              Título de Obra {item}
            </Title>
            <Subtitle variant="small" as="p">
              Descripción breve de la obra y técnica utilizada.
            </Subtitle>
          </div>
        ))}
      </section>

      {/* Categories Filter */}
      <section className="text-center">
        <Title variant="titleSection" as="h2" className="mb-8">
          Categorías
        </Title>
        <div className="flex flex-wrap justify-center gap-4">
          {['Todas', 'Dibujos', 'Pinturas', 'Arte Digital', 'Bocetos'].map((category) => (
            <Button
              key={category}
              variant="secondary"
              size="medium"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Obras;
