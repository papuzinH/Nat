import React from 'react';
import { Layout, HeroSection, Title, Subtitle } from '@/components/shared';
import { PostCard } from '@/components/blog';
import { useBlogLogic } from '@/hooks/useBlogLogic';
import heroBlogImage from '@/assets/hero_room_image.webp';

const Blog: React.FC = () => {
  const { posts, loading, error } = useBlogLogic();

  // Hero Content
  const heroContent = (
    <div className="max-w-5xl mx-auto text-center px-4">
      {/* Decorative Icon */}
      <div className="mb-8 animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-white/30">
          <svg 
            className="w-10 h-10 text-white" 
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

      {/* Title */}
      <h1 className="font-title text-4xl md:text-5xl lg:text-6xl text-white mb-6 animate-fade-in animation-delay-150">
        Blog: Guías, Reflexiones y el Universo del Tatuaje
      </h1>
      
      {/* Subtitle */}
      <p className="font-body text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in animation-delay-300">
        Comparto mi proceso creativo, técnicas profesionales y las inspiraciones que guían mi arte. 
        Descubre consejos, tutoriales y reflexiones sobre el mundo del tatuaje.
      </p>

      {/* Stats */}
      <div className="flex justify-center gap-8 md:gap-12 mt-10 animate-fade-in animation-delay-450">
        <div className="text-center">
          <div className="font-title text-3xl md:text-4xl text-white font-bold">10+</div>
          <div className="font-body text-sm md:text-base text-white/80 mt-1">Artículos</div>
        </div>
        <div className="text-center">
          <div className="font-title text-3xl md:text-4xl text-white font-bold">5</div>
          <div className="font-body text-sm md:text-base text-white/80 mt-1">Categorías</div>
        </div>
        <div className="text-center">
          <div className="font-title text-3xl md:text-4xl text-white font-bold">8 min</div>
          <div className="font-body text-sm md:text-base text-white/80 mt-1">Lectura Promedio</div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection image={heroBlogImage} content={heroContent} />

      {/* Blog Posts Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-cream-50 to-nude-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Title variant="titleSection" as="h2">
              Últimos Artículos
            </Title>
            <Subtitle variant="medium">
              Explora contenido exclusivo sobre arte, técnicas y mi universo creativo
            </Subtitle>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((skeleton) => (
                <div 
                  key={skeleton}
                  className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[16/10] bg-cream-200" />
                  <div className="p-5">
                    <div className="h-4 bg-cream-200 rounded w-1/4 mb-3" />
                    <div className="h-6 bg-cream-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-cream-200 rounded w-full mb-2" />
                    <div className="h-4 bg-cream-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <svg 
                className="w-12 h-12 text-red-500 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="font-body text-red-700 text-lg">{error}</p>
              <p className="font-body text-red-600 text-sm mt-2">Por favor, intenta recargar la página.</p>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="bg-cream-100 border border-cream-200 rounded-lg p-12 text-center">
              <svg 
                className="w-16 h-16 text-cream-400 mx-auto mb-4" 
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
              <p className="font-body text-cream-700 text-lg">No hay artículos disponibles en este momento.</p>
              <p className="font-body text-cream-600 text-sm mt-2">¡Pronto compartiré nuevo contenido!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
