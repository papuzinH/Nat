import React, { useState } from 'react';
import { Title, Subtitle, Button, HeroSection } from '../shared';
import heroVideo from '../../assets/hero_video.mov';

const BlogHero: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      // Aquí iría la lógica de suscripción
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const heroContent = (
    <div className="max-w-4xl mx-auto text-center px-4">
      <Title variant="titlePage" as="h1" className="mb-6 text-white">
        Blog
      </Title>
      <Subtitle variant="large" className="mb-12 max-w-3xl mx-auto text-white">
        Comparto mis conocimientos, experiencias y reflexiones sobre 
        el mundo del arte y los tatuajes. Descubre técnicas, inspiración 
        y consejos de cuidado.
      </Subtitle>

      {/* Newsletter Subscription */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-8 max-w-md mx-auto">
        <h3 className="text-xl font-title text-gray-800 mb-4">
          Suscríbete al Newsletter
        </h3>
        <p className="text-gray-600 font-body mb-6 text-sm">
          Recibe contenido exclusivo y las últimas actualizaciones directamente en tu email.
        </p>
        
        {isSubscribed ? (
          <div className="text-center">
            <div className="text-green-600 font-body mb-2">
              ¡Gracias por suscribirte!
            </div>
            <p className="text-gray-500 text-sm">
              Revisa tu email para confirmar la suscripción.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              required
              className="flex-1 px-4 py-3 rounded-md border border-cream-300 focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent text-sm"
            />
            <Button type="submit" size="medium" className="whitespace-nowrap">
              Suscribirse
            </Button>
          </form>
        )}
      </div>
    </div>
  );

  return <HeroSection video={heroVideo} content={heroContent} />;
};

export default BlogHero;
