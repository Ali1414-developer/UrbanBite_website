import api from './api';
import { restaurants as staticRestaurants } from '../data/restaurants';

const normalizeRestaurant = (r) => {
  if (!r) return null;
  const id = r._id || r.id;
  const timing = r.timing || (r.openingTime && r.closingTime ? `${r.openingTime} - ${r.closingTime}` : '11:00 AM - 02:00 AM');
  
  let facilities = r.facilities;
  if (!facilities || !Array.isArray(facilities) || facilities.length === 0) {
    if (r.services) {
      facilities = [];
      if (r.services.dineIn) facilities.push('Dine-In Available');
      if (r.services.pickup) facilities.push('Takeaway Counter');
      if (r.services.delivery) facilities.push('Express Delivery');
    }
    if (!facilities || facilities.length === 0) {
      facilities = ['Dine-In Seating', 'Takeaway Counter', 'Express Delivery'];
    }
  }

  return {
    ...r,
    id,
    _id: id,
    timing,
    facilities,
    rating: r.rating || 4.8,
    reviewCount: r.reviewCount || 150,
    phone: r.phone || '+92 42 3574 8891'
  };
};

export const restaurantService = {
  // Get all active restaurants from backend database
  getAllRestaurants: async () => {
    try {
      const { data } = await api.get('/restaurants');
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map(normalizeRestaurant);
      }
    } catch (e) {
      console.warn('API error, falling back to static restaurants:', e.message);
    }
    return staticRestaurants.map(normalizeRestaurant);
  },

  // Get restaurant by ID or Slug from backend
  getRestaurantById: async (id) => {
    try {
      const { data } = await api.get(`/restaurants/${id}`);
      if (data.success && data.data) {
        return normalizeRestaurant(data.data);
      }
    } catch (e) {
      console.warn('API error, falling back to static restaurant by id:', e.message);
    }
    const found = staticRestaurants.find((r) => r.id === id || r.slug === id || r._id === id);
    return found ? normalizeRestaurant(found) : null;
  },

  // Get restaurants by city
  getRestaurantsByCity: async (city) => {
    if (!city || city.toLowerCase() === 'all') {
      return restaurantService.getAllRestaurants();
    }
    try {
      const { data } = await api.get('/restaurants', { params: { city } });
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map(normalizeRestaurant);
      }
    } catch (e) {
      console.warn('API error, falling back to static city restaurants:', e.message);
    }
    const filtered = staticRestaurants.filter(
      (r) => r.city.toLowerCase() === city.toLowerCase() || r.citySlug === city.toLowerCase()
    );
    return filtered.map(normalizeRestaurant);
  },

  // Filter restaurants
  filterRestaurants: async ({ city = 'all', query = '', openOnly = false }) => {
    let list = await restaurantService.getRestaurantsByCity(city);

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          (r.facilities && r.facilities.some((f) => f.toLowerCase().includes(q)))
      );
    }

    if (openOnly) {
      list = list.filter((r) => r.isOpen || r.active);
    }

    return list;
  },

  // Get distinct cities
  getCities: async () => {
    const list = await restaurantService.getAllRestaurants();
    const cities = Array.from(new Set(list.map((r) => r.city).filter(Boolean)));
    return cities;
  }
};

export default restaurantService;
