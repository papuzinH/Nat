import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/obras', label: 'Obras' },
    { path: '/tattoo', label: 'Tattoo' },
    { path: '/sobre-mi', label: 'Sobre mi' },
    { path: '/blog', label: 'Blog' },
    { path: '/faqs', label: 'FAQs' },
    { path: '/contacto', label: 'Contacto' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/30 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-center items-center py-4 ${isScrolled ? '!py-2' : ''}`}>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-16 items-center">
            {navigationItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-all duration-300 text-lg uppercase flex justify-center items-center ${isActivePath(item.path)
                  ? 'text-green-400 rounded-sm border-b-2 border-green-400'
                  : 'text-white hover:text-green-400'
                  }
                  ${isScrolled ? '!text-[1rem]' : ''}
                  `}
                style={{ fontFamily: "'Gayathri', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
            {/* Logo */}
            <div className={`transition-all duration-300 flex items-center justify-center w-16 h-16 bg-green-900 rounded-full shadow-lg border-2 border-green-800 hover:border-green-700 hover:shadow-lg cursor-pointer hover:bg-green-800 hover:scale-105
              ${isScrolled ? '!w-11 !h-11' : ''}
              `}>
              <Link
                to="/"
                className="text-2xl text-white transition-colors"
                style={{ fontFamily: "'Aboreto', serif" }}
              >
                N
              </Link>
            </div>
            {navigationItems.slice(3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-all duration-300 text-lg uppercase flex justify-center items-center ${isActivePath(item.path)
                  ? 'text-green-600 rounded-sm border-orange-600'
                  : 'text-white hover:text-green-600'
                  }
                  ${isScrolled ? '!text-[1rem]' : ''}`}
                style={{ fontFamily: "'Gayathri', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 transition-colors duration-200 focus:outline-none ${
              isScrolled 
                ? 'text-white hover:text-green-400' 
                : 'text-gray-700 hover:text-orange-600'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                  }`}
              />
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
              />
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`lg:hidden py-4 transition-colors duration-300 ${
            isScrolled 
              ? 'border-t border-white/20' 
              : 'border-t border-gray-200'
          }`}>
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm tracking-wide transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? isScrolled 
                        ? 'text-green-400' 
                        : 'text-orange-600'
                      : isScrolled
                        ? 'text-white hover:text-green-400'
                        : 'text-gray-700 hover:text-orange-600'
                    }`}
                  style={{ fontFamily: "'Gayathri', sans-serif" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
