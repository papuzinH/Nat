import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  variant?: 'titlePage' | 'titleSection' | 'titleCard';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title: React.FC<TitleProps> = ({ 
  children, 
  variant = 'titleSection', 
  className = '', 
  as = 'h2' 
}) => {
  const baseClasses = 'font-title text-gray-800';
  
  const variantClasses = {
    titlePage: 'text-4xl md:text-5xl lg:text-6xl leading-tight',
    titleSection: 'text-2xl md:text-3xl lg:text-4xl leading-tight',
    titleCard: 'text-lg md:text-xl lg:text-2xl leading-snug'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  const Component = as;

  return (
    <Component className={combinedClasses}>
      {children}
    </Component>
  );
};

export default Title;
