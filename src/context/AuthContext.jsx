import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectUrl, setAuthRedirectUrl] = useState('/checkout');

  useEffect(() => {
    // Check initial user from localStorage
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const user = await authService.login(credentials);
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      setIsAuthModalOpen(false);
      return user;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const user = await authService.register(userData);
      setCurrentUser(user);
      toast.success(`Account created successfully! Welcome to UrbanBite, ${user.name}!`);
      setIsAuthModalOpen(false);
      return user;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updatedData) => {
    try {
      const user = await authService.updateProfile(updatedData);
      setCurrentUser(user);
      toast.success('Profile updated successfully!');
      return user;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const promptLogin = (redirectPath = '/checkout') => {
    setAuthRedirectUrl(redirectPath);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authRedirectUrl,
        promptLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
