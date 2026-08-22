import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChefHat,
  Tag,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { formatPrice } from '../utils/currency';

export const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totals, promoCode, applyPromoCode, removePromoCode, clearCart } =
    useCart();
  const { isAuthenticated, promptLogin } = useAuth();
  const { selectedBranch, setIsLocationModalOpen } = useLocation();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyPromoCode(couponInput);
    if (success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      promptLogin('/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-stone-50 text-center">
        <div className="w-24 h-24 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-stone-500 text-sm sm:text-base max-w-md mb-8">
          Looks like you haven't added anything to your bag yet. Explore our handcrafted gourmet burgers, stone-baked pizzas, and desserts!
        </p>
        <Link
          to="/menu"
          className="px-8 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          Explore UrbanBite Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-900">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Review your selected items and special kitchen instructions
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-stone-400 hover:text-red-500 transition-colors self-start sm:self-auto flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear entire cart</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Branch notice pill */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-950 font-medium">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Preparing from <strong>{selectedBranch?.name || 'DHA Branch'}</strong> ({selectedBranch?.city || 'Lahore'})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="text-amber-700 font-bold hover:underline shrink-0"
              >
                Change branch
              </button>
            </div>

            {/* Itemized Cards */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] divide-y divide-stone-100">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Food Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-display font-bold text-stone-900 text-base">
                        {item.name}
                      </h3>
                      <div className="text-xs text-stone-500 font-medium">
                        Unit Price: <span className="font-bold text-stone-700">{formatPrice(item.price)}</span>
                      </div>

                      {/* Instructions */}
                      {item.instructions ? (
                        <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/50 mt-1 max-w-md">
                          <ChefHat className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">Note: {item.instructions}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Standard preparation</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-display font-bold text-xs sm:text-sm text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[90px]">
                      <div className="font-display font-black text-stone-900 text-base">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to menu button */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to="/menu"
                className="text-xs sm:text-sm font-bold text-amber-600 hover:underline flex items-center gap-1.5"
              >
                <span>← Add more items from Menu</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            {/* Promo Code Box */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-stone-900 text-sm">
                  Apply Coupon Code
                </h3>
              </div>

              {promoCode ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Coupon "{promoCode}" Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-red-600 underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. URBAN20, FEAST15"
                    className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase font-mono font-bold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold font-display shadow-xs transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              <div className="text-[11px] text-stone-400">
                Tip: Try using <code className="text-amber-600 font-bold font-mono">URBAN20</code> for 20% discount.
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-4">
              <h3 className="font-display font-bold text-stone-900 text-base pb-3 border-b border-stone-100">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-stone-900">{formatPrice(totals.subtotal)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Promo Discount ({promoCode})</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Sales Tax / GST (5%)</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {totals.deliveryFee === 0 ? (
                      <strong className="text-emerald-600 font-bold">FREE DELIVERY</strong>
                    ) : (
                      formatPrice(totals.deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base sm:text-lg">
                  <span className="font-display font-black text-stone-900">Grand Total</span>
                  <span className="font-display font-black text-xl text-stone-900">
                    {formatPrice(totals.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Login Warning if guest */}
              {!isAuthenticated && (
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    You will be prompted to login or create an account before placing your order.
                  </span>
                </div>
              )}

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Trust Badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Secure Checkout
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  30-40 min Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
