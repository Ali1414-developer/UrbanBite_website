import React from 'react';

export const Loader = ({ size = 'md', label = 'Loading UrbanBite...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-14 w-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className={`animate-spin rounded-full border-rose-600 border-t-transparent ${sizeClasses[size] || sizeClasses.md}`}></div>
      {label && <p className="mt-3 text-sm font-medium text-slate-600">{label}</p>}
    </div>
  );
};

export default Loader;
