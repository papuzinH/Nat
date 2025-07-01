import React from 'react';

const SobreMi: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-title text-gray-800 mb-6">
            Sobre Mí
          </h1>
          <p className="text-xl text-gray-600 font-body leading-relaxed">
            Conoce la historia detrás del arte
          </p>
        </div>

        {/* Profile Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-cream-200 h-96 rounded-lg flex items-center justify-center">
            <span className="text-cream-600 font-body">Foto de Natalia</span>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-title text-gray-800">Mi Historia</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              Soy Natalia Heller, artista y tatuadora con más de [X] años de experiencia 
              en el mundo del arte. Mi pasión por crear comenzó desde pequeña, 
              y he dedicado mi vida a perfeccionar mi técnica y estilo único.
            </p>
            <p className="text-gray-600 font-body leading-relaxed">
              Cada obra que creo tiene un significado especial, ya sea en papel 
              o en la piel. Creo firmemente que el arte debe ser una extensión 
              de la personalidad y los sentimientos de quien lo lleva.
            </p>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-title text-gray-800 text-center mb-12">Mi Trayectoria</h2>
          <div className="space-y-8">
            {[
              { year: '2020', title: 'Inicio en Tatuajes', description: 'Comencé mi carrera profesional como tatuadora' },
              { year: '2018', title: 'Estudios de Arte', description: 'Completé mis estudios en Bellas Artes' },
              { year: '2015', title: 'Primeras Obras', description: 'Exhibición de mis primeras obras en galería local' }
            ].map((milestone, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="bg-cream-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-title text-sm">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="text-xl font-title text-gray-800">{milestone.title}</h3>
                  <p className="text-gray-600 font-body">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="text-center py-16 bg-cream-100 rounded-lg">
          <h2 className="text-3xl font-title text-gray-800 mb-8">Mi Filosofía</h2>
          <p className="text-gray-600 font-body text-lg leading-relaxed max-w-3xl mx-auto">
            "Creo que cada persona tiene una historia única que merece ser contada a través del arte. 
            Mi trabajo es escuchar esa historia y traducirla en una obra que capture su esencia."
          </p>
        </section>
      </div>
    </div>
  );
};

export default SobreMi;
