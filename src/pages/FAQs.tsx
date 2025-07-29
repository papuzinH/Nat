import React from 'react';
import {
  FAQHero,
  FAQAccordion,
  FAQContactCTA,
  useFAQLogic
} from '../components/faqs';

const FAQs: React.FC = () => {
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

  const {
    openQuestion,
    searchTerm,
    searchResults,
    faqRefs,
    handleSearch,
    scrollToQuestion,
    toggleQuestion
  } = useFAQLogic(faqData);

  return (
    <div className="min-h-screen">
      <FAQHero
        searchTerm={searchTerm}
        searchResults={searchResults}
        faqData={faqData}
        onSearch={handleSearch}
        onSelectResult={scrollToQuestion}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <FAQAccordion
            faqData={faqData}
            openQuestion={openQuestion}
            faqRefs={faqRefs}
            onToggleQuestion={toggleQuestion}
          />

          <FAQContactCTA />
          
        </div>
      </div>
    </div>
  );
};

export default FAQs;
