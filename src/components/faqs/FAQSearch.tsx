import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSearchProps {
  searchTerm: string;
  searchResults: number[];
  faqData: FAQ[];
  onSearch: (term: string) => void;
  onSelectResult: (index: number) => void;
}

const FAQSearch: React.FC<FAQSearchProps> = ({
  searchTerm,
  searchResults,
  faqData,
  onSearch,
  onSelectResult
}) => {
  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        placeholder="Buscar preguntas..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-6 py-4 rounded-full text-gray-800 font-body placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cream-400 shadow-lg"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <span className="text-gray-400">🔍</span>
      </div>
      
      {/* Resultados de búsqueda */}
      {searchResults.length > 0 && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-cream-200 max-h-60 overflow-y-auto z-50">
          {searchResults.map((resultIndex) => (
            <button
              key={resultIndex}
              onClick={() => onSelectResult(resultIndex)}
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
  );
};

export default FAQSearch;
