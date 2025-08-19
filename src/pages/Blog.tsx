import React from 'react';
import { HeroSection } from '../components/shared';
import heroVideo from '../assets/hero_video.mov';

const Blog: React.FC = () => {
  const comingSoonContent = (
    <div className="max-w-4xl mx-auto text-center px-4">
      {/* Decorative element */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
          <svg 
            className="w-12 h-12 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <h1 className="font-title text-4xl md:text-5xl lg:text-6xl text-white mb-6">
        Blog
      </h1>
      
      <h2 className="font-title text-2xl md:text-3xl text-white/90 mb-8">
        Próximamente
      </h2>
      
      <p className="font-body text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
        Estoy preparando un espacio especial donde compartiré mi proceso creativo, 
        técnicas de tatuaje, inspiraciones artísticas y mucho más.
      </p>
      
      <p className="font-body text-base md:text-lg text-white/70 mb-12">
        Muy pronto podrás explorar contenido exclusivo sobre arte y tatuajes.
      </p>

      {/* Call to action */}
      <div className="space-y-4">
        <a 
          href="/contacto" 
          className="inline-block bg-white/90 hover:bg-white text-gray-800 font-body text-lg px-8 py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
        >
          Contáctame mientras tanto
        </a>
        
        <div className="text-sm text-white/60 font-body">
          O explora mi <a href="/obras" className="text-white hover:text-white/80 underline">portafolio</a> y mis <a href="/tattoo" className="text-white hover:text-white/80 underline">tatuajes</a>
        </div>
      </div>

      {/* Decorative dots */}
      <div className="mt-16 flex justify-center space-x-2">
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
        <div className="w-2 h-2 bg-white/80 rounded-full"></div>
      </div>
    </div>
  );

  return <HeroSection video={heroVideo} content={comingSoonContent} />;
};

export default Blog;
