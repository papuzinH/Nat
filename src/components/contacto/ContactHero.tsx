import React, { Suspense } from 'react';
import FormContainer from './FormContainer';
import ContactInfo from './ContactInfo';

const ContactHero: React.FC = () => (
  <section className="px-6 md:px-12 py-16 md:py-20 bg-cream-100">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-7xl mx-auto">
      <ContactInfo />
      {/* FormContainer usa useSearchParams (next/navigation) → requiere Suspense */}
      <Suspense fallback={null}>
        <FormContainer />
      </Suspense>
    </div>
  </section>
);

export default ContactHero;
