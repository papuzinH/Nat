import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqData: FAQ[];
  openQuestion: number | null;
  faqRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onToggleQuestion: (index: number) => void;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  faqData,
  openQuestion,
  faqRefs,
  onToggleQuestion
}) => {
  return (
    <section className="space-y-6">
      {faqData.map((faq, index) => (
        <div
          key={index}
          ref={(el) => { faqRefs.current[index] = el; }}
          className={`group bg-white border border-cream-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
            openQuestion === index ? 'ring-1 ring-cream-300 shadow-md' : ''
          }`}
        >
          {/* Header */}
          <button
            className={`w-full px-8 py-6 text-left flex justify-between items-center transition-all duration-300 focus:outline-none ${
              openQuestion === index 
                ? 'bg-gradient-to-r from-cream-50 to-cream-25 border-b border-cream-150' 
                : 'hover:bg-cream-25 group-hover:bg-cream-25'
            }`}
            onClick={() => onToggleQuestion(index)}
            aria-expanded={openQuestion === index}
            aria-controls={`faq-answer-${index}`}
          >
            <h3 className={`text-lg font-title pr-6 transition-colors duration-300 ${
              openQuestion === index ? 'text-cream-800' : 'text-gray-800 group-hover:text-cream-700'
            }`}>
              {faq.question}
            </h3>
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                openQuestion === index 
                  ? 'bg-cream-200 text-cream-700 rotate-45' 
                  : 'bg-cream-100 text-cream-600 group-hover:bg-cream-150 group-hover:text-cream-700'
              }`}>
                <span className="text-lg font-light">+</span>
              </div>
            </div>
          </button>
          
          {/* Body with smooth animation */}
          <div
            id={`faq-answer-${index}`}
            className={`overflow-hidden transition-all duration-500 ease-out ${
              openQuestion === index 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className={`px-8 py-6 bg-gradient-to-b from-white to-cream-15 transform transition-all duration-500 ${
              openQuestion === index ? 'translate-y-0' : '-translate-y-2'
            }`}>
              <p className="text-gray-700 font-body leading-relaxed text-[15px]">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FAQAccordion;
