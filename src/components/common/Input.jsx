import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  placeholder = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">{label}</label>}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${error ? 'border-rose-500 ring-1 ring-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
