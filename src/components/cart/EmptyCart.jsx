import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../common/Button';

export const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
      <div className="mb-4 rounded-full bg-rose-50 p-6 text-rose-600">
        <ShoppingBag size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">Your Shopping Cart is Empty</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500">
        Looks like you haven't added any delicious food items to your cart yet.
      </p>
      <Button onClick={() => navigate('/menu')} className="mt-6" size="md">
        Browse UrbanBite Menu
      </Button>
    </div>
  );
};

export default EmptyCart;
