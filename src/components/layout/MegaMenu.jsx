import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import staticCategories from '../../data/categories';
import { categoryService } from '../../services/categoryService';

export const MegaMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState(() => categoryService.getCachedCategories());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const liveCats = await categoryService.getAllCategories();
        if (isMounted && Array.isArray(liveCats) && liveCats.length > 0) {
          setCategoriesList(liveCats);
        }
      } catch (err) {
        console.warn('Failed to load dynamic categories for MegaMenu:', err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  if (!isOpen) return null;

  const handleCategoryClick = (slug) => {
    onClose();
    navigate(`/menu?category=${slug}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        onMouseLeave={onClose}
        className="absolute top-full left-0 right-0 w-full bg-white/98 backdrop-blur-xl border-b border-stone-200/90 shadow-2xl z-40 px-4 sm:px-8 py-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
            <div>
              <h3 className="font-display font-black text-xl text-stone-900 flex items-center gap-2">
                <span>Explore UrbanBite Menu</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {categoriesList.length} Categories • Fresh Dishes
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Freshly prepared, flame-grilled and artisanal handcrafted meals
              </p>
            </div>

            <Link
              to="/menu"
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors group"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Grid of Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categoriesList.map((category) => (
              <div
                key={category._id || category.id || category.slug}
                onClick={() => handleCategoryClick(category.slug || category.id)}
                className="group relative flex flex-col bg-stone-50/80 hover:bg-white rounded-2xl p-2.5 border border-stone-200/60 hover:border-red-500 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden text-left"
              >
                {/* Thumbnail Image */}
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mb-2.5 bg-stone-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white bg-black/50 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                    {category.itemCount}+ items
                  </span>
                </div>

                <div className="px-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-stone-900 text-sm group-hover:text-amber-600 transition-colors">
                      {category.name}
                    </h4>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {category.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mega menu footer promo */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Use promo code <strong className="text-stone-800">URBAN20</strong> for 20% OFF your next burger combo or pizza order!</span>
            </div>
            <Link
              to="/restaurants"
              onClick={onClose}
              className="text-stone-700 hover:text-amber-600 font-semibold underline underline-offset-2"
            >
              Find nearest dine-in branch →
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
