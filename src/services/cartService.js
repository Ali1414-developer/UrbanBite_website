import api from './api';

export const cartService = {
  /**
   * Save or sync cart to localStorage (and later API endpoint POST /api/v1/cart/sync)
   */
  async syncCart(cartItems) {
    localStorage.setItem('urbanbite_cart', JSON.stringify(cartItems));
    // API placeholder: await api.post('/cart/sync', { items: cartItems });
    return { success: true };
  },

  async getCart() {
    const saved = localStorage.getItem('urbanbite_cart');
    return saved ? JSON.parse(saved) : [];
  },

  async clearCart() {
    localStorage.removeItem('urbanbite_cart');
    return { success: true };
  },
};

export default cartService;
