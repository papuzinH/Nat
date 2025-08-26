import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPostDetail } from '../components/blog';
import { type BlogPost } from '../components/blog';
import { useBlogLogic } from '../hooks/useBlogLogic';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, loading } = useBlogLogic();
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!loading && posts.length > 0 && id) {
      const postId = parseInt(id);
      const foundPost = posts.find(post => post.id === postId);
      
      if (foundPost) {
        setCurrentPost(foundPost);
        
        // Encontrar posts relacionados (misma categoría, excluyendo el actual)
        const related = posts
          .filter(post => 
            post.category === foundPost.category && 
            post.id !== foundPost.id
          )
          .slice(0, 3);
        
        setRelatedPosts(related);
      } else {
        // Post no encontrado, redirigir al blog
        navigate('/blog', { replace: true });
      }
    }
  }, [id, posts, loading, navigate]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cream-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-body">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-title text-gray-800 mb-4">
            Artículo no encontrado
          </h2>
          <p className="text-gray-600 font-body mb-6">
            El artículo que buscas no existe o ha sido movido.
          </p>
          <button 
            onClick={() => navigate('/blog')}
            className="bg-cream-600 text-white px-6 py-3 rounded-md hover:bg-cream-700 transition-colors"
          >
            Volver al Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <BlogPostDetail
      post={currentPost}
      relatedPosts={relatedPosts}
    />
  );
};

export default BlogPostPage;
