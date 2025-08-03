import React, { useState, useMemo } from 'react';
import { Section, Title } from '../shared';
import CategoryFilter from './CategoryFilter';
import FeaturedCarousel from './FeaturedCarousel';
import BlogGrid from './BlogGrid';
import { type BlogPost } from './BlogPostCard';

interface BlogPostsSectionProps {
  posts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
}

const BlogPostsSection: React.FC<BlogPostsSectionProps> = ({ posts, onPostClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map(post => post.category))];
    return uniqueCategories.sort();
  }, [posts]);

  // Filtrar posts por categoría
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return posts;
    }
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  // Posts destacados para el carrusel (los más recientes)
  const featuredPosts = useMemo(() => {
    return [...filteredPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [filteredPosts]);

  // Posts para la grilla (excluyendo los que están en el carrusel)
  const gridPosts = useMemo(() => {
    const featuredIds = new Set(featuredPosts.map(post => post.id));
    return filteredPosts.filter(post => !featuredIds.has(post.id));
  }, [filteredPosts, featuredPosts]);

  return (
    <Section>
      <div className="text-center mb-12">
        <Title variant="titleSection" as="h2" className="mb-6">
          Artículos y Reflexiones
        </Title>
        <p className="text-gray-600 font-body max-w-2xl mx-auto">
          Explora mi colección de artículos sobre técnicas, cuidados,
          inspiración y todo lo relacionado con el arte del tatuaje.
        </p>
      </div>

      {/* Carrusel de posts destacados */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <FeaturedCarousel
            posts={featuredPosts}
            onPostClick={onPostClick}
          />
        </div>
      )}
      
      {/* Filtros de categoría */}
      <div className="flex justify-center mb-12">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>



      {/* Grilla de posts */}
      {gridPosts.length > 0 && (
        <div>
          <h3 className="text-xl font-title text-gray-800 mb-8">
            Más Artículos
          </h3>
          <BlogGrid
            posts={gridPosts}
            onPostClick={onPostClick}
          />
        </div>
      )}

      {/* Estado vacío */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-title text-gray-600 mb-2">
            No hay artículos en esta categoría
          </h3>
          <p className="text-gray-500 font-body">
            Intenta seleccionar una categoría diferente o vuelve más tarde.
          </p>
        </div>
      )}
    </Section>
  );
};

export default BlogPostsSection;
