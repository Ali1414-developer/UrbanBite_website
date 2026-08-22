import React from 'react';

export const Badge = ({ children, variant = 'rose', className = '' }) => {
  const variants = {
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    dark: 'bg-slate-900 text-white border-slate-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all ${
        variants[variant] || variants.rose
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
