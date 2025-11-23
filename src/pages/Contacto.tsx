import React from 'react';
import { ContactHero } from '../components/contacto';
import { SchemaMarkup } from '../components/shared';

const Contacto: React.FC = () => {
  const contactPageSchema = {
    name: 'Contacto - Natalia Heller Tattoo Studio',
    description: 'Agenda tu cita o consulta por diseños personalizados.',
    url: 'https://tatuajesnaty.com/contacto',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Natalia Heller Tattoo Studio',
      telephone: '+54 9 11 6619-1209',
      email: 'contacto@tatuajesnaty.com', // Example email
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressRegion: 'CABA',
        addressCountry: 'AR'
      }
    }
  };

  return (
    <>
      <SchemaMarkup type="ContactPage" data={contactPageSchema} />
      <div className="min-h-screen py-32">
        <ContactHero />
      </div>
    </>
  );
};

export default Contacto;
