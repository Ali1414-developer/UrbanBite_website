import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { calculateCartTotals } from '../utils/calculations';
import { restaurants } from '../data/restaurants';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'urbanbite_cart';
const PROMO_STORAGE_KEY = 'urbanbite_promo';
const BRANCH_STORAGE_KEY = 'urbanbite_branch';

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const prevUserRef = useRef(currentUser?._id || currentUser?.id || null);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(() => {
    return localStorage.getItem(PROMO_STORAGE_KEY) || '';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState(() => {
    try {
      const saved = localStorage.getItem(BRANCH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : restaurants[0];
    } catch (e) {
      return restaurants[0];
    }
  });

  // Automatically empty cart when a user logs in OR logs out
  useEffect(() => {
    const currentUserId = currentUser?._id || currentUser?.id || null;
    if (currentUserId !== prevUserRef.current) {
      setCartItems([]);
      setPromoCode('');
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(PROMO_STORAGE_KEY);
      } catch (e) {}
    }
    prevUserRef.current = currentUserId;
  }, [currentUser]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist promo
  useEffect(() => {
    if (promoCode) {
      localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [promoCode]);

  // Persist selected branch
  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(selectedBranch));
    }
  }, [selectedBranch]);

  // Add Item to Cart (Supports both MongoDB _id and legacy id)
  const addToCart = (food, quantity = 1, instructions = '') => {
    if (!food || quantity < 1) return;
    const foodId = food._id || food.id;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.foodId === foodId && (item.instructions || '') === (instructions || '')
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        const newCartItem = {
          cartItemId: `${foodId}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          foodId: foodId,
          name: food.name,
          slug: food.slug,
          price: food.price,
          originalPrice: food.originalPrice,
          image: food.image,
          categoryId: food.categoryId,
          quantity,
          instructions: instructions.trim()
        };
        return [...prevItems, newCartItem];
      }
    });

    toast.success(`Added ${quantity}x ${food.name} to cart!`, {
      duration: 2500
    });
  };

  // Remove Item
  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    toast.success('Item removed from cart');
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(PROMO_STORAGE_KEY);
    } catch (e) {}
  };

  // Apply promo with API validation
  const applyPromoCode = async (code) => {
    if (!code) return false;
    const clean = code.toUpperCase().trim();
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
      const { data } = await api.post('/promos/validate', { code: clean, subtotal });
      if (data.success) {
        setPromoCode(clean);
        toast.success(`Promo code "${clean}" applied!`);
        return true;
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
        return false;
      }
    }

    if (['URBAN20', 'WELCOME50', 'FEAST15', 'FREEDEL'].includes(clean)) {
      setPromoCode(clean);
      toast.success(`Promo code "${clean}" applied!`);
      return true;
    } else {
      toast.error('Invalid promo code.');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    toast.success('Promo code removed');
  };

  // Calculate totals
  const totals = calculateCartTotals(cartItems, promoCode);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        applyPromoCode,
        removePromoCode,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        totals,
        selectedBranch,
        setSelectedBranch
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
