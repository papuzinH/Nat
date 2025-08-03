import React from 'react';

const FAQContactCTA: React.FC = () => {
  return (
    <section className="text-center mt-16 py-16 bg-cream-100 rounded-lg">
      <h2 className="text-3xl font-title text-gray-800 mb-6">
        ¿No encontraste tu respuesta?
      </h2>
      <p className="text-gray-600 font-body mb-8 max-w-2xl mx-auto">
        Si tienes alguna pregunta específica que no está aquí, 
        no dudes en contactarme directamente.
      </p>
      <button className="bg-cream-600 text-white px-8 py-3 rounded-md font-body hover:bg-cream-700 transition-colors">
        Contactarme
      </button>
    </section>
  );
};

export default FAQContactCTA;
