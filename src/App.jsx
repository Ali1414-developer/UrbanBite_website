import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LocationProvider } from './context/LocationContext';

// Layout & Pages
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrdersPage } from './pages/OrdersPage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

import { categoryService } from './services/categoryService';
import { foodService } from './services/foodService';

// Scroll to top component on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export function App() {
  // Pre-warm category and food caches on initial app mount
  useEffect(() => {
    categoryService.getAllCategories();
    foodService.getAllFoods();
  }, []);

  return (
    <SettingsProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <FavoritesProvider>
              <Router>
                <ScrollToTop />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#1c1917',
                    color: '#fff',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                  },
                  success: {
                    iconTheme: {
                      primary: '#f59e0b',
                      secondary: '#fff'
                    }
                  }
                }}
              />
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/restaurants" element={<RestaurantsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  {/* Catch all fallback */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Layout>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
