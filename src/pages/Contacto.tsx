import React from 'react';
import { ContactHero, useContactForm } from '../components/contacto';

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
    <ContactHero
      formData={formData}
      isSubmitting={isSubmitting}
      showSuccessModal={showSuccessModal}
      onFieldChange={handleChange}
      onSubmit={handleSubmit}
      onCloseSuccessModal={closeSuccessModal}
    />
  );
};

export default Contacto;
