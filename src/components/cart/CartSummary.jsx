import React, { useState } from 'react';
import { Tag, Check } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency';
import Button from '../common/Button';

export const CartSummary = ({ onProceedCheckout }) => {
  const { subtotal, discount, tax, deliveryFee, total, applyCoupon, couponCode } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'URBAN20') {
      applyCoupon('URBAN20');
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "URBAN20"');
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

      {/* Coupon Box */}
      <form onSubmit={handleApplyPromo} className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Have a Coupon?</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Code e.g. URBAN20"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs uppercase font-bold text-slate-900 focus:outline-none focus:border-rose-500"
          />
          <Button type="submit" size="sm" variant="secondary">
            Apply
          </Button>
        </div>
        {couponCode && (
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Check size={14} /> Voucher "{couponCode}" applied (20% OFF)
          </p>
        )}
        {promoError && <p className="text-xs text-rose-600">{promoError}</p>}
      </form>

      {/* Math Breakdown */}
      <div className="space-y-3 border-t border-slate-100 pt-4 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Promo Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Estimated GST Tax (16%)</span>
          <span className="font-semibold text-slate-900">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span className="font-semibold text-slate-900">
            {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
          <span>Grand Total</span>
          <span className="text-rose-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {onProceedCheckout && (
        <Button variant="primary" fullWidth size="lg" onClick={onProceedCheckout}>
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default CartSummary;
