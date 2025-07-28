import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from '../components/shared';

const NavigationCard: React.FC<{ 
  to: string; 
  title: string; 
  description: string;
  delay?: string;
}> = ({ to, title, description, delay = '' }) => (
  <Link 
    to={to}
    className={`group relative p-6 rounded-2xl backdrop-blur-md bg-white/10 hover:bg-white/20 
               border border-white/20 hover:border-white/30 transition-all duration-500 
               transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl
               ${delay}`}
  >
    <div className="text-center">
      <h3 className="font-title text-white text-xl md:text-2xl mb-2 group-hover:text-cream-100 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-white/80 text-sm md:text-base group-hover:text-white transition-colors duration-300">
        {description}
      </p>
    </div>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </Link>
);

const MainNavigation = () => {
  const navigationItems = [
    { to: '/obras', title: 'Obras', description: 'Explora mi portafolio artístico' },
    { to: '/tattoo', title: 'Tattoo', description: 'Diseños únicos en tu piel' },
    { to: '/sobre-mi', title: 'Sobre Mi', description: 'Conoce mi historia' },
    { to: '/blog', title: 'Blog', description: 'Proceso creativo y reflexiones' },
    { to: '/faqs', title: 'FAQs', description: 'Preguntas frecuentes' },
    { to: '/contacto', title: 'Contacto', description: 'Hagamos algo juntos' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl mx-auto px-6">
      {navigationItems.map((item, index) => (
        <NavigationCard
          key={item.to}
          to={item.to}
          title={item.title}
          description={item.description}
          delay={`animation-delay-${index * 150}`}
        />
      ))}
    </div>
  );
};

const ContentHero = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
    {/* Brand Header */}
    <div className="text-center mb-12 md:mb-16 animate-fade-in">
      <Title as='h1' variant='titlePage' className='text-white text-center mb-4'>
        <span className='text-4xl md:text-6xl lg:text-7xl block mb-2'>Natalia</span>
        <span className='text-6xl md:text-8xl lg:text-9xl font-light'>HELLER</span>
      </Title>
      <div className="w-24 h-0.5 bg-white/60 mx-auto mb-6"></div>
      <p className="text-white/90 text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed">
        Artista & Tatuadora
      </p>
      <p className="text-white/70 text-sm md:text-base font-body max-w-3xl mx-auto mt-2">
        Donde el arte encuentra su expresión más pura
      </p>
    </div>

    {/* Navigation Grid */}
    <MainNavigation />

    {/* Floating Logo/Signature */}
    <div className="absolute top-8 left-8 z-20">
      <Link to="/" className="font-title text-white/80 hover:text-white text-2xl md:text-3xl transition-colors duration-300">
        NH
      </Link>
    </div>
  </div>
);

const Home: React.FC = () => {
  const videoHero = "src/assets/sobremi_hero.mp4";

  return (
    <div className="relative">
      {/* Full Screen Hero Video Section */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoHero} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>

        {/* Content over video */}
        <div className="relative z-10 w-full h-full">
          <ContentHero />
        </div>
      </section>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animation-delay-0 {
          animation: fade-in 1s ease-out 0.2s both;
        }

        .animation-delay-150 {
          animation: fade-in 1s ease-out 0.35s both;
        }

        .animation-delay-300 {
          animation: fade-in 1s ease-out 0.5s both;
        }

        .animation-delay-450 {
          animation: fade-in 1s ease-out 0.65s both;
        }

        .animation-delay-600 {
          animation: fade-in 1s ease-out 0.8s both;
        }

        .animation-delay-750 {
          animation: fade-in 1s ease-out 0.95s both;
        }
      `}</style>
    </div>
  );
};

export default Home;
