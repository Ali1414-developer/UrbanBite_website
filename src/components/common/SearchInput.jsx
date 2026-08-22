import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search delicious foods, burgers, pizzas...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm placeholder-slate-400 transition-all focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
