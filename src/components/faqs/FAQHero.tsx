import React from 'react';
import HeroSection from '../shared/HeroSection';
import FAQSearch from './FAQSearch';
import heroVideo from '../../assets/hero_video.mov';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQHeroProps {
  searchTerm: string;
  searchResults: number[];
  faqData: FAQ[];
  onSearch: (term: string) => void;
  onSelectResult: (index: number) => void;
}

const FAQHero: React.FC<FAQHeroProps> = ({
  searchTerm,
  searchResults,
  faqData,
  onSearch,
  onSelectResult
}) => {
  return (
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
          
          <FAQSearch
            searchTerm={searchTerm}
            searchResults={searchResults}
            faqData={faqData}
            onSearch={onSearch}
            onSelectResult={onSelectResult}
          />
        </div>
      }
    />
  );
};

export default FAQHero;
