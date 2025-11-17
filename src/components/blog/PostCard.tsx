import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from './BlogPostCard';

interface PostCardProps {
  post: BlogPost;
  index: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  // Calcular delay de animación escalonado
  const animationDelay = `${index * 100}ms`;

  return (
    <Link to={`/blog/${post.id}`}>
      <article 
        className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in"
        style={{ animationDelay }}
      >
        {/* Image Container */}
        <div className="aspect-[16/10] bg-gradient-to-br from-cream-100 to-nude-100 overflow-hidden relative">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg 
                className="w-16 h-16 text-cream-400" 
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
          )}

          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-body uppercase tracking-wide shadow-md">
              Destacado
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category & Read Time */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-cream-600 font-body text-xs uppercase tracking-wide bg-cream-50 px-2 py-1 rounded">
              {post.category}
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-500 font-body text-xs">{post.readTime}</span>
          </div>

          {/* Title */}
          <h3 className="font-title text-xl text-gray-800 mb-3 group-hover:text-green-700 transition-colors line-clamp-2 min-h-[3.5rem]">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 font-body text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-cream-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-title">
                {post.author?.charAt(0) || 'N'}
              </div>
              <div className="flex flex-col">
                <span className="text-gray-700 font-body text-xs font-medium">{post.author}</span>
                <span className="text-gray-500 font-body text-xs">{post.date}</span>
              </div>
            </div>
            
            <span className="text-green-600 text-sm font-body group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
              Leer más 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
