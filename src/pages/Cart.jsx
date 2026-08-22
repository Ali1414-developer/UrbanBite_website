import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';
import useCart from '../hooks/useCart';
import Button from '../components/common/Button';

export const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <PageContainer>
          <EmptyCart />
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <PageContainer>
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Your Shopping Basket</h1>
            <p className="text-xs text-slate-500">{cartItems.length} items in your order</p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-rose-600">
            Clear Entire Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={`${item.id}-${JSON.stringify(item.options || {})}`} item={item} />
            ))}
          </div>

          <div>
            <CartSummary onProceedCheckout={() => navigate('/checkout')} />
          </div>
        </div>
      </PageContainer>
    </main>
  );
};

export default Cart;
