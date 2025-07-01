import React from 'react';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'El cuidado de tatuajes recién hechos',
      excerpt: 'Todo lo que necesitas saber para cuidar tu nuevo tatuaje durante las primeras semanas.',
      date: '15 de Junio, 2024',
      category: 'Cuidados'
    },
    {
      id: 2,
      title: 'Inspiración para tu próximo tatuaje',
      excerpt: 'Descubre las tendencias actuales y encuentra la inspiración para tu próxima obra de arte corporal.',
      date: '8 de Junio, 2024',
      category: 'Inspiración'
    },
    {
      id: 3,
      title: 'Técnicas de sombreado en tatuajes',
      excerpt: 'Una guía sobre las diferentes técnicas de sombreado que utilizo en mis trabajos.',
      date: '1 de Junio, 2024',
      category: 'Técnicas'
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-title text-gray-800 mb-6">
          Blog
        </h1>
        <p className="text-xl text-gray-600 font-body max-w-3xl mx-auto leading-relaxed">
          Comparto mis conocimientos, experiencias y reflexiones sobre 
          el mundo del arte y los tatuajes.
        </p>
      </div>

      {/* Featured Post */}
      <section className="mb-16">
        <article className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-cream-200 h-64 md:h-auto flex items-center justify-center">
              <span className="text-cream-600 font-body">Imagen destacada</span>
            </div>
            <div className="md:w-1/2 p-8">
              <span className="text-cream-600 font-body text-sm uppercase tracking-wide">Destacado</span>
              <h2 className="text-2xl font-title text-gray-800 mt-2 mb-4">
                Los fundamentos del diseño de tatuajes
              </h2>
              <p className="text-gray-600 font-body leading-relaxed mb-6">
                En este artículo profundo, exploro los principios fundamentales 
                que guían el diseño de tatuajes únicos y significativos...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-body text-sm">22 de Junio, 2024</span>
                <button className="text-cream-600 font-body hover:text-cream-700 transition-colors">
                  Leer más →
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Blog Posts Grid */}
      <section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-cream-200 h-48 flex items-center justify-center">
                <span className="text-cream-600 font-body">Imagen del post</span>
              </div>
              <div className="p-6">
                <span className="text-cream-600 font-body text-sm uppercase tracking-wide">
                  {post.category}
                </span>
                <h3 className="text-xl font-title text-gray-800 mt-2 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-body text-xs">{post.date}</span>
                  <span className="text-cream-600 font-body text-sm hover:text-cream-700 transition-colors">
                    Leer más →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="text-center mt-16 py-16 bg-cream-100 rounded-lg">
        <h2 className="text-3xl font-title text-gray-800 mb-6">
          Suscríbete al Newsletter
        </h2>
        <p className="text-gray-600 font-body mb-8 max-w-2xl mx-auto">
          Recibe las últimas actualizaciones del blog y contenido exclusivo directamente en tu email.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Tu email"
            className="flex-1 px-4 py-3 rounded-md border border-cream-300 focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent"
          />
          <button className="bg-cream-600 text-white px-6 py-3 rounded-md font-body hover:bg-cream-700 transition-colors">
            Suscribirse
          </button>
        </div>
      </section>
    </div>
  );
};

export default Blog;
