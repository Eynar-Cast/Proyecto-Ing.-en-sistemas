import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon: Icon,
  fullWidth = false,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'font-medium rounded-lg transition flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300',
    warning: 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-300',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:border-gray-300 disabled:text-gray-300'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className} ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;
