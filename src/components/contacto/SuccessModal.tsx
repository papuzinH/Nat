import React, { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 transform animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-title text-gray-800 mb-4">
            ¡Mensaje Enviado!
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 font-body leading-relaxed mb-6">
            Gracias por contactarme. Te responderé dentro de 24-48 horas.
          </p>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-cream-600 text-white px-6 py-3 rounded-lg font-body hover:bg-cream-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cream-500 focus:ring-offset-2"
          >
            Entendido
          </button>
        </div>
        
        {/* Close X Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
