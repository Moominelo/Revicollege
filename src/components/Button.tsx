
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg focus:ring-indigo-500",
    secondary: "bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg focus:ring-teal-500",
    outline: "border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 focus:ring-indigo-500 bg-white",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md focus:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs sm:text-sm",
    md: "px-5 py-3 text-sm sm:text-base", // Légèrement réduit sur mobile pour l'alignement
    lg: "px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg w-full sm:w-auto" // Pleine largeur souvent sur mobile
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
