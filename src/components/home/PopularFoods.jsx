import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';
import foods from '../../data/foods';
import FoodCard from '../menu/FoodCard';
import PageContainer from '../layout/PageContainer';

export const PopularFoods = () => {
  const popularItems = foods.filter((f) => f.isPopular).slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <PageContainer>
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
              <Flame size={16} /> Most Popular Picks
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Top Trending UrbanBite Favorites
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
          >
            See Full Menu <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularItems.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default PopularFoods;
