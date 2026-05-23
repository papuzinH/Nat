import React from 'react';
import { ContactHero } from '../components/contacto';
import { SchemaMarkup } from '../components/shared';

const Contacto: React.FC = () => {
  const contactPageSchema = {
    name: 'Contacto - Natalia Heller',
    description: 'Agenda tu cita o consulta por diseños personalizados.',
    url: 'https://tatuajesnaty.com/contacto',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Natalia Heller Tattoo Studio',
      telephone: '+54 9 11 6619-1209',
      email: 'agendanattatt@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressRegion: 'CABA',
        addressCountry: 'AR',
      },
    },
  };

  return (
    <>
      <SchemaMarkup type="ContactPage" data={contactPageSchema} />
      <ContactHero />
    </>
  );
};

export default Contacto;
