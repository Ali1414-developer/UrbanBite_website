export const ORDER_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay cash when food arrives' },
  { id: 'card', name: 'Credit / Debit Card', description: 'Visa, Mastercard accepted' },
  { id: 'easypaisa', name: 'EasyPaisa', description: 'Mobile wallet payment' },
  { id: 'jazzcash', name: 'JazzCash', description: 'Instant wallet transfer' },
];

export const CITIES = [
  { id: 'lahore', name: 'Lahore', areas: ['DHA', 'Gulberg', 'Johar Town', 'Model Town'] },
  { id: 'islamabad', name: 'Islamabad', areas: ['F-7', 'Blue Area', 'Bahria Town', 'G-11'] },
  { id: 'multan', name: 'Multan', areas: ['Cantt', 'Bosan Road', 'Gulgasht'] },
];

export const FOOD_CATEGORIES = [
  { id: 'cat-breakfast', name: 'Breakfast', slug: 'breakfast' },
  { id: 'cat-burgers', name: 'Burgers', slug: 'burgers' },
  { id: 'cat-chicken', name: 'Chicken', slug: 'chicken' },
  { id: 'cat-pizza', name: 'Pizza', slug: 'pizza' },
  { id: 'cat-wraps', name: 'Wraps', slug: 'wraps' },
  { id: 'cat-value-meals', name: 'Value Meals', slug: 'value-meals' },
  { id: 'cat-happy-meals', name: 'Happy Meals', slug: 'happy-meals' },
  { id: 'cat-fries-sides', name: 'Fries & Sides', slug: 'fries-sides' },
  { id: 'cat-desserts', name: 'Desserts', slug: 'desserts' },
  { id: 'cat-beverages', name: 'Beverages', slug: 'beverages' },
  { id: 'cat-coffee', name: 'Coffee', slug: 'coffee' },
  { id: 'cat-sauces', name: 'Sauces', slug: 'sauces' },
];

export const FINANCIAL_RATES = {
  TAX_RATE: 0.16, // 16% GST
  DELIVERY_FEE: 150, // Rs. 150 flat delivery
  FREE_DELIVERY_THRESHOLD: 1500, // Free delivery above Rs. 1500
};
