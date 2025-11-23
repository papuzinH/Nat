import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/30 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between lg:justify-center items-center py-4 ${isScrolled ? '!py-2' : ''}`}>
          
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="lg:hidden">
            <Link
              to="/"
              className="text-2xl text-white font-bold tracking-widest"
              style={{ fontFamily: "'Aboreto', serif" }}
              onClick={() => setIsMenuOpen(false)}
            >
              NATALIA HELLER
            </Link>
          </div>

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
            className={`lg:hidden p-2 transition-colors duration-200 focus:outline-none z-[60] relative ${
              isMenuOpen 
                ? 'text-white' 
                : (isScrolled ||'text-white hover:text-green-400' )
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-8 h-8 flex flex-col justify-center items-center gap-1.5">
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block w-8 h-0.5 bg-current origin-center"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-8 h-0.5 bg-current"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="block w-8 h-0.5 bg-current origin-center"
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed inset-0 bg-zinc-900/95 backdrop-blur-xl z-50 lg:hidden flex flex-col justify-center items-center"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-green-900 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brown-900 rounded-full blur-3xl"></div>
              </div>

              <div className="flex flex-col space-y-8 text-center relative z-10">
                {navigationItems.map((item) => (
                  <motion.div key={item.path} variants={itemVariants}>
                    <Link
                      to={item.path}
                      className={`text-3xl tracking-widest transition-all duration-300 block py-2 ${
                        isActivePath(item.path)
                          ? 'text-green-400 font-bold scale-110'
                          : 'text-cream-100 hover:text-green-300 hover:scale-105'
                      }`}
                      style={{ fontFamily: "'Aboreto', serif" }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div variants={itemVariants} className="pt-8">
                  <Link
                    to="/contacto"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block px-8 py-3 border-2 border-green-500 text-green-400 font-title tracking-wide hover:bg-green-500 hover:text-white transition-all duration-300 rounded-sm"
                  >
                    AGENDA TU CITA
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4 flex justify-center gap-6">
                  <a href="https://instagram.com/nataliaceller_art" target="_blank" rel="noopener noreferrer" className="text-cream-300 hover:text-green-400 transition-colors text-2xl">
                    <span className="sr-only">Instagram</span>
                    📸
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
