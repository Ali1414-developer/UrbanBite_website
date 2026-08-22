/**
 * Cart and order calculation utilities
 */

export const TAX_RATE = 0.05; // 5% GST
export const DEFAULT_DELIVERY_FEE = 150; // Rs. 150
export const FREE_DELIVERY_THRESHOLD = 2500; // Free delivery above Rs. 2500

export const calculateCartTotals = (items = [], promoCode = null) => {
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.price || 0;
    const qty = item.quantity || 1;
    return acc + itemPrice * qty;
  }, 0);

  let discount = 0;
  if (promoCode) {
    const code = promoCode.toUpperCase().trim();
    if (code === 'URBAN20') {
      discount = Math.round(subtotal * 0.20);
    } else if (code === 'WELCOME50') {
      discount = Math.min(Math.round(subtotal * 0.50), 500); // 50% max 500
    } else if (code === 'FEAST15') {
      discount = Math.round(subtotal * 0.15);
    } else if (code === 'FREEDEL') {
      discount = 0; // handled via free delivery
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * TAX_RATE);
  
  let deliveryFee = DEFAULT_DELIVERY_FEE;
  if (subtotal >= FREE_DELIVERY_THRESHOLD || (promoCode && promoCode.toUpperCase().trim() === 'FREEDEL') || items.length === 0) {
    deliveryFee = 0;
  }

  const grandTotal = Math.max(0, subtotal - discount + tax + deliveryFee);

  return {
    subtotal,
    discount,
    tax,
    deliveryFee,
    grandTotal,
    itemCount: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    isFreeDeliveryEligible: subtotal >= FREE_DELIVERY_THRESHOLD
  };
};
