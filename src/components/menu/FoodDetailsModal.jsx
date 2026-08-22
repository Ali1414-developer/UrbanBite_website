import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import Modal from '../common/Modal';
import Rating from '../common/Rating';
import QuantitySelector from '../common/QuantitySelector';
import Button from '../common/Button';
import KitchenInstructions from './KitchenInstructions';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currency';

export const FoodDetailsModal = ({ isOpen, onClose, food }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  if (!food) return null;

  const handleAddToCart = () => {
    addToCart(food, quantity, { instructions });
    onClose();
    setQuantity(1);
    setInstructions('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={food.name} maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-slate-100">
          <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div>
            <Rating rating={food.rating} count={food.reviewCount} />
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">{food.name}</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{food.description}</p>

            {food.ingredients && food.ingredients.length > 0 && (
              <div className="mt-3">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Ingredients:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {food.ingredients.map((ing, i) => (
                    <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <KitchenInstructions instructions={instructions} setInstructions={setInstructions} />
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div>
              <span className="text-xs text-slate-400">Total Price</span>
              <p className="text-xl font-black text-rose-600">
                {formatCurrency(food.price * quantity)}
              </p>
            </div>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </div>

          <Button variant="primary" fullWidth onClick={handleAddToCart} className="gap-2">
            <ShoppingBag size={18} /> Add To Order
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FoodDetailsModal;
