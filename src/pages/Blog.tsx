import React from 'react';
import { 
  BlogHero, 
  BlogIntroduction, 
  BlogPostsSection 
} from '../components/blog';
import { useBlogLogic } from '../hooks/useBlogLogic';

const Blog: React.FC = () => {
  const { posts, loading, handlePostClick } = useBlogLogic();

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cream-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-body">Cargando artículos...</p>
          </div>
        </div>
    );
  }


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <BlogHero />
      
      {/* Introduction Section */}
      <BlogIntroduction />
      
      {/* Posts Section */}
      <BlogPostsSection 
        posts={posts} 
        onPostClick={handlePostClick} 
      />
    </div>
  );
};

export default Blog;
