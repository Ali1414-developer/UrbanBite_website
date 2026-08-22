import React, { createContext, useState } from 'react';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Lahore');
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const value = {
    globalLoading,
    setGlobalLoading,
    mobileMenuOpen,
    setMobileMenuOpen,
    toggleMobileMenu: () => setMobileMenuOpen((prev) => !prev),
    selectedCity,
    setSelectedCity,
    notifications,
    addNotification,
    removeNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
