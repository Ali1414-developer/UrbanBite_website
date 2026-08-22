import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({
  quantity = 1,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  return (
    <div className={`inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 ${sizeClasses[size] || sizeClasses.md}`}>
      <button
        type="button"
        disabled={quantity <= min}
        onClick={onDecrease}
        className="text-slate-500 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-500 p-1"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
      <button
        type="button"
        disabled={quantity >= max}
        onClick={onIncrease}
        className="text-slate-500 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-500 p-1"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
