import { useState, useRef, useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

export const useFAQLogic = (faqData: FAQ[]) => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Función para toggle pregunta
  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  // Inicializar refs array
  useEffect(() => {
    faqRefs.current = faqRefs.current.slice(0, faqData.length);
  }, [faqData.length]);

  return {
    openQuestion,
    searchTerm,
    searchResults,
    faqRefs,
    handleSearch,
    scrollToQuestion,
    toggleQuestion
  };
};
