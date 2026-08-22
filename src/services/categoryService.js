import api from './api';
import categoriesData from '../data/categories';

const CACHE_KEY = 'urbanbite_cached_categories';
let memoryCache = null;

function sanitizeCategories(list) {
  if (!Array.isArray(list)) return [];
  return list.map((cat) => {
    let img = cat.image;
    if (!img || img.includes('encrypted-tbn0.gstatic.com')) {
      if (cat.slug?.includes('pasta') || cat.name?.toLowerCase().includes('pasta')) {
        img = 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80';
      } else {
        img = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
      }
    }
    return { ...cat, image: img };
  });
}

// Initialize cache synchronously from localStorage
try {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null;
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryCache = sanitizeCategories(parsed);
    }
  }
} catch (e) {
  // ignore
}

export const categoryService = {
  // Instant synchronous getter for 0ms initial render
  getCachedCategories() {
    if (memoryCache && memoryCache.length > 0) return memoryCache;
    return sanitizeCategories(categoriesData);
  },

  async getAllCategories() {
    try {
      const { data } = await api.get('/categories');
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const sanitized = sanitizeCategories(data.data);
        memoryCache = sanitized;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(sanitized));
          } catch (err) {}
        }
        return sanitized;
      }
    } catch (e) {
      console.warn('API error, using cached/static categories:', e.message);
    }
    return this.getCachedCategories();
  },

  async getCategoryBySlug(slug) {
    const cats = this.getCachedCategories();
    const found = cats.find((c) => c.slug === slug || c.id === slug || c._id === slug);
    if (found) return found;
    try {
      const latest = await this.getAllCategories();
      return latest.find((c) => c.slug === slug || c.id === slug || c._id === slug) || null;
    } catch (e) {
      return null;
    }
  },
};

export default categoryService;
