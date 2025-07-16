import React from 'react';
import { Title } from './';

const HeroSobreMi: React.FC = () => {
  return (
    <section className="relative bg-[url('src/assets/hero_sobremi.webp')] h-[80vh] flex items-center justify-center bg-cover bg-center">
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-xs bg-black/20"></div>

      {/* Profile Image - Superpuesta */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 translate-y-16 z-10">
        <Title as='h2' variant='titlePage' className='absolute z-20 left-0 transform -translate-x-1/2 top-0 translate-y-1/2 text-white'>
          Hola!
        </Title>
        <div className="relative w-80 h-96 md:w-96 md:h-[28rem] rounded-2xl shadow-2xl overflow-hidden">
          <img src="src/assets/nat_profile.webp" alt="Foto de Natalia" className="object-cover w-full h-full" />
        </div>
        <Title as='h2' variant='titlePage' className='absolute z-20 -right-0 transform translate-x-1/2 bottom-5 -translate-y-[100%] text-white'>
          Soy <span className='font-bold'>Nat.</span>
        </Title>
        <Title as="h3" variant='titleCard' className="absolute text-center text-black mt-4 left-0 right-0 uppercase">
          Artista/Tatuadora
        </Title>
      </div>
    </section>
  );
};

export default HeroSobreMi;
