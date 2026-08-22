import React, { useState } from 'react';
import { Plus, Heart, Flame } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency';
import Rating from '../common/Rating';
import FoodDetailsModal from './FoodDetailsModal';

export const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(food, 1);
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-4 shadow-sm hover:border-rose-300 hover:shadow-xl transition-all cursor-pointer"
      >
        {/* Top Image & Badges */}
        <div className="relative mb-3 h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={food.image}
            alt={food.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            {food.isNew && (
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-sm">
                New
              </span>
            )}
            {food.isPopular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-sm">
                <Flame size={10} fill="currentColor" /> Popular
              </span>
            )}
            {food.discount > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-slate-950 shadow-sm">
                -{food.discount}%
              </span>
            )}
          </div>

          {/* Like Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-md hover:text-rose-600 backdrop-blur-md transition-colors"
          >
            <Heart size={16} fill={isLiked ? '#e11d48' : 'none'} className={isLiked ? 'text-rose-600' : ''} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[17px] font-semibold text-neutral-900 line-clamp-1 group-hover:text-red-600 transition-colors">
              {food.name}
            </h3>
          </div>

          {/* Pricing & Action */}
          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[18px] font-bold text-neutral-900">
                  {formatCurrency(food.price)}
                </span>
                {food.originalPrice && food.originalPrice > food.price && (
                  <span className="text-xs text-neutral-400 line-through font-normal">
                    {formatCurrency(food.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs hover:bg-red-700 transition-all active:scale-95"
              aria-label="Add to cart"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <FoodDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} food={food} />
    </>
  );
};

export default FoodCard;
