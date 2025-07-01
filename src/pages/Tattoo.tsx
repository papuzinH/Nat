import React from 'react';

const Tattoo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-title text-gray-800 mb-6">
          Tatuajes
        </h1>
        <p className="text-xl text-gray-600 font-body max-w-3xl mx-auto leading-relaxed">
          Cada tatuaje es una historia única grabada en la piel. 
          Descubre mi trabajo en el arte corporal.
        </p>
      </div>

      {/* Tattoo Styles */}
      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center space-y-4">
          <div className="bg-cream-200 h-48 rounded-lg flex items-center justify-center">
            <span className="text-cream-600 font-body">Minimalista</span>
          </div>
          <h3 className="text-xl font-title text-gray-800">Estilo Minimalista</h3>
          <p className="text-gray-600 font-body text-sm">
            Diseños delicados y simples con líneas finas.
          </p>
        </div>
        <div className="text-center space-y-4">
          <div className="bg-cream-200 h-48 rounded-lg flex items-center justify-center">
            <span className="text-cream-600 font-body">Realismo</span>
          </div>
          <h3 className="text-xl font-title text-gray-800">Realismo</h3>
          <p className="text-gray-600 font-body text-sm">
            Tatuajes con detalles realistas y sombreados.
          </p>
        </div>
        <div className="text-center space-y-4">
          <div className="bg-cream-200 h-48 rounded-lg flex items-center justify-center">
            <span className="text-cream-600 font-body">Geométrico</span>
          </div>
          <h3 className="text-xl font-title text-gray-800">Geométrico</h3>
          <p className="text-gray-600 font-body text-sm">
            Formas geométricas y patrones precisos.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section>
        <h2 className="text-3xl font-title text-gray-800 text-center mb-12">Galería</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-cream-200 aspect-square rounded-lg flex items-center justify-center hover:bg-cream-300 transition-colors cursor-pointer">
              <span className="text-cream-600 font-body">Tattoo {item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="text-center mt-16 py-16 bg-cream-100 rounded-lg">
        <h2 className="text-3xl font-title text-gray-800 mb-6">
          ¿Listo para tu próximo tatuaje?
        </h2>
        <p className="text-gray-600 font-body mb-8 max-w-2xl mx-auto">
          Reserva una consulta para discutir tu idea y crear un diseño único para ti.
        </p>
        <button className="bg-cream-600 text-white px-8 py-3 rounded-md font-body hover:bg-cream-700 transition-colors">
          Reservar Consulta
        </button>
      </section>
    </div>
  );
};

export default Tattoo;
