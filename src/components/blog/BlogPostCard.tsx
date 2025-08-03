import React from 'react';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;
  featured?: boolean;
}

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'carousel' | 'grid';
  onClick?: (post: BlogPost) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ 
  post, 
  variant = 'grid',
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(post);
    }
  };

  if (variant === 'carousel') {
    return (
      <article 
        className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
        onClick={handleClick}
      >
        <div className="aspect-[16/10] bg-cream-200 overflow-hidden">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-cream-600">Imagen del artículo</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-cream-600 text-xs uppercase tracking-wide bg-cream-100 px-2 py-1 rounded">
              {post.category}
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-500 text-xs">{post.readTime}</span>
          </div>
          <h3 className="text-xl font-title text-gray-800 mb-3 group-hover:text-cream-700 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 font-body text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">{post.date}</span>
            <span className="text-cream-600 text-sm group-hover:text-cream-700 transition-colors">
              Leer más →
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Grid variant
  return (
    <article 
      className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="aspect-[16/10] bg-cream-200 overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-cream-600 font-body text-sm">Imagen del artículo</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-cream-600 font-body text-xs uppercase tracking-wide">
            {post.category}
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-gray-500 font-body text-xs">{post.readTime}</span>
        </div>
        <h3 className="text-lg font-title text-gray-800 mb-2 group-hover:text-cream-700 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 font-body text-xs">{post.date}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
