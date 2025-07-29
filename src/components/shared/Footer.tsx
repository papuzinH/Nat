import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isTransparent = location.pathname === '/' || location.pathname === '/contacto';

  return (
    <footer className={`mt-auto transition-all duration-300 ${
      isTransparent 
        ? 'bg-black/20 backdrop-blur-md border-t border-white/20' 
        : 'bg-cream-100/50 backdrop-blur-sm border-t border-cream-200'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className={`text-xl font-title ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
              Natalia Heller
            </h3>
            <p className={`text-sm font-body leading-relaxed ${
              isTransparent ? 'text-white/80' : 'text-gray-600'
            }`}>
              Artista y tatuadora especializada en crear obras únicas que capturan la esencia 
              y personalidad de cada cliente.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className={`text-lg font-title ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
              Enlaces rápidos
            </h4>
            <nav className="space-y-2">
              <Link 
                to="/obras" 
                className={`block transition-colors text-sm font-body ${
                  isTransparent 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-gray-600 hover:text-cream-600'
                }`}
              >
                Obras
              </Link>
              <Link 
                to="/tattoo" 
                className={`block transition-colors text-sm font-body ${
                  isTransparent 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-gray-600 hover:text-cream-600'
                }`}
              >
                Tattoo
              </Link>
              <Link 
                to="/sobre-mi" 
                className={`block transition-colors text-sm font-body ${
                  isTransparent 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-gray-600 hover:text-cream-600'
                }`}
              >
                Sobre mi
              </Link>
              <Link 
                to="/contacto" 
                className={`block transition-colors text-sm font-body ${
                  isTransparent 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-gray-600 hover:text-cream-600'
                }`}
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className={`text-lg font-title ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
              Contacto
            </h4>
            <div className={`space-y-2 text-sm font-body ${
              isTransparent ? 'text-white/80' : 'text-gray-600'
            }`}>
              <p>Email: contacto@nataliaheller.com</p>
              <p>Instagram: @nataliaheller.art</p>
              <p>Ubicación: Buenos Aires, Argentina</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 ${
          isTransparent ? 'border-t border-white/20' : 'border-t border-cream-200'
        }`}>
          <p className={`text-sm font-body ${
            isTransparent ? 'text-white/70' : 'text-gray-500'
          }`}>
            © {currentYear} Natalia Heller. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link 
              to="/faqs" 
              className={`text-sm font-body transition-colors ${
                isTransparent 
                  ? 'text-white/70 hover:text-white' 
                  : 'text-gray-500 hover:text-cream-600'
              }`}
            >
              FAQs
            </Link>
            <span className={`text-sm font-body ${
              isTransparent ? 'text-white/70' : 'text-gray-500'
            }`}>
              Política de Privacidad
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
