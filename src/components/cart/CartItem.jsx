import React from 'react';
import { Trash2 } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency';
import QuantitySelector from '../common/QuantitySelector';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
          {item.options?.instructions && (
            <p className="text-[11px] text-slate-500 italic mt-0.5">Note: "{item.options.instructions}"</p>
          )}
          <span className="text-xs font-black text-rose-600 mt-1 block">
            {formatCurrency(item.price)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => updateQuantity(item.id, item.quantity + 1, item.options)}
          onDecrease={() => updateQuantity(item.id, item.quantity - 1, item.options)}
          size="sm"
        />
        <div className="text-right">
          <span className="text-sm font-extrabold text-slate-900">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeFromCart(item.id, item.options)}
          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
