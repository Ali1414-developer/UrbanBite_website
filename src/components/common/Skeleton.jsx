import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    title: 'h-6 w-3/4 rounded-lg',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-2xl',
    button: 'h-10 w-28 rounded-xl',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantStyles[variant] || variantStyles.text} ${className}`}
    />
  );
};

export default Skeleton;
