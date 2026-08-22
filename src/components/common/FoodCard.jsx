import React from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Plus, Flame } from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import { useFavorites } from '../../context/FavoritesContext';

export const FoodCard = ({ food, onSelectFood, onQuickAdd }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(food.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(food.id, food.name);
  };

  const handleQuickAddClick = (e) => {
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(food);
    } else if (onSelectFood) {
      onSelectFood(food);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelectFood && onSelectFood(food)}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-[0_14px_32px_rgba(239,68,68,0.26)] hover:border-red-400/90 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Food Image Container */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
        />
        
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {food.isNew && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white shadow-xs tracking-wide">
              NEW
            </span>
          )}
          {food.discount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white shadow-xs tracking-wide">
              {food.discount}% OFF
            </span>
          )}
          {food.isPopular && !food.isNew && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-900/90 backdrop-blur-xs text-amber-400 border border-amber-400/30">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>POPULAR</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-neutral-700 hover:text-red-600 hover:bg-white shadow-xs transition-transform active:scale-90 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorite ? 'fill-red-600 text-red-600' : 'text-neutral-700 hover:text-red-600'
            }`}
          />
        </button>


      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-sans font-semibold text-neutral-900 text-[17px] group-hover:text-red-600 transition-colors line-clamp-1">
            {food.name}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-neutral-900 text-[18px]">
                {formatPrice(food.price)}
              </span>
              {food.originalPrice && food.originalPrice > food.price && (
                <span className="text-xs text-neutral-400 line-through font-normal">
                  {formatPrice(food.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickAddClick}
            className="flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 group/btn"
          >
            <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
