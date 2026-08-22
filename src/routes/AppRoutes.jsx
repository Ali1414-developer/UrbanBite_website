import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Pages Import
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Restaurants from '../pages/Restaurants';
import RestaurantDetails from '../pages/RestaurantDetails';
import About from '../pages/About';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurants/:restaurantId" element={<RestaurantDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />

      {/* Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Customer Pages */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
