import React, { useState, useEffect } from 'react';
import { foodService } from '../../services/foodService';
import FoodCard from '../menu/FoodCard';

export const FavoriteFoods = () => {
  const [favorites, setFavorites] = useState(() => foodService.getCachedFoods().slice(0, 4));

  useEffect(() => {
    foodService.getAllFoods().then((list) => {
      if (Array.isArray(list) && list.length > 0) {
        setFavorites(list.slice(0, 4));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-slate-900">Your Favorite Dishes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {favorites.map((food) => (
          <FoodCard key={food._id || food.id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default FavoriteFoods;
