import React, { useState } from 'react';

const FAQs: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqData = [
    {
      question: '¿Cuánto tiempo toma hacer un tatuaje?',
      answer: 'El tiempo depende del tamaño y complejidad del diseño. Un tatuaje pequeño puede tomar 1-2 horas, mientras que piezas más grandes pueden requerir múltiples sesiones de 3-4 horas cada una.'
    },
    {
      question: '¿Cómo debo prepararme para mi sesión de tatuaje?',
      answer: 'Es importante descansar bien la noche anterior, comer algo antes de venir, mantenerse hidratado y evitar el alcohol. También recomiendo usar ropa cómoda que permita acceso al área a tatuar.'
    },
    {
      question: '¿Qué cuidados necesita un tatuaje nuevo?',
      answer: 'Mantén el tatuaje limpio y seco, aplica la crema recomendada según las instrucciones, evita la exposición al sol y no sumerjas el tatuaje en agua (piscinas, bañeras) durante las primeras 2-3 semanas.'
    },
    {
      question: '¿Puedo traer mi propio diseño?',
      answer: 'Por supuesto! Me encanta trabajar con las ideas de mis clientes. También puedo ayudarte a refinar el diseño o crear algo completamente nuevo basado en tus ideas.'
    },
    {
      question: '¿Duele mucho hacerse un tatuaje?',
      answer: 'La sensación varía según la persona y la ubicación del tatuaje. Algunas áreas son más sensibles que otras. La mayoría de las personas describen la sensación como tolerable y vale la pena el resultado final.'
    },
    {
      question: '¿Cuál es el proceso de reserva?',
      answer: 'Primero programamos una consulta para discutir tu idea. Luego creo el diseño y una vez aprobado, programamos la sesión de tatuaje. Requiero una seña para reservar la cita.'
    },
    {
      question: '¿Haces retoques gratuitos?',
      answer: 'Sí, ofrezco un retoque gratuito dentro de los primeros 3 meses si es necesario, siempre que hayas seguido correctamente las instrucciones de cuidado.'
    },
    {
      question: '¿Qué estilos de tatuajes realizas?',
      answer: 'Me especializo en varios estilos incluyendo minimalista, realismo, geométrico, floral y lettering. Mi enfoque es crear diseños únicos adaptados a cada cliente.'
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-title text-gray-800 mb-6">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-600 font-body leading-relaxed">
            Encuentra respuestas a las preguntas más comunes sobre tatuajes y mi proceso de trabajo.
          </p>
        </div>

        {/* FAQ Accordion */}
        <section className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-cream-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-cream-50 transition-colors focus:outline-none focus:bg-cream-50"
                onClick={() => toggleQuestion(index)}
              >
                <h3 className="text-lg font-title text-gray-800 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <span
                    className={`transform transition-transform duration-200 text-cream-600 text-xl ${
                      openQuestion === index ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    +
                  </span>
                </div>
              </button>
              {openQuestion === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 font-body leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Contact CTA */}
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

        {/* Quick Tips */}
        <section className="mt-16">
          <h2 className="text-3xl font-title text-gray-800 text-center mb-12">
            Consejos Rápidos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-cream-200 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                <span className="text-cream-600 text-xl">💡</span>
              </div>
              <h3 className="text-lg font-title text-gray-800">Planifica con tiempo</h3>
              <p className="text-gray-600 font-body text-sm">
                Los buenos diseños necesitan tiempo. Programa tu consulta con anticipación.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-cream-200 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                <span className="text-cream-600 text-xl">🎨</span>
              </div>
              <h3 className="text-lg font-title text-gray-800">Trae referencias</h3>
              <p className="text-gray-600 font-body text-sm">
                Comparte imágenes e ideas que te inspiren para tu tatuaje.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-cream-200 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                <span className="text-cream-600 text-xl">✨</span>
              </div>
              <h3 className="text-lg font-title text-gray-800">Sigue las instrucciones</h3>
              <p className="text-gray-600 font-body text-sm">
                El cuidado posterior es crucial para el resultado final.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQs;
