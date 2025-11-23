import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { HeaderObras, GridObras, Button, SchemaMarkup } from '@/components/shared';
import CategoryNavigation from '@/components/obras/CategoryNavigation';
import { obrasData } from '@/assets/obras/obras-data';
import { tiposObras } from '@/data/obras';

const ITEMS_PER_PAGE = 6;

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  
  const categoryData = obrasData.find(c => c.slug === slug);
  const categoryInfo = tiposObras.find(t => t.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
  }, [slug]);

  if (!categoryData) {
    return <Navigate to="/obras" replace />;
  }

  const collectionSchema = {
    name: categoryData.title,
    description: categoryData.description,
    url: `https://tatuajesnaty.com/obras/${slug}`,
    numberOfItems: categoryData.obras.length,
    itemListElement: categoryData.obras.map((obra, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: obra.title,
        image: obra.image,
        description: obra.description
      }
    }))
  };

  // Pagination Logic
  const totalPages = Math.ceil(categoryData.obras.length / ITEMS_PER_PAGE);
  const paginatedObras = categoryData.obras.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Smooth scroll to top of grid
    const gridElement = document.getElementById('obras-grid-anchor');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <SchemaMarkup type="CollectionPage" data={collectionSchema} />
      <HeaderObras 
        title={categoryData.title}
        description={categoryData.description}
        imagebg={categoryInfo?.image}
      />
      
      <div id="obras-grid-anchor" className="scroll-mt-24">
        <GridObras obras={paginatedObras} />
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 py-12 bg-cream-50/50">
          <Button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="small"
          >
            ← Anterior
          </Button>
          
          <span className="font-title text-brown-800 text-lg">
            {currentPage} <span className="text-brown-400 text-sm mx-1">/</span> {totalPages}
          </span>
          
          <Button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="small"
          >
            Siguiente →
          </Button>
        </div>
      )}
      
      <CategoryNavigation 
        tiposObras={tiposObras} 
        currentRoute={`/obras/${slug}`} 
      />
    </>
  );
};

export default CategoryPage;
