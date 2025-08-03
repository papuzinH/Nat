import React from 'react';

interface BlogTagsProps {
  tags: string[];
  variant?: 'default' | 'compact';
}

const BlogTags: React.FC<BlogTagsProps> = ({ tags, variant = 'default' }) => {
  if (!tags || tags.length === 0) return null;

  const tagClasses = variant === 'compact' 
    ? 'text-xs px-2 py-1 bg-cream-100 text-cream-700 rounded-full'
    : 'text-sm px-3 py-1 bg-cream-100 text-cream-700 rounded-full hover:bg-cream-200 transition-colors';

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`${tagClasses} font-medium`}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default BlogTags;
