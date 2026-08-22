import api from './api';
import { foods as staticFoods } from '../data/foods';
import { categories as staticCategories } from '../data/categories';

const CACHE_KEY = 'urbanbite_cached_foods';
let memoryFoodsCache = null;

const normalizeFood = (f) => {
  if (!f) return null;
  const id = f._id || f.id;
  return {
    ...f,
    id,
    _id: id,
    available: f.available !== false,
    isAvailable: f.available !== false,
    inStock: f.available !== false,
    categoryId: f.categoryId || f.category?.slug || f.category?._id || '',
    categorySlug: f.categorySlug || f.categoryId || '',
    discountPrice: f.discountPrice || (f.discount ? Math.round(f.price * (1 - f.discount / 100)) : f.price),
    tags: f.tags || [f.isNew ? 'new' : '', f.isPopular ? 'popular' : '', f.isFeatured ? 'deals' : ''].filter(Boolean)
  };
};

try {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null;
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryFoodsCache = parsed.map(normalizeFood);
    }
  }
} catch (e) {}

export const foodService = {
  // Instant synchronous getter for initial render
  getCachedFoods: () => {
    if (memoryFoodsCache && memoryFoodsCache.length > 0) return memoryFoodsCache;
    return staticFoods.map(normalizeFood);
  },

  // Get all food items directly from live API
  getAllFoods: async () => {
    try {
      const { data } = await api.get('/foods');
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const normalized = data.data.map(normalizeFood);
        memoryFoodsCache = normalized;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
          } catch (err) {}
        }
        return normalized;
      }
    } catch (e) {
      console.warn('API error, falling back to cached/static foods:', e.message);
    }
    return foodService.getCachedFoods();
  },

  // Get food by slug or id
  getFoodById: async (id) => {
    try {
      const { data } = await api.get(`/foods/${id}`);
      if (data.success && data.data) return normalizeFood(data.data);
    } catch (e) {
      console.warn('API error, falling back to static food by id:', e.message);
    }
    const found = staticFoods.find((item) => item.id === id || item.slug === id || item._id === id);
    return found ? normalizeFood(found) : null;
  },

  // Get foods by category slug/id
  getFoodsByCategory: async (categoryId) => {
    if (!categoryId || categoryId === 'all') {
      return foodService.getAllFoods();
    }
    try {
      const { data } = await api.get('/foods', { params: { category: categoryId } });
      if (data.success && Array.isArray(data.data)) return data.data.map(normalizeFood);
    } catch (e) {
      console.warn('API error, falling back to static category foods:', e.message);
    }
    return staticFoods.filter((item) => item.categoryId === categoryId).map(normalizeFood);
  },

  // Search foods with keywords, filters and sorting
  filterFoods: async ({ category = 'all', query = '', sortBy = 'popular', priceRange = null }) => {
    try {
      const { data } = await api.get('/foods', {
        params: { category, search: query, sort: sortBy }
      });
      if (data.success && Array.isArray(data.data)) {
        let result = data.data.map(normalizeFood);
        if (priceRange) {
          if (priceRange.min !== undefined) result = result.filter((item) => item.price >= priceRange.min);
          if (priceRange.max !== undefined) result = result.filter((item) => item.price <= priceRange.max);
        }
        return result;
      }
    } catch (e) {
      console.warn('API error, falling back to static filterFoods:', e.message);
    }

    // Static fallback
    let result = staticFoods.map(normalizeFood);
    if (category && category !== 'all') {
      result = result.filter((item) => item.categoryId === category);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryId.toLowerCase().includes(q) ||
          (item.ingredients && item.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }
    if (priceRange) {
      if (priceRange.min !== undefined) result = result.filter((item) => item.price >= priceRange.min);
      if (priceRange.max !== undefined) result = result.filter((item) => item.price <= priceRange.max);
    }
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.reviewCount - a.reviewCount);
    }
    return result;
  },

  // Get all categories
  getCategories: async () => {
    try {
      const { data } = await api.get('/categories');
      if (data.success && Array.isArray(data.data) && data.data.length > 0) return data.data;
    } catch (e) {
      console.warn('API error, falling back to static categories:', e.message);
    }
    return staticCategories;
  },

  // Get featured / popular items
  getPopularFoods: async (limit = 8) => {
    try {
      const { data } = await api.get('/foods/popular', { params: { limit } });
      if (data.success && Array.isArray(data.data) && data.data.length > 0) return data.data.map(normalizeFood);
    } catch (e) {
      console.warn('API error, falling back to static popular foods:', e.message);
    }
    return staticFoods.filter((item) => item.isPopular || item.isFeatured).slice(0, limit).map(normalizeFood);
  }
};

export default foodService;
