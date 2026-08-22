import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10',
    outline: 'border-2 border-slate-200 hover:border-rose-600 hover:text-rose-600 text-slate-700 bg-transparent',
    ghost: 'hover:bg-slate-100 text-slate-700 hover:text-rose-600',
    amber: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-md shadow-amber-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
