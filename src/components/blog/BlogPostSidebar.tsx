import React from 'react';
import { Link } from 'react-router-dom';
import Title from '../shared/Title';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date: string;
}

interface BlogPostSidebarProps {
  relatedPosts: RelatedPost[];
}

const BlogPostSidebar: React.FC<BlogPostSidebarProps> = ({ relatedPosts }) => {
  return (
    <aside className="lg:col-span-4">
      {/* Sobre la autora */}
      <div className="bg-cream-50 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/images/natalia-avatar.jpg"
            alt="Natalia Heller"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-title text-lg text-gray-900">Natalia Heller</h3>
            <p className="text-gray-600 font-body text-sm">Artista & Tatuadora</p>
          </div>
        </div>
        <p className="text-gray-700 font-body text-sm leading-relaxed mb-4">
          Artista visual especializada en tatuajes artísticos. Combino técnicas tradicionales 
          con un estilo contemporáneo único.
        </p>
        <div className="flex gap-3">
          <a
            href="https://instagram.com/nataliaheller"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream-600 hover:text-cream-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.897 3.708 13.746 3.708 12.45s.49-2.448 1.297-3.323c.875-.875 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.875.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.875-2.026 1.297-3.323 1.297zm7.83-1.297c-.875.875-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.875-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.875 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.875.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
            </svg>
          </a>
          <a
            href="mailto:contacto@nataliaheller.com"
            className="text-cream-600 hover:text-cream-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Posts relacionados */}
      {relatedPosts.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-cream-200">
          <Title variant="titleSection" className="mb-6">
            Artículos relacionados
          </Title>
          <div className="space-y-6">
            {relatedPosts.map((post) => (
              <article key={post.id} className="group">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="flex gap-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-title text-gray-900 group-hover:text-cream-600 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 font-body text-sm line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                      <time className="text-gray-500 font-body text-xs">
                        {new Date(post.date).toLocaleDateString('es', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default BlogPostSidebar;
