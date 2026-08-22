import api from './api';

export const promoService = {
  validatePromo: async (code, subtotal = 0) => {
    try {
      const { data } = await api.post('/promos/validate', {
        code: code?.toUpperCase()?.trim(),
        subtotal
      });
      return data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  }
};

export default promoService;
