import React, { useState } from 'react';
import { Title, Subtitle, Button, Section } from '@/components/shared';

// FAQ Section - Props Interface
interface FAQItemProps {
  question: string;
  answer: string;
  delay?: string;
}

// FAQ Item Component
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, delay = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
                 border border-cream-200 overflow-hidden ${delay}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex items-center justify-between 
                 hover:bg-cream-50 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <Title 
          as="h3" 
          variant="titleCard" 
          className="text-cream-800 pr-4"
        >
          {question}
        </Title>
        <span 
          className={`text-green-600 text-2xl font-bold transform transition-transform duration-300 
                     flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 pt-2">
          <Subtitle 
            variant="small" 
            className="text-cream-700 leading-relaxed"
          >
            {answer}
          </Subtitle>
        </div>
      </div>
    </div>
  );
};

const HomeFAQSection: React.FC = () => {
  const faqs: Array<{ question: string; answer: string }> = [
    {
      question: '¿Cuál es el rango de precios para un tatuaje?',
      answer: 'Los precios varían según el tamaño, complejidad y tiempo estimado. Un tatuaje pequeño comienza desde $5,000 ARS, mientras que diseños más elaborados pueden requerir una consulta personalizada. Contactanos para obtener un presupuesto ajustado a tu proyecto específico.'
    },
    {
      question: '¿Cómo funciona el proceso de reserva y diseño?',
      answer: 'Primero agendas una consulta donde discutimos tu idea. Luego creo un diseño personalizado que revisamos juntos. Una vez aprobado, reservamos tu cita con una seña del 30%. El día del tatuaje, finalizamos los detalles y comenzamos el trabajo en un ambiente profesional y seguro.'
    }
  ];

  return (
    <div className="relative bg-gradient-to-b from-cream-100 to-cream-50">
      <Section className="md:py-24">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <Title 
            as="h2" 
            variant="titleSection" 
            className="text-cream-800 mb-4 animate-fade-in"
          >
            ¿Tenés dudas? Te ayudo
          </Title>
          <Subtitle 
            variant="medium" 
            className="text-cream-600 max-w-2xl mx-auto animate-fade-in animation-delay-150"
          >
            Respondí las preguntas más frecuentes para que tomes la mejor decisión. 
            Si tienes más dudas, hablemos personalmente.
          </Subtitle>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              delay={`animate-fade-in animation-delay-${index * 150 + 300}`}
            />
          ))}
        </div>

        {/* CTA Terciario */}
        <div className="text-center animate-fade-in animation-delay-600">
          <Button 
            variant="outline" 
            size="large"
            as="link"
            to="/faqs"
            className="font-body border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
          >
            PREGUNTAS FRECUENTES (FAQs)
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default HomeFAQSection;
