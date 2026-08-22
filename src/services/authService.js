import api from './api';

const CURRENT_USER_KEY = 'urbanbite_user';
const TOKEN_KEY = 'urbanbite_token';

export const authService = {
  // Register new customer
  register: async ({ name, email, phone, password, address = '', city = 'Lahore' }) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, phone, password, address, city });
      if (data.success && data.data) {
        const user = data.data.user || data.data;
        const token = data.data.token || data.token;

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, token);

        return user;
      }
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  // Login existing customer
  login: async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success && data.data) {
        const user = data.data.user || data.data;
        const token = data.data.token || data.token;

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, token);

        return user;
      }
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  // Update profile
  updateProfile: async (updatedData) => {
    try {
      const { data } = await api.put('/auth/profile', updatedData);
      if (data.success && data.data) {
        const updatedUser = data.data;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (err) {
      // Fallback local update if offline
      const currentUser = authService.getCurrentUser();
      const merged = { ...currentUser, ...updatedData };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(merged));
      return merged;
    }
  },

  // Logout
  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    return true;
  },

  // Get current logged-in user
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Check auth state
  isAuthenticated: () => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  }
};

export default authService;
