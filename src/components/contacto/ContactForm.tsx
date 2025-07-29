import React from 'react';
import FormContainer from './FormContainer';

const ContactForm: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-display text-white text-center mb-8">
          Hablemos de tu proyecto
        </h2>
        <FormContainer />
      </div>
    </div>
  );
};

export default ContactForm;
