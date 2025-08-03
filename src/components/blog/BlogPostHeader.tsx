import React from 'react';
import { Link } from 'react-router-dom';
import { Title, Subtitle } from '../shared';
import HeroSection from '../shared/HeroSection';
import { type BlogPost } from './BlogPostCard';

interface BlogPostHeaderProps {
  post: BlogPost;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const heroContent = (
    <div className="px-4">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center justify-center gap-2 text-sm font-body text-white/80">
          <Link 
            to="/blog" 
            className="hover:text-white transition-colors"
          >
            Blog
          </Link>
          <span>•</span>
          <span className="text-white/90">{post.category}</span>
          <span>•</span>
          <span className="text-white/60 truncate max-w-xs">{post.title}</span>
        </div>
      </nav>

      {/* Header del artículo */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
            {post.category}
          </span>
          <span className="text-white/60">•</span>
          <span className="text-white/80 font-body">{post.readTime}</span>
        </div>

        <Title variant="titlePage" as="h1" className="mb-6 text-white drop-shadow-lg">
          {post.title}
        </Title>

        <Subtitle variant="large" className="text-white/90 max-w-3xl mx-auto mb-8 drop-shadow">
          {post.excerpt}
        </Subtitle>

        <div className="flex items-center justify-center gap-6 text-sm text-white/70 font-body mb-8">
          <span>Publicado el {formatDate(post.date)}</span>
          <span>•</span>
          <span>Por {post.author || 'Natalia Heller'}</span>
        </div>

        {/* Tags del artículo */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2 justify-center">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <HeroSection 
      image={post.image || '/images/default-blog-hero.jpg'} 
      content={heroContent} 
    />
  );
};

export default BlogPostHeader;
