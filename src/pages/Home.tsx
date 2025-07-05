import React from 'react';
import { Title, Subtitle, Button } from '../components/shared';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <Title variant="titlePage" as="h1" className="mb-6">
          NAT | ART
        </Title>
        <Subtitle variant="large" className="mb-8 max-w-2xl mx-auto">
          Te invito a mi universo creativo
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

     
    </div>
  );
};

export default Home;
