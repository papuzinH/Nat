import React from 'react';
import { Title, Subtitle, Section } from '../shared';

const BlogIntroduction: React.FC = () => {
  return (
    <Section className="bg-white">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Contenido a la izquierda */}
        <div className="order-2 lg:order-1">
          <Title variant="titleSection" as="h2" className="mb-6">
            Mi Viaje Artístico
          </Title>
          <Subtitle variant="medium" className="mb-6">
            A través de este blog, comparto mi experiencia como artista y tatuadora, 
            explorando las técnicas que he desarrollado a lo largo de los años.
          </Subtitle>
          <div className="space-y-4 text-gray-600 font-body">
            <p>
              Cada artículo refleja mi pasión por el arte corporal y mi compromiso 
              con la excelencia técnica. Desde los fundamentos del diseño hasta 
              las técnicas más avanzadas de sombreado y color.
            </p>
            <p>
              También encontrarás guías completas sobre el cuidado de tatuajes, 
              inspiración para nuevos diseños y reflexiones sobre el significado 
              del arte en nuestras vidas.
            </p>
          </div>
        </div>

        {/* Imagen a la derecha */}
        <div className="order-1 lg:order-2">
          <div className="relative">
            <div className="aspect-[4/5] bg-cream-200 rounded-lg overflow-hidden shadow-lg">
              <img
                src="/src/assets/nat_profile.webp"
                alt="Natalia trabajando en su estudio"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-cream-100 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default BlogIntroduction;
