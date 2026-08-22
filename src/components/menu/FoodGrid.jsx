import React from 'react';
import FoodCard from './FoodCard';
import EmptyState from '../common/EmptyState';

export const FoodGrid = ({ foods = [] }) => {
  if (foods.length === 0) {
    return (
      <EmptyState
        title="No matching foods found"
        description="Try adjusting your search query or switching food category filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
};

export default FoodGrid;
