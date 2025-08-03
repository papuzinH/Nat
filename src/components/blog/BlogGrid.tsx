import React, { useState } from 'react';
import BlogPostCard, { type BlogPost } from './BlogPostCard';
import { Button } from '../shared';

interface BlogGridProps {
  posts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({ posts, onPostClick }) => {
  const [visiblePosts, setVisiblePosts] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

  const loadMorePosts = () => {
    setIsLoading(true);
    // Simular carga
    setTimeout(() => {
      setVisiblePosts(prev => prev + 6);
      setIsLoading(false);
    }, 500);
  };

  const hasMorePosts = visiblePosts < posts.length;

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {posts.slice(0, visiblePosts).map((post) => (
          <BlogPostCard 
            key={post.id} 
            post={post} 
            variant="grid" 
            onClick={onPostClick}
          />
        ))}
      </div>

      {hasMorePosts && (
        <div className="text-center">
          <Button
            onClick={loadMorePosts}
            disabled={isLoading}
            variant="outline"
            size="large"
            className="min-w-[200px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-cream-600 border-t-transparent rounded-full animate-spin"></div>
                Cargando...
              </div>
            ) : (
              'Ver más artículos'
            )}
          </Button>
        </div>
      )}

      {!hasMorePosts && posts.length > 9 && (
        <div className="text-center text-gray-500 font-body">
          Has visto todos los artículos disponibles
        </div>
      )}
    </div>
  );
};

export default BlogGrid;
