import React from 'react';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  placeholder = 'Select option',
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-900 shadow-sm transition-all focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
          error ? 'border-rose-500 ring-1 ring-rose-500' : ''
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value || opt.id || opt} value={opt.value || opt.id || opt}>
            {opt.label || opt.name || opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};

export default Select;
