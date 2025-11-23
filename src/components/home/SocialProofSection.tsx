import React from 'react';
import { Title, Subtitle, Button, Section } from '@/components/shared';

const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      text: '500+ Diseños de Autor',
      subtitle: 'Cada pieza refleja la esencia única de quien la lleva.',
      icon: '🎨'
    },
    {
      id: 2,
      text: 'Mi Experiencia: 8+ Años',
      subtitle: 'Perfeccionando el arte del tatuaje con pasión y dedicación.',
      icon: '⭐'
    },
    {
      id: 3,
      text: 'Estudio Personal & Seguro',
      subtitle: 'Trabajo bajo los más altos estándares de higiene y cuidado.',
      icon: '✨'
    }
  ];

  return (
    <div className="relative bg-cream-50">
      <Section className="md:py-24">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-cream-800 mb-4 animate-fade-in"
          >
            Mi Universo Creativo y Tu Historia
          </Title>
          <Subtitle 
            variant="medium" 
            className="text-cream-600 max-w-2xl mx-auto animate-fade-in animation-delay-150"
          >
            Enfocada en el detalle, te invito a co-crear un diseño exclusivo, 
            con la confianza y seguridad de 8+ años de experiencia.
          </Subtitle>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 
                         border border-cream-200 hover:border-green-300 transform hover:scale-105
                         animate-fade-in`}
              style={{ animationDelay: `${index * 150 + 300}ms` }}
            >
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">
                {testimonial.icon}
              </div>
              
              {/* Main Text */}
              <Title 
                as="h3" 
                variant="titleCard" 
                className="text-cream-800 text-center mb-3"
              >
                {testimonial.text}
              </Title>
              
              {/* Subtitle */}
              <Subtitle 
                variant="small" 
                className="text-cream-600 text-center leading-relaxed"
              >
                {testimonial.subtitle}
              </Subtitle>
            </div>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="text-center mt-12 md:mt-16 animate-fade-in animation-delay-600">
          <Button 
            variant="outline" 
            size="large"
            as="link"
            to="/tattoo"
            className="font-body"
          >
            Ver Portfolio de Tatuajes
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default SocialProofSection;
