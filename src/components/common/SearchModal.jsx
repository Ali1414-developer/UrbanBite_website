import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, ArrowRight, Flame } from 'lucide-react';
import { foodService } from '../../services/foodService';
import { categoryService } from '../../services/categoryService';
import { formatPrice } from '../../utils/currency';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [categoriesList, setCategoriesList] = useState(() => categoryService.getCachedCategories());
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getAllCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) setCategoriesList(cats);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let isCancelled = false;
    const timer = setTimeout(async () => {
      const filtered = await foodService.filterFoods({ query });
      if (!isCancelled) {
        setResults(filtered.slice(0, 8));
      }
    }, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  if (!isOpen) return null;

  const handleSelectFood = (food) => {
    onClose();
    navigate(`/menu?category=${food.categoryId}`);
  };

  const handleSelectCategory = (catSlug) => {
    onClose();
    navigate(`/menu?category=${catSlug}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200/80 flex flex-col max-h-[80vh]"
        >
          {/* Search Header Input */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3 bg-stone-50/50">
            <Search className="w-5 h-5 text-amber-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search burgers, pizzas, wings, shakes, desserts..."
              className="w-full text-base sm:text-lg bg-transparent border-none outline-none text-stone-900 placeholder-stone-400 font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 px-2 py-1 bg-stone-200/70 rounded-md"
            >
              ESC
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="px-4 py-3 bg-stone-100/60 border-b border-stone-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="font-bold text-stone-400 shrink-0">Popular:</span>
            {categoriesList.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.slug)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-500 hover:text-white border border-stone-200 font-medium text-stone-700 transition-colors shrink-0"
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="overflow-y-auto p-4 flex-1 divide-y divide-stone-100">
            {query.trim() === '' ? (
              <div className="py-12 text-center text-stone-400">
                <Search className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="font-medium text-sm text-stone-500">Type what you’re craving...</p>
                <p className="text-xs text-stone-400 mt-1">Try "beef burger", "alfredo pizza", "wings", "lava cake"</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                <p className="font-bold text-base text-stone-800">No dishes found for "{query}"</p>
                <p className="text-xs text-stone-400 mt-1">Try searching with broader terms or check our full menu.</p>
              </div>
            ) : (
              results.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="py-3 px-3 rounded-2xl hover:bg-stone-50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-display font-bold text-stone-900 group-hover:text-amber-600 transition-colors text-sm sm:text-base">
                        {food.name}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1 max-w-sm">{food.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center text-[11px] font-bold text-amber-600 gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {food.rating}
                        </span>
                        <span className="text-[11px] text-stone-400">• {food.categoryId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <div className="font-bold text-stone-900 text-sm sm:text-base">
                        {formatPrice(food.price)}
                      </div>
                      {food.discount > 0 && (
                        <span className="text-[10px] text-red-600 font-bold">{food.discount}% OFF</span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
