import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onCategoryChange('Todos')}
        className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
          selectedCategory === 'Todos'
            ? 'bg-cream-600 text-white shadow-md'
            : 'bg-cream-100 text-cream-700 hover:bg-cream-200'
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
            selectedCategory === category
              ? 'bg-cream-600 text-white shadow-md'
              : 'bg-cream-100 text-cream-700 hover:bg-cream-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
