import React from 'react';
import { Title } from '../components/shared';

const SobreMi: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-16">
        <div className="max-w-4xl mx-auto">

          <section className="text-center mb-20">
            <Title variant="titleSection" as="h2" className="mb-8 uppercase">
              Te cuento sobre mi universo creativo
            </Title>
            <div className="flex justify-between items-center gap-8 h-fit mb-16">
              <div className="w-1/2 text-left flex flex-col gap-4 items-start justify-start text-lg">
                <p>
                  Desde que soy muy pequeña fue notorio lo mucho que disfrutaba jugando con papeles, colores y sobre todo con mis manos.
                </p>
                <p className='font-bold'>El arte siempre fue mi forma más natural de expresarme y con el tiempo entendí que no solo era una manera de observar el mundo, sino también de habitarlo.</p>
                <p>
                  Después de muchos años de una lucha personal intensa en relación a mi salud, encontré la manera de reencontrarme a través del tatuaje.
                </p>
              </div>
              <div className="w-1/2 max-h-[28rem] overflow-hidden rounded-2xl shadow-2xl">
                <img src="src/assets/sobremi_1.webp" alt="Natalia en su estudio" />
              </div>
            </div>
            <div className="flex justify-between items-center gap-8 h-fit mb-16">
              <div className="w-1/2 max-h-[28rem] overflow-hidden rounded-2xl shadow-2xl">
                <img src="src/assets/sobremi_2.webp" alt="Natalia en su estudio" />
              </div>
              <div className="w-1/2 text-left flex flex-col gap-4 items-start justify-start text-lg">
                <p>
                  Me inspiran las texturas orgánicas, los momentos de calma y los detalles más ínfimos que podés encontrar en la naturaleza.
                </p>
                <p className='font-bold'>En este espacio te quiero mostrar mi trabajo, pero también mi historia. Ojalá algo de lo que veas acá resuene con vos.</p>
                <p>
                  Y si es así, me encantaría que hablemos, que imagines conmigo, o que le demos forma a una nueva pieza!                </p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-8 h-fit mb-16">
              <div className="w-1/2 text-left flex flex-col gap-4 items-start justify-start text-lg">
                <p>
                  Desde que soy muy pequeña fue notorio lo mucho que disfrutaba jugando con papeles, colores y sobre todo con mis manos.
                </p>
                <p className='font-bold'>El arte siempre fue mi forma más natural de expresarme y con el tiempo entendí que no solo era una manera de observar el mundo, sino también de habitarlo.</p>
                <p>
                  Después de muchos años de una lucha personal intensa en relación a mi salud, encontré la manera de reencontrarme a través del tatuaje.
                </p>
              </div>
              <div className="w-1/2 max-h-[28rem] overflow-hidden rounded-2xl shadow-2xl">
                <img src="src/assets/sobremi_3.webp" alt="Natalia en su estudio" className='w-full h-full object-cover' style={{ objectPosition: '0 -100px' }} />
              </div>
            </div>
          </section>



        
        </div>
      </div>
    </div>
  );
};

export default SobreMi;
