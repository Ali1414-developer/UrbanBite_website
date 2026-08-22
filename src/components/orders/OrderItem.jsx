import React from 'react';
import { formatCurrency } from '../../utils/currency';

export const OrderItem = ({ item }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0 text-xs">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 font-bold text-rose-600">
          {item.quantity}x
        </span>
        <div>
          <h4 className="font-bold text-slate-900">{item.name}</h4>
          {item.options?.instructions && (
            <p className="text-[10px] text-slate-400 italic">"{item.options.instructions}"</p>
          )}
        </div>
      </div>
      <span className="font-extrabold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
    </div>
  );
};

export default OrderItem;
