import React from 'react';
import { Title } from './';

const AboutSobreMi: React.FC = () => {
  return (
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
              <p className='font-bold'>
                El arte siempre fue mi forma más natural de expresarme y con el tiempo entendí que no solo era una manera de observar el mundo, sino también de habitarlo.
              </p>
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
                Hoy soy artista visual y trabajo en mi estudio creando piezas únicas sobre la piel de mis clientes.
              </p>
              <p className='font-bold'>
                Mi universo creativo está guiado por 3 pilares: la naturaleza, la simetría y el amor por los detalles.
              </p>
              <p>
                Como artista, el hecho de definirse dentro de una rama específica siempre me resultó muy difícil. Es por eso que trabajo sobre distintas superficies y con distintas técnicas.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center gap-8 h-fit mb-16">
            <div className="w-1/2 text-left flex flex-col gap-4 items-start justify-start text-lg">
              <p>
                Me inspiran las texturas orgánicas, los momentos de calma y los detalles más ínfimos que podés encontrar en la naturaleza.
              </p>
              <p className='font-bold'>
                En este espacio te quiero mostrar mi trabajo, pero también mi historia. Ojalá algo de lo que veas acá resuene con vos.
              </p>
              <p>
                Y si es así, me encantaría que hablemos, que imagines conmigo, o que le demos forma a una nueva pieza!
              </p>
            </div>
            <div className="w-1/2 max-h-[28rem] overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="src/assets/sobremi_3.webp" 
                alt="Natalia en su estudio" 
                className='w-full h-full object-cover' 
                style={{ objectPosition: '0 -100px' }} 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutSobreMi;
