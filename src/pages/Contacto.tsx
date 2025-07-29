import React from 'react';
import { ContactHero, useContactForm } from '../components/contacto';
import Footer from '../components/shared/Footer';

const Contacto: React.FC = () => {
  const {
    formData,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit
  } = useContactForm();

  return (
    <div className="min-h-screen flex flex-col">
      <ContactHero
        formData={formData}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        onFieldChange={handleChange}
        onSubmit={handleSubmit}
      />
      
      <Footer />
    </div>
  );
};

export default Contacto;
