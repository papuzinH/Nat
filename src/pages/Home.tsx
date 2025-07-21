import React from 'react';
import { Title, Subtitle, Button } from '../components/shared';
import { HeroSection } from '../components/shared';

const ContentHero = () => (
  <div className="relative flex flex-col items-center justify-center">
    <Title as='h1' variant='titlePage' className='text-white mb-4'>
      NAT | ART
    </Title>
    <Subtitle variant='large' className='text-white text-center'>
      Te invito a mi universo creativo
    </Subtitle>
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <Button variant='primary' size='large' as='link' to='/obras'>
       Obras
      </Button>
      <Button variant='outline' size='large' as='link' to='/contacto'>
        Tattoo
      </Button>
    </div>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="mx-auto">
      {/* Hero Section */}
      <HeroSection video="src/assets/home_hero.mp4" content={<ContentHero />} />
      {/* Additional Content Sections */}


    </div>
  );
};

export default Home;
