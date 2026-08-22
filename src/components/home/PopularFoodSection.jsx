import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { FoodCard } from '../common/FoodCard';
import { foodService } from '../../services/foodService';
import { useCart } from '../../context/CartContext';

export const PopularFoodSection = ({ onSelectFood }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [foodsList, setFoodsList] = useState(() => foodService.getCachedFoods());

  useEffect(() => {
    let isMounted = true;
    foodService.getAllFoods().then((liveFoods) => {
      if (isMounted && Array.isArray(liveFoods) && liveFoods.length > 0) {
        setFoodsList(liveFoods);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const favoriteFoods = foodsList.filter((f) => f.isFeatured || f.isPopular).slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — centered */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 mb-1">
            <Flame className="w-4 h-4 fill-amber-600 text-amber-600" />
            <span>Customer Favorites</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-stone-900">
            Most Loved Dishes
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-1 max-w-xl mx-auto">
            Freshly handcrafted smash burgers, signature pizzas, and crispy tenders loved by thousands.
          </p>
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onSelectFood={onSelectFood}
              onQuickAdd={(item) => addToCart(item, 1, '')}
            />
          ))}
        </div>

        {/* Explore All Button — centered below grid */}
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 font-display font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all group"
          >
            <span>Explore All 120+ Items</span>
            <ArrowRight className="w-4 h-4 text-amber-500 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
