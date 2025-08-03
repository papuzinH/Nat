import React, { useState } from 'react';
import {Title, Button, Section} from '../shared';

const BlogPostNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simular llamada a API
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <Section>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <Title variant="titleSection" className="mb-4">
            ¡Gracias por suscribirte!
          </Title>
          <p className="text-gray-600 font-body">
            Recibirás nuestras últimas novedades y contenido exclusivo directamente en tu correo.
          </p>
      </Section>
    );
  }

  return (
    <Section>
      <div className="max-w-xl mx-auto text-center">
        <Title variant="titleSection" className="mb-4">
          Mantente al día
        </Title>
        <p className="text-gray-600 font-body mb-6">
          Suscríbete a nuestro newsletter para recibir las últimas novedades, 
          consejos artísticos y contenido exclusivo directamente en tu correo.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newsletter-email" className="sr-only">
              Correo electrónico
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent font-body"
              required
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Suscribiendo...
              </div>
            ) : (
              'Suscribirse al newsletter'
            )}
          </Button>
        </form>
        
        <p className="text-gray-500 font-body text-sm mt-4">
          No enviamos spam. Puedes darte de baja en cualquier momento.
        </p>
      </div>
    </Section>
  );
};

export default BlogPostNewsletter;
