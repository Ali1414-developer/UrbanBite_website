import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

export const CategoryNavigation = ({ selectedCategory, onSelectCategory }) => {
  const [categoriesList, setCategoriesList] = useState(() => categoryService.getCachedCategories());

  useEffect(() => {
    categoryService.getAllCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) setCategoriesList(cats);
    }).catch(() => {});
  }, []);

  return (
    <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 font-medium'
            }`}
          >
            All Items
          </button>

          {categoriesList.map((cat) => (
            <button
              key={cat._id || cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug || cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                selectedCategory === cat.slug || selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 font-medium'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;
