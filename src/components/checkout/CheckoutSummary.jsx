import React from 'react';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency';
import Button from '../common/Button';

export const CheckoutSummary = ({ isSubmitting, onPlaceOrder }) => {
  const { cartItems, subtotal, discount, tax, deliveryFee, total } = useCart();

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Final Order Review</h3>

      {/* Items List Mini */}
      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div key={`${item.id}-${JSON.stringify(item.options || {})}`} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-rose-600">{item.quantity}x</span>
              <span className="font-semibold text-slate-800 line-clamp-1">{item.name}</span>
            </div>
            <span className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>GST Tax (16%)</span>
          <span className="font-semibold text-slate-900">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span className="font-semibold text-slate-900">
            {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
          <span>Total To Pay</span>
          <span className="text-rose-600">{formatCurrency(total)}</span>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        size="lg"
        isLoading={isSubmitting}
        onClick={onPlaceOrder}
      >
        Place Order Now
      </Button>
    </div>
  );
};

export default CheckoutSummary;
