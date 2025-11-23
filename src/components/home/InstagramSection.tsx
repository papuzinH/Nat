import React from 'react';
import { Title, Subtitle, Button } from '@/components/shared';

const InstagramSection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-brown-100 via-nude-100 to-cream-100 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brown-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon/Emoji */}
          <div className="text-6xl md:text-7xl mb-6 animate-fade-in">
            📸
          </div>

          {/* Title */}
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-brown-800 mb-6 animate-fade-in animation-delay-150"
          >
            Mi Diario de Arte: Proceso y Reflexiones
          </Title>

          {/* Subtitle */}
          <Subtitle 
            variant="large" 
            className="text-brown-600 mb-8 animate-fade-in animation-delay-300"
          >
            Sígueme en Instagram para ver mis sketches, mis últimos trabajos 
            y las inspiraciones que guían mi proceso creativo.
          </Subtitle>

          {/* Stats Row */}
          <div className="flex justify-center gap-8 md:gap-12 mb-10 animate-fade-in animation-delay-450">
            <div className="text-center">
              <div className="font-title text-3xl md:text-4xl text-green-700 mb-1">
                10K+
              </div>
              <div className="font-body text-sm md:text-base text-brown-600">
                Seguidores
              </div>
            </div>
            <div className="w-px bg-brown-300"></div>
            <div className="text-center">
              <div className="font-title text-3xl md:text-4xl text-green-700 mb-1">
                500+
              </div>
              <div className="font-body text-sm md:text-base text-brown-600">
                Publicaciones
              </div>
            </div>
            <div className="w-px bg-brown-300"></div>
            <div className="text-center">
              <div className="font-title text-3xl md:text-4xl text-green-700 mb-1">
                4.9★
              </div>
              <div className="font-body text-sm md:text-base text-brown-600">
                Valoración
              </div>
            </div>
          </div>

          {/* Instagram Feed - Widget Real */}
          <div className="my-12 animate-fade-in animation-delay-450">
            {/* Feed Title */}
            <h2 className="font-title text-2xl md:text-3xl text-brown-800 mb-8">
              Mis Últimos Tatuajes
            </h2>

            {/* LightWidget Instagram Feed */}
            <div className="w-full">
              <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
              <iframe 
                src="//lightwidget.com/widgets/11730c9547d65b8da1544c6a36290e44.html" 
                scrolling="no" 
                allowTransparency={true}
                loading="lazy"
                className="lightwidget-widget w-full border-0 min-h-[400px] md:min-h-[550px]"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in animation-delay-600">
            <Button 
              variant="primary" 
              size="large"
              as="link"
              href="https://instagram.com/nataliaceller_art"
              target="_blank"
              className="font-title tracking-wide bg-gradient-to-r from-green-600 to-green-700 
                       hover:from-green-700 hover:to-green-800 shadow-xl hover:shadow-green-500/50"
            >
              📱 Sígueme en Instagram
            </Button>
          </div>

          {/* Handle */}
          <p className="mt-4 font-body text-brown-500 text-sm animate-fade-in animation-delay-600">
            @nataliaceller_art
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
