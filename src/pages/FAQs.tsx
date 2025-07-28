import React, { useState, useRef, useEffect } from 'react';
import HeroSection from '../components/shared/HeroSection';
import heroVideo from '../assets/hero_video.mov';

const FAQs: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Función para normalizar texto (remover tildes y mayúsculas)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remueve diacríticos/tildes
  };

  // Función para buscar en faqData
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }

    const normalizedTerm = normalizeText(term);

    const results = faqData
      .map((faq, index) => {
        const searchText = normalizeText(`${faq.question} ${faq.answer}`);
        return searchText.includes(normalizedTerm) ? index : -1;
      })
      .filter(index => index !== -1);

    setSearchResults(results);
  };

  // Función para hacer scroll a una pregunta específica
  const scrollToQuestion = (index: number) => {
    const element = faqRefs.current[index];
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      setOpenQuestion(index);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  // Inicializar refs array
  useEffect(() => {
    faqRefs.current = faqRefs.current.slice(0, faqData.length);
  }, [faqData.length]);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        video={heroVideo}
        content={
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-title text-white mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-body mb-8 leading-relaxed">
              Encuentra respuestas rápidas a tus dudas sobre tatuajes
            </p>
            
            {/* Buscador */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Buscar preguntas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-6 py-4 lead rounded-full text-gray-800 font-body placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cream-400 shadow-lg"
              />
              
              
              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-cream-200 max-h-60 overflow-y-auto z-50">
                  {searchResults.map((resultIndex) => (
                    <button
                      key={resultIndex}
                      onClick={() => scrollToQuestion(resultIndex)}
                      className="w-full text-left px-4 py-3 hover:bg-cream-50 transition-colors border-b border-cream-100 last:border-b-0"
                    >
                      <div className="font-title text-gray-800 text-sm">
                        {faqData[resultIndex].question}
                      </div>
                      <div className="font-body text-gray-600 text-xs mt-1 line-clamp-2">
                        {faqData[resultIndex].answer.substring(0, 100)}...
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        {/* FAQ Accordion */}
        <section className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              ref={(el) => { faqRefs.current[index] = el; }}
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

      
      </div>
    </div>
    </>
  );
};

export default FAQs;
