import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Title, Subtitle, Button } from '@/components/shared';
import ContenidoText from '@/components/tattoo/ContenidoText';
import { tattoos } from '@/assets/tattoo/mock-data';

const TattooDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Buscar el tatuaje por ID
  const tattoo = tattoos.find(t => t.id === Number(id));

  // Página 404 si no se encuentra el tatuaje
  if (!tattoo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center px-4">
          <Title as="h1" variant="titlePage" className="text-cream-800 mb-4">
            404 - Tatuaje no encontrado
          </Title>
          <Subtitle variant="medium" className="text-cream-600 mb-8">
            Lo siento, el diseño que buscas no existe o fue removido.
          </Subtitle>
          <Link to="/tattoo">
            <Button variant="primary" size="large">
              Ver todos los trabajos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-nude-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-cream-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm font-body">
            <Link 
              to="/tattoo" 
              className="text-cream-600 hover:text-green-600 transition-colors"
            >
              Portfolio
            </Link>
            <span className="text-cream-400">/</span>
            <span className="text-cream-800 font-medium">{tattoo.title}</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header Section */}
        <header className="max-w-4xl mx-auto mb-12 text-center">
          <Title 
            as="h1" 
            variant="titlePage" 
            className="text-cream-800 mb-4 animate-fade-in"
          >
            {tattoo.title}
          </Title>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6 animate-fade-in animation-delay-150">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 
                          px-4 py-2 rounded-full text-sm font-body">
              <span className="font-semibold">Categoría:</span>
              {tattoo.category}
            </div>
            <div className="inline-flex items-center gap-2 bg-cream-100 text-cream-800 
                          px-4 py-2 rounded-full text-sm font-body">
              <span className="font-semibold">📍 Ubicación:</span>
              {tattoo.location}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in animation-delay-300">
            {tattoo.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs font-body text-cream-600 bg-white border border-cream-200
                         px-3 py-1 rounded-full hover:border-green-300 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Image Section */}
        <div className="max-w-3xl mx-auto mb-12 animate-fade-in animation-delay-450">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl 
                        border-4 border-white">
            <img
              src={tattoo.image}
              alt={tattoo.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Content Section - Usando ContenidoText */}
        <div className="max-w-4xl mx-auto mb-12">
          <ContenidoText content={tattoo.description} />
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl 
                      shadow-lg border border-cream-200 p-8 md:p-12
                      animate-fade-in animation-delay-600">
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-cream-800 mb-4"
          >
            ¿Te gustó este diseño?
          </Title>
          <Subtitle 
            variant="medium" 
            className="text-cream-600 mb-8"
          >
            Puedo crear algo único y personalizado para vos. 
            Charlemos sobre tu idea y hagamos realidad tu próximo tatuaje.
          </Subtitle>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/contacto?design=${tattoo.id}`}>
              <Button 
                variant="primary" 
                size="large"
                className="w-full sm:w-auto font-title tracking-wide bg-green-600 
                         hover:bg-green-700 shadow-xl hover:shadow-green-500/50"
              >
                COTIZA ESTE DISEÑO
              </Button>
            </Link>
            
            <Link to="/tattoo">
              <Button 
                variant="outline" 
                size="large"
                className="w-full sm:w-auto font-body"
              >
                Ver más trabajos
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Section - Otros trabajos similares */}
        <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-cream-200">
          <Title 
            as="h3" 
            variant="titleSection" 
            className="text-cream-800 text-center mb-8"
          >
            Otros trabajos de {tattoo.category}
          </Title>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tattoos
              .filter(t => t.category === tattoo.category && t.id !== tattoo.id)
              .slice(0, 3)
              .map(relatedTattoo => (
                <Link
                  key={relatedTattoo.id}
                  to={`/tattoo/${relatedTattoo.id}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl 
                           shadow-md hover:shadow-xl transition-all duration-300
                           border border-cream-200 hover:border-green-400"
                >
                  <img
                    src={relatedTattoo.image}
                    alt={relatedTattoo.title}
                    className="w-full h-full object-cover group-hover:scale-110 
                             transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                flex items-end p-4">
                    <p className="text-white font-title text-sm">
                      {relatedTattoo.title}
                    </p>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </article>
    </div>
  );
};

export default TattooDetail;
