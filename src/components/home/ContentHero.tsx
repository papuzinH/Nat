import React from 'react';
import { Title, Subtitle, Button } from '@/components/shared';

const ContentHero: React.FC = () => (
  <div className="px-4 py-12 md:py-16">
    <div className="max-w-4xl mx-auto text-center">
      {/* H1 optimizado para SEO */}
      <Title 
        as="h1" 
        variant="titlePage" 
        className="text-white mb-6 animate-fade-in"
      >
        Diseños de Tatuajes Únicos y Personalizados en Buenos Aires
      </Title>
      
      {/* Subtitle descriptivo */}
      <Subtitle 
        variant="large" 
        className="text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-150"
      >
        Transformo tu historia y esencia en un diseño único, permanente. 
        En mi estudio, la naturaleza y la simetría guían cada trazo.
      </Subtitle>
      
      {/* CTA Principal */}
      <div className="animate-fade-in animation-delay-300">
        <Button 
          variant="primary" 
          size="large"
          as="link"
          to="/contacto"
          className="font-title tracking-wide shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
        >
          AGENDA MI CITA
        </Button>
      </div>
    </div>
  </div>
);

export default ContentHero;
