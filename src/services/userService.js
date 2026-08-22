import api from './api';

export const userService = {
  async getProfile() {
    // API placeholder: return (await api.get('/users/profile')).data;
    const user = localStorage.getItem('urbanbite_user');
    return user ? JSON.parse(user) : null;
  },

  async updateProfile(profileData) {
    // API placeholder: return (await api.put('/users/profile', profileData)).data;
    await new Promise((resolve) => setTimeout(resolve, 400));
    const current = (await this.getProfile()) || {};
    const updated = { ...current, ...profileData };
    localStorage.setItem('urbanbite_user', JSON.stringify(updated));
    return updated;
  },

  async getSavedAddresses() {
    return [
      { id: 'addr-1', title: 'Home', address: 'Plot 45, Street 12, DHA Phase 5, Lahore', isDefault: true },
      { id: 'addr-2', title: 'Office', address: 'Level 4, Software Park, Gulberg III, Lahore', isDefault: false },
    ];
  },
};

export default userService;
