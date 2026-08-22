export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'UrbanBite',
  currencySymbol: import.meta.env.VITE_CURRENCY_SYMBOL || 'Rs.',
  isProduction: import.meta.env.PROD,
};

export default config;
