/**
 * Currency and price formatting utilities for UrbanBite
 */

export const formatPrice = (price) => {
  if (price === undefined || price === null) return 'Rs. 0';
  const numeric = typeof price === 'number' ? price : Number(price) || 0;
  return `Rs. ${numeric.toLocaleString('en-PK')}`;
};

export const calculateDiscountedPrice = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.round(price * (1 - discountPercent / 100));
};

export const generateOrderId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UB-${year}${month}${day}-${randomNum}`;
};
