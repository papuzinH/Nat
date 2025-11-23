import React from 'react';
import { HeroSection, Footer, SchemaMarkup } from '@/components/shared';
import { 
  ContentHero, 
  SocialProofSection, 
  FeaturedPortfolioSection, 
  InstagramSection, 
  HomeFAQSection 
} from '@/components/home';
import sobremiHeroVideo from '@/assets/sobremi_hero.mp4';

// Main Home Component
const Home: React.FC = () => {
  // Schema.org LocalBusiness Data
  const localBusinessSchema = {
    name: 'Natalia Heller Tattoo Studio',
    image: 'https://tatuajesnaty.com/hero-image.webp',
    url: 'https://tatuajesnaty.com/',
    telephone: '+54 9 11 6619-1209',
    address: {
      '@type': 'PostalAddress' as const,
      addressLocality: 'Buenos Aires',
      addressRegion: 'CABA',
      addressCountry: 'AR',
    },
    priceRange: '$$',
    serviceType: [
      'Tatuaje Line Art',
      'Tatuaje Botánico',
      'Diseño Personalizado',
      'Tatuaje Minimalista',
      'Cover Up',
    ],
    description: 'Estudio de tatuajes especializado en diseños únicos y personalizados. Line Art, Botánico, Minimalista. 8+ años de experiencia en Buenos Aires.',
    openingHours: [
      'Mo-Fr 10:00-19:00',
      'Sa 11:00-17:00',
    ],
    sameAs: [
      'https://instagram.com/nataliaceller_art',
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <SchemaMarkup type="LocalBusiness" data={localBusinessSchema} />

      <div className="relative min-h-screen flex flex-col">
        {/* Hero Section con video background */}
        <HeroSection 
          video={sobremiHeroVideo} 
          content={<ContentHero />}
        />

      {/* Social Proof / Testimonials Section */}
      <SocialProofSection />

      {/* Featured Portfolio Section */}
      <FeaturedPortfolioSection />

      {/* Instagram Engagement Section */}
      <InstagramSection />

      {/* FAQ Section - Cierre de objeciones */}
      <HomeFAQSection />

      {/* Footer con estilo transparente */}
      <Footer />
      </div>
    </>
  );
};

export default Home;
