import React from 'react';
import { Link } from 'react-router-dom';
import { Title, Subtitle, Button } from '@/components/shared';
import { tattoos } from '@/assets/tattoo/mock-data';

const FeaturedPortfolioSection: React.FC = () => {
  // Seleccionar los primeros 4 tatuajes para mostrar
  const featuredTattoos = tattoos.slice(0, 4);

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-nude-50 to-brown-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-brown-800 mb-4 animate-fade-in"
          >
            Trabajos Destacados
          </Title>
          <Subtitle 
            variant="medium" 
            className="text-brown-600 max-w-2xl mx-auto animate-fade-in animation-delay-150"
          >
            Explora algunos de nuestros diseños más emblemáticos. 
            Cada tatuaje cuenta una historia única.
          </Subtitle>
        </div>

        {/* Grid de Tatuajes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto mb-12">
          {featuredTattoos.map((tattoo, index) => (
            <Link
              key={tattoo.id}
              to="/tattoo"
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl 
                         transition-all duration-500 transform hover:scale-105 animate-fade-in
                         border border-brown-200 hover:border-green-400`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image Container */}
              <div className="aspect-[3/4] overflow-hidden bg-nude-100">
                <img
                  src={tattoo.image}
                  alt={tattoo.title}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                  loading={index < 2 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </div>

              {/* Overlay con info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                            flex flex-col justify-end p-6">
                <h3 className="font-title text-white text-lg md:text-xl mb-2">
                  {tattoo.title}
                </h3>
                <p className="font-body text-white/80 text-sm">
                  {tattoo.category}
                </p>
              </div>

              {/* Badge de categoría */}
              <div className="absolute top-4 right-4 bg-green-600/90 backdrop-blur-sm 
                            text-white text-xs font-body px-3 py-1 rounded-full">
                {tattoo.category}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Secundario */}
        <div className="text-center animate-fade-in animation-delay-600">
          <Button 
            variant="primary" 
            size="large"
            as="link"
            to="/tattoo"
            className="font-title tracking-wide bg-green-600 hover:bg-green-700"
          >
            VER PORTAFOLIO COMPLETO
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPortfolioSection;
