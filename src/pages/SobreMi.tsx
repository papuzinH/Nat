import React from 'react';
import { AboutSobreMi, HeroSection, Title, SchemaMarkup } from '../components/shared';
import natProfileImage from '../assets/nat_profile.webp';
import sobremiHeroVideo from '../assets/sobremi_hero.mp4';

const ContentHero = () => (
  <div className="relative flex items-center justify-between gap-16">
    <Title as='h2' variant='titlePage' className='text-white text-left'>
      Hola, soy <span className='text-9xl block'>NAT</span>
    </Title>
    <div className="relative w-80 h-96 md:w-[28rem] md:h-[32rem] rounded-2xl shadow-2xl overflow-hidden">
      <img src={natProfileImage} alt="Foto de Natalia" className="object-cover w-full h-full" />
    </div>
  </div>
);

const SobreMi: React.FC = () => {
  const personalSchema = {
    name: 'Natalia Heller',
    image: 'https://tatuajesnaty.com/nat_profile.webp',
    url: 'https://tatuajesnaty.com/sobre-mi',
    sameAs: [
      'https://instagram.com/nataliaceller_art'
    ],
    jobTitle: 'Tattoo Artist',
    worksFor: {
      '@type': 'Organization',
      name: 'Natalia Heller Tattoo Studio'
    }
  };

  return (
    <>
      <SchemaMarkup type="Person" data={personalSchema} />
      <div className="min-h-screen">
        <HeroSection video={sobremiHeroVideo} content={<ContentHero />} />
        <AboutSobreMi />
      </div>
    </>
  );
};

export default SobreMi;
