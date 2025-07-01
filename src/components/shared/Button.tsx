import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  as?: 'button' | 'link';
  to?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled = false,
  isLoading = false,
  as = 'button',
  to,
  href,
  target,
  onClick,
  type = 'button'
}) => {
  const baseClasses = 'font-body inline-flex items-center justify-center rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-cream-600 text-white hover:bg-cream-700 focus:ring-cream-500 shadow-sm',
    secondary: 'bg-cream-100 text-cream-800 hover:bg-cream-200 focus:ring-cream-500 border border-cream-300',
    outline: 'border-2 border-cream-600 text-cream-600 hover:bg-cream-600 hover:text-white focus:ring-cream-500 bg-transparent',
    ghost: 'text-cream-600 hover:bg-cream-50 hover:text-cream-700 focus:ring-cream-500 bg-transparent'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </>
  );

  if (as === 'link' && to) {
    return (
      <Link 
        to={to} 
        className={combinedClasses}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  if (as === 'link' && href) {
    return (
      <a 
        href={href} 
        target={target}
        className={combinedClasses}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
