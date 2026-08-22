import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import staticCategories from '../../data/categories';
import { categoryService } from '../../services/categoryService';
import { foodService } from '../../services/foodService';

export const CategoryBar = () => {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState(() => categoryService.getCachedCategories());
  const [foodsList, setFoodsList] = useState(() => foodService.getCachedFoods());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [liveCats, liveFoods] = await Promise.all([
          categoryService.getAllCategories(),
          foodService.getAllFoods()
        ]);
        if (isMounted) {
          if (Array.isArray(liveCats) && liveCats.length > 0) setCategoriesList(liveCats);
          if (Array.isArray(liveFoods) && liveFoods.length > 0) setFoodsList(liveFoods);
        }
      } catch (err) {
        console.warn('Failed to load dynamic categories for CategoryBar:', err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/menu?category=${slug}`);
  };

  // Show 7 items in a single clean row on homepage
  const displayedCategories = categoriesList.slice(0, 7);

  return (
    <section className="py-12 bg-white border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — centered */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
            Browse by Craving
          </span>
          <h2 className="font-sans font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
            Popular Categories
          </h2>
        </div>

        {/* Categories Grid - Exactly 7 in 1 row on large screens */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
          {displayedCategories.map((cat, index) => {
            const count = foodsList.filter((f) => f.categoryId === cat.slug || f.categorySlug === cat.slug).length;

            return (
              <motion.div
                key={cat._id || cat.id || cat.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => handleCategoryClick(cat.slug || cat.id)}
                className="group flex flex-col items-center bg-white hover:bg-red-50/15 rounded-2xl p-3.5 border border-stone-200/90 hover:border-red-400/90 shadow-xs hover:shadow-[0_12px_28px_rgba(239,68,68,0.24)] transition-all duration-300 cursor-pointer text-center"
              >
                {/* Category Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 bg-neutral-100 shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Title & Count */}
                <h3 className="font-sans font-semibold text-neutral-900 group-hover:text-red-600 text-xs sm:text-sm transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-normal text-neutral-500 mt-0.5">
                  {count > 0 ? `${count} items` : `${cat.itemCount || 0}+ items`}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button — centered below grid, redirects to /menu */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 transition-colors group cursor-pointer"
          >
            <span>View All {categoriesList.length} Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
