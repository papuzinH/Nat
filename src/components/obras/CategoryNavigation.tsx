import React from 'react';
import { Link } from 'react-router-dom';
import { Title, Section } from '@/components/shared';

interface TipoObra {
  id: string;
  title: string;
  image: string;
  route: string;
}

interface CategoryNavigationProps {
  tiposObras: TipoObra[];
  currentRoute: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ tiposObras, currentRoute }) => {
  const otherCategories = tiposObras.filter(obra => obra.route !== currentRoute);

  return (
    <Section className="py-12 border-t border-cream-200">
      <Title variant="titleSection" as="h3" className="mb-8 text-center text-brown-800">
        Explora otras Técnicas
      </Title>
      
      <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory">
        {otherCategories.map((category) => (
          <Link 
            key={category.id} 
            to={category.route}
            className="flex-none w-64 snap-center group"
          >
            <div className="relative h-40 rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
              <img 
                src={category.image} 
                alt={category.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
            <h4 className="text-center font-title text-lg text-brown-700 group-hover:text-green-700 transition-colors">
              {category.title}
            </h4>
          </Link>
        ))}
      </div>
    </Section>
  );
};

export default CategoryNavigation;
