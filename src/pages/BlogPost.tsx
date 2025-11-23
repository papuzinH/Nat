import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout, Title, Subtitle, Button, SchemaMarkup } from '@/components/shared';
import ContenidoText from '@/components/tattoo/ContenidoText';
import { useBlogPostLogic } from '@/hooks/useBlogPostLogic';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPostLogic(slug);

  // Loading State
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-cream-50">
          <div className="text-center px-4">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600 font-body text-lg">Cargando artículo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error or Post Not Found
  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-cream-50">
          <div className="text-center px-4 max-w-2xl mx-auto">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>

            <Title as="h1" variant="titlePage" className="text-gray-800 mb-4">
              404 - Artículo no encontrado
            </Title>
            
            <Subtitle variant="medium" className="text-gray-600 mb-8">
              {error || 'El artículo que buscas no existe o ha sido movido. Por favor, verifica la URL o explora otros contenidos.'}
            </Subtitle>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog">
                <Button variant="primary" size="large">
                  Ver todos los artículos
                </Button>
              </Link>
              <Link to="/contacto">
                <Button variant="outline" size="large">
                  Contáctame
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const articleSchema = {
    headline: post.title,
    image: post.image ? [post.image] : [],
    datePublished: post.date,
    dateModified: post.date,
    author: [{
      '@type': 'Person',
      name: post.author || 'Natalia Heller',
      url: 'https://tatuajesnaty.com/sobre-mi'
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Natalia Heller Tattoo Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tatuajesnaty.com/logo.png'
      }
    },
    description: post.excerpt,
    articleBody: Array.isArray(post.content) ? post.content.join(' ') : post.content
  };

  return (
    <Layout>
      <SchemaMarkup type="Article" data={articleSchema} />
      <div className="min-h-screen bg-gradient-to-b from-white via-cream-50 to-nude-50">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-cream-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm font-body">
              <Link 
                to="/blog" 
                className="text-cream-600 hover:text-green-600 transition-colors"
              >
                Blog
              </Link>
              <span className="text-cream-400">/</span>
              <span className="text-cream-800 font-medium line-clamp-1">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-6 animate-fade-in">
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-body uppercase tracking-wide">
                {post.category}
              </span>
            </div>

            {/* Title - H1 for SEO */}
            <h1 className="font-title text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight animate-fade-in animation-delay-150">
              {post.title}
            </h1>

            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-cream-200 animate-fade-in animation-delay-300">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-title text-lg shadow-md">
                  {post.author?.charAt(0) || 'N'}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-body font-semibold">{post.author || 'Natalia Heller'}</span>
                  <span className="text-gray-500 font-body text-sm">Artista & Tatuadora</span>
                </div>
              </div>

              <span className="text-gray-300">•</span>

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-600 font-body text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={post.date}>{post.date}</time>
              </div>

              <span className="text-gray-300">•</span>

              {/* Read Time */}
              <div className="flex items-center gap-2 text-gray-600 font-body text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime} de lectura</span>
              </div>
            </div>

            {/* Featured Image (if exists) */}
            {post.image && (
              <div className="mb-12 rounded-xl overflow-hidden shadow-2xl animate-fade-in animation-delay-450">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Article Content - SEO Critical */}
            <div className="prose prose-lg max-w-none mb-12 animate-fade-in animation-delay-600">
              <ContenidoText content={post.content} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12 pb-8 border-b border-cream-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-600 font-body text-sm font-medium mr-2">Etiquetas:</span>
                  {post.tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-cream-100 text-cream-700 rounded-md text-sm font-body hover:bg-cream-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA de Conversión */}
            <div className="bg-gradient-to-br from-green-50 to-cream-50 rounded-2xl p-8 md:p-12 border border-green-100 shadow-lg text-center">
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                    />
                  </svg>
                </div>
              </div>

              <h2 className="font-title text-2xl md:text-3xl text-gray-900 mb-4">
                ¿Te inspiraste? Charlemos sobre tu tatuaje
              </h2>
              
              <p className="font-body text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Cada diseño cuenta una historia única. Si este artículo te inspiró y estás listo para crear tu próximo tatuaje, me encantaría escuchar tu idea y trabajar juntas en algo especial.
              </p>

              <Link to="/contacto">
                <Button variant="primary" size="large" className="shadow-xl hover:shadow-2xl">
                  Agenda tu consulta gratuita
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;
