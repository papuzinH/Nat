import React from 'react';
import { AboutSobreMi, HeroSection, Title } from '../components/shared';

const ContentHero = () => (
  <div className="relative flex items-center justify-between gap-16">
    <Title as='h2' variant='titlePage' className='text-white text-left'>
      Hola, soy <span className='text-9xl block'>NAT</span>
    </Title>
    <div className="relative w-80 h-96 md:w-[28rem] md:h-[32rem] rounded-2xl shadow-2xl overflow-hidden">
      <img src="src/assets/nat_profile.webp" alt="Foto de Natalia" className="object-cover w-full h-full" />
    </div>
  </div>
);

const SobreMi: React.FC = () => {
  const videoHero = "src/assets/sobremi_hero.mp4"
  return (
    <div className="min-h-screen">
      <HeroSection video={videoHero} content={<ContentHero />} />
      <AboutSobreMi />
    </div>
  );
};

export default SobreMi;
