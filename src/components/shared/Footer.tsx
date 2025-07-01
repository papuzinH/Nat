import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cream-100/50 backdrop-blur-sm border-t border-cream-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-title text-gray-800">Natalia Heller</h3>
            <p className="text-gray-600 text-sm font-body leading-relaxed">
              Artista y tatuadora especializada en crear obras únicas que capturan la esencia 
              y personalidad de cada cliente.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-title text-gray-800">Enlaces rápidos</h4>
            <nav className="space-y-2">
              <Link 
                to="/obras" 
                className="block text-gray-600 hover:text-cream-600 transition-colors text-sm font-body"
              >
                Obras
              </Link>
              <Link 
                to="/tattoo" 
                className="block text-gray-600 hover:text-cream-600 transition-colors text-sm font-body"
              >
                Tattoo
              </Link>
              <Link 
                to="/sobre-mi" 
                className="block text-gray-600 hover:text-cream-600 transition-colors text-sm font-body"
              >
                Sobre mi
              </Link>
              <Link 
                to="/contacto" 
                className="block text-gray-600 hover:text-cream-600 transition-colors text-sm font-body"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-title text-gray-800">Contacto</h4>
            <div className="space-y-2 text-sm font-body text-gray-600">
              <p>Email: contacto@nataliaheller.com</p>
              <p>Instagram: @nataliaheller.art</p>
              <p>Ubicación: Buenos Aires, Argentina</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-500 font-body">
            © {currentYear} Natalia Heller. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link 
              to="/faqs" 
              className="text-sm text-gray-500 hover:text-cream-600 transition-colors font-body"
            >
              FAQs
            </Link>
            <span className="text-sm text-gray-500 font-body">
              Política de Privacidad
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
