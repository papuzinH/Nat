import React from 'react';
import { Title, Subtitle, Button } from '../components/shared';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <Title variant="titlePage" as="h1" className="mb-6">
          Natalia Heller
        </Title>
        <Subtitle variant="large" className="mb-8 max-w-2xl mx-auto">
          Artista y tatuadora especializada en crear obras únicas que capturan 
          la esencia y personalidad de cada cliente.
        </Subtitle>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="large" as="link" to="/obras">
            Ver Obras
          </Button>
          <Button variant="outline" size="large" as="link" to="/contacto">
            Contactar
          </Button>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="grid md:grid-cols-2 gap-16 py-16">
        <div className="space-y-6">
          <Title variant="titleSection" as="h2">
            Mis Obras
          </Title>
          <Subtitle variant="medium">
            Explora mi galería de obras artísticas, donde cada pieza cuenta una historia única.
          </Subtitle>
          <div className="bg-cream-200 h-64 rounded-lg flex items-center justify-center">
            <span className="text-cream-600 font-body">Galería de Obras</span>
          </div>
          <Button variant="ghost" as="link" to="/obras">
            Ver todas las obras →
          </Button>
        </div>
        <div className="space-y-6">
          <Title variant="titleSection" as="h2">
            Tatuajes
          </Title>
          <Subtitle variant="medium">
            Descubre mi trabajo en tatuajes, desde diseños delicados hasta piezas más elaboradas.
          </Subtitle>
          <div className="bg-cream-200 h-64 rounded-lg flex items-center justify-center">
            <span className="text-cream-600 font-body">Galería de Tatuajes</span>
          </div>
          <Button variant="ghost" as="link" to="/tattoo">
            Ver estilos de tatuajes →
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
