import React from 'react';

interface SubtitleProps {
  children: React.ReactNode;
  variant?: 'large' | 'medium' | 'small';
  className?: string;
  as?: 'p' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}

const Subtitle: React.FC<SubtitleProps> = ({ 
  children, 
  variant = 'medium', 
  className = '', 
  as = 'p' 
}) => {
  const baseClasses = 'font-body text-gray-600 leading-relaxed';
  
  const variantClasses = {
    large: 'text-xl md:text-2xl',
    medium: 'text-lg md:text-xl',
    small: 'text-base md:text-lg'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  const Component = as;

  return (
    <Component className={combinedClasses}>
      {children}
    </Component>
  );
};

export default Subtitle;
