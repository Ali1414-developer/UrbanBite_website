import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Heart, Flame, Clock, Plus, Minus, ChefHat, Check, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

export const FoodModal = ({ food, isOpen, onClose }) => {
  const { addToCart, openCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (food) {
      setQuantity(1);
      setInstructions('');
      setIsAdded(false);
    }
  }, [food]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !food) return null;

  const favorite = isFavorite(food.id);
  const itemTotal = (food.price || 0) * quantity;
  const originalItemTotal = food.originalPrice ? food.originalPrice * quantity : null;

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(food, quantity, instructions);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
      openCart();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto border border-stone-100"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition-all active:scale-90 z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-1">
            {/* Header Image */}
            <div className="relative w-full h-64 sm:h-72 bg-stone-100">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {food.isNew && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                    NEW ITEM
                  </span>
                )}
                {food.discount > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md">
                    {food.discount}% OFF
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                type="button"
                onClick={() => toggleFavorite(food.id, food.name)}
                className="absolute top-4 right-14 p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 backdrop-blur-md transition-all active:scale-90"
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Title & Ratings inside image bottom */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1 bg-amber-500 px-2 py-0.5 rounded-md text-xs font-bold text-white">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>{food.rating}</span>
                  </div>
                  <span className="text-stone-300 text-xs">({food.reviewCount} customer reviews)</span>
                  {food.calories && (
                    <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md text-xs text-stone-200 ml-auto">
                      <Flame className="w-3 h-3 text-orange-400" />
                      {food.calories}
                    </span>
                  )}
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {food.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  About this dish
                </h4>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  {food.description}
                </p>
              </div>

              {/* Ingredients Tags */}
              {food.ingredients && food.ingredients.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Key Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {food.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200/60"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Kitchen Instructions Textarea */}
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat className="w-4 h-4 text-amber-600" />
                  <label htmlFor="kitchen-notes" className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Kitchen Instructions (Optional)
                  </label>
                </div>
                <textarea
                  id="kitchen-notes"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Instructions for Chef: No onions, extra spicy, sauce on the side, well done..."
                  rows={2}
                  className="w-full text-xs sm:text-sm bg-white border border-amber-200 rounded-xl p-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center bg-white border border-stone-300 rounded-2xl p-1 shadow-xs">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 sm:w-10 text-center font-display font-bold text-stone-900 text-base">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart CTA with Dynamic Total */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-between px-5 sm:px-6 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <div className="flex items-center gap-2">
                {isAdded ? <Check className="w-5 h-5 animate-bounce" /> : <ShoppingCart className="w-5 h-5" />}
                <span className="text-sm sm:text-base font-semibold">
                  {isAdded ? 'Added to Cart!' : 'Add to Order'}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight">
                  {formatPrice(itemTotal)}
                </span>
                {originalItemTotal && (
                  <span className="text-xs text-amber-200 line-through opacity-80">
                    {formatPrice(originalItemTotal)}
                  </span>
                )}
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
