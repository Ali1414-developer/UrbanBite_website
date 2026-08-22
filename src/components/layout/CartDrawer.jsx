import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChefHat, Sparkles, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/currency';

export const CartDrawer = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, totals, promoCode } = useCart();
  const { isAuthenticated, promptLogin } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    if (!isAuthenticated) {
      promptLogin('/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Window */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-stone-900">
                    Your Order Cart
                  </h3>
                  <p className="text-xs text-stone-500">
                    {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} in your bag
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-stone-900 mb-1">
                    Your cart is waiting for something delicious
                  </h4>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-xs mb-6">
                    Explore our flame-grilled smashers, crispy chicken tenders, stone-baked pizzas, and desserts.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      navigate('/menu');
                    }}
                    className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold font-display text-sm shadow-md transition-all"
                  >
                    Explore Menu Now
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="py-3.5 first:pt-0 flex gap-3 group">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-18 h-18 rounded-2xl object-cover border border-stone-200/60 shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display font-bold text-stone-900 text-sm line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.cartItemId)}
                              aria-label="Remove item"
                              className="text-stone-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Kitchen Instructions Indicator */}
                          {item.instructions && (
                            <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 border border-amber-200/50">
                              <ChefHat className="w-3 h-3 shrink-0" />
                              <span className="truncate">{item.instructions}</span>
                            </div>
                          )}
                        </div>

                        {/* Price & Quantity Bar */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="font-bold text-stone-900 text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </div>

                          <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200/80">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-display font-bold text-xs text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-stone-50 border-t border-stone-200/80 space-y-3">
                {/* Cost breakdown */}
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">{formatPrice(totals.subtotal)}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-red-600 font-semibold">
                      <span>Discount ({promoCode})</span>
                      <span>-{formatPrice(totals.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>GST / Sales Tax (5%)</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      {totals.deliveryFee === 0 ? (
                        <strong className="text-emerald-600 font-bold">FREE</strong>
                      ) : (
                        formatPrice(totals.deliveryFee)
                      )}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-neutral-200 flex justify-between items-baseline text-sm">
                    <span className="font-sans font-bold text-neutral-900 text-base">Grand Total</span>
                    <span className="font-sans font-bold text-xl text-neutral-900">
                      {formatPrice(totals.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Auth notice if unauthenticated */}
                {!isAuthenticated && (
                  <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Login will be required to confirm this order.</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleViewCartClick}
                    className="py-3 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold text-xs sm:text-sm text-center transition-colors"
                  >
                    View Cart
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckoutClick}
                    className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 group"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
