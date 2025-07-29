import React from 'react';
import { ContactHero, useContactForm } from '../components/contacto';
import Footer from '../components/shared/Footer';

const Contacto: React.FC = () => {
  const {
    formData,
    isSubmitting,
    showSuccessModal,
    handleChange,
    handleSubmit,
    closeSuccessModal
  } = useContactForm();

  return (
    <div className="min-h-screen flex flex-col">
      <ContactHero
        formData={formData}
        isSubmitting={isSubmitting}
        showSuccessModal={showSuccessModal}
        onFieldChange={handleChange}
        onSubmit={handleSubmit}
        onCloseSuccessModal={closeSuccessModal}
      />
      
      <Footer />
    </div>
  );
};

export default Contacto;
