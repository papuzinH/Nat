import React from 'react';
import { Section, Title } from '../shared';
import ContentImage from './ContentImage';

const AboutSobreMi: React.FC = () => {
  return (

    <Section className="text-center mb-20">
      <Title variant="titleSection" as="h2" className="mb-8 uppercase">
        Te cuento sobre mi universo creativo
      </Title>

      <ContentImage
        text={
          <>
            <p>
              Desde que soy muy pequeña fue notorio lo mucho que disfrutaba jugando con papeles, colores y sobre todo con mis manos.
            </p>
            <p className='font-bold'>
              El arte siempre fue mi forma más natural de expresarme y con el tiempo entendí que no solo era una manera de observar el mundo, sino también de habitarlo.
            </p>
            <p>
              Después de muchos años de una lucha personal intensa en relación a mi salud, encontré la manera de reencontrarme a través del tatuaje.
            </p>
          </>
        }
        image={"src/assets/sobremi_1.webp"}
        alt="Natalia en su estudio"
      />

      <ContentImage
        orientation="reverse"
        text={
          <>
            <p>
              Hoy soy artista visual y trabajo en mi estudio creando piezas únicas sobre la piel de mis clientes.
            </p>
            <p className='font-bold'>
              Mi universo creativo está guiado por 3 pilares: la naturaleza, la simetría y el amor por los detalles.
            </p>
            <p>
              Como artista, el hecho de definirse dentro de una rama específica siempre me resultó muy difícil. Es por eso que trabajo sobre distintas superficies y con distintas técnicas.
            </p>
          </>
        }
        image={"src/assets/sobremi_2.webp"}
        alt="Natalia en su estudio"
      />

      <ContentImage
        text={
          <>
            <p>
              Me inspiran las texturas orgánicas, los momentos de calma y los detalles más ínfimos que podés encontrar en la naturaleza.
            </p>
            <p className='font-bold'>
              En este espacio te quiero mostrar mi trabajo, pero también mi historia. Ojalá algo de lo que veas acá resuene con vos.
            </p>
            <p>
              Y si es así, me encantaría que hablemos, que imagines conmigo, o que le demos forma a una nueva pieza!
            </p>
          </>
        }
        image={"/src/assets/sobremi_3.webp"}
        alt="Natalia trabajando en su estudio"
      />
    </Section>
  );
};

export default AboutSobreMi;
