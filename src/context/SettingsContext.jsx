import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  brandName: 'UrbanBite',
  tagline: 'Delicious Food Delivered Fast',
  logo: '/logo.png',
  contactPhone: '+92 300 0000000',
  contactEmail: 'info@urbanbite.pk',
  defaultBranch: 'Main Branch',
  currency: 'PKR',
  timezone: 'Asia/Karachi',
  notifications: { newOrders: true, orderStatus: true },
  order: { defaultPreparationTime: 25, liveUpdates: true, autoConfirm: true },
  pos: { defaultOrderType: 'dineIn', defaultPaymentMethod: 'Cash' }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('urbanbite_public_settings');
      return cached ? { ...DEFAULT_SETTINGS, ...JSON.parse(cached) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings');
      if (res?.data?.data) {
        const live = res.data.data;
        setSettings(prev => ({ ...prev, ...live }));
        localStorage.setItem('urbanbite_public_settings', JSON.stringify(live));
      }
    } catch (err) {
      console.warn('Could not load public settings:', err?.message);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Socket.io real-time listener for settings updates from admin panel
    let socket;
    try {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
      socket.on('settings:updated', (updated) => {
        if (updated) {
          setSettings(prev => ({ ...prev, ...updated }));
          localStorage.setItem('urbanbite_public_settings', JSON.stringify(updated));
        }
      });
    } catch (e) {}

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, reloadSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  return context?.settings || DEFAULT_SETTINGS;
};
