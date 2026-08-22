import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { motion, AnimatePresence } from 'framer-motion';

export const MenuMegaDropdown = ({ isOpen }) => {
  const [categoriesList, setCategoriesList] = useState(() => categoryService.getCachedCategories());

  useEffect(() => {
    categoryService.getAllCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) setCategoriesList(cats);
    }).catch(() => {});
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
          className="absolute left-1/2 -translate-x-1/2 top-full w-[850px] pt-2 z-50"
        >
          <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-2xl backdrop-blur-xl grid grid-cols-4 gap-4">
            {categoriesList.map((cat) => (
              <Link
                key={cat._id || cat.id || cat.slug}
                to={`/menu?category=${cat.slug || cat.id}`}
                className="group flex items-center gap-3 rounded-2xl p-2.5 transition-all hover:bg-rose-50/80"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-11 w-11 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuMegaDropdown;
