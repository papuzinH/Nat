import React from 'react';
import { Link } from 'react-router-dom';
import { Title, Subtitle } from '@/components/shared';
import type { Tattoo } from '@/assets/tattoo/mock-data';

interface TattooGridListProps {
  tattoos: Tattoo[];
}

const TattooGridList: React.FC<TattooGridListProps> = ({ tattoos }) => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-cream-50 to-nude-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-cream-800 mb-4 animate-fade-in"
          >
            Portfolio de Trabajos
          </Title>
          <Subtitle 
            variant="medium" 
            className="text-cream-600 max-w-3xl mx-auto animate-fade-in animation-delay-150"
          >
            Me especializo en trabajos de Línea Fina, Ornamental y Botánico. 
            También realizo trabajos de estilo Ilustrativo, con detalles a color 
            o trabajos en Black and Grey.
          </Subtitle>
        </div>

        {/* Grid de Tatuajes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {tattoos.map((tattoo, index) => (
            <Link
              key={tattoo.id}
              to="/contacto"
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl 
                         transition-all duration-500 transform hover:scale-105 animate-fade-in
                         border border-cream-200 hover:border-green-400`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="aspect-[3/4] overflow-hidden bg-nude-100">
                <img
                  src={tattoo.image}
                  alt={tattoo.title}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                />
              </div>

              {/* Overlay con info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                            flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-title text-white text-lg md:text-xl mb-2">
                    {tattoo.title}
                  </h3>
                  <p className="font-body text-white/90 text-sm mb-2">
                    {tattoo.category}
                  </p>
                  <p className="font-body text-white/80 text-xs">
                    📍 {tattoo.location}
                  </p>
                </div>
              </div>

              {/* Badge de categoría */}
              <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur-sm 
                            text-white text-xs font-body px-3 py-1.5 rounded-full
                            shadow-lg">
                {tattoo.category}
              </div>

              {/* Indicador de "Ver más" */}
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100
                            transition-opacity duration-300 bg-white/20 backdrop-blur-sm
                            text-white text-xs font-body px-3 py-1.5 rounded-full
                            border border-white/30">
                Agendar turno →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TattooGridList;
