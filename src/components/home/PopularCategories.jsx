import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import staticCategories from '../../data/categories';
import { categoryService } from '../../services/categoryService';
import PageContainer from '../layout/PageContainer';

export const PopularCategories = () => {
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
        console.warn('Failed to load dynamic categories for PopularCategories:', err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-16 bg-slate-50">
      <PageContainer>
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Categories</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Explore Our Food Spectrum
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
          >
            View All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoriesList.map((cat) => (
            <Link
              key={cat._id || cat.id || cat.slug}
              to={`/menu?category=${cat.slug || cat.id}`}
              className="group flex flex-col items-center rounded-3xl bg-white p-4 text-center border border-slate-200/80 shadow-sm hover:border-rose-400 hover:shadow-lg transition-all"
            >
              <div className="mb-3 h-20 w-20 overflow-hidden rounded-2xl bg-rose-50 p-1">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  className="h-full w-full rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                {cat.name}
              </h4>
              <span className="mt-1 text-[11px] text-slate-400 font-medium">{cat.itemCount || 0}+ Items</span>
            </Link>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default PopularCategories;
