import React, { createContext, useContext, useState, useEffect } from 'react';
import { restaurantService } from '../services/restaurantService';
import { restaurants as staticRestaurants } from '../data/restaurants';
import toast from 'react-hot-toast';

import { isBranchOpen, getBranchStatusInfo } from '../utils/branchStatus';

const LocationContext = createContext(null);
const USER_CITY_KEY = 'urbanbite_city';

export const LocationProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem(USER_CITY_KEY) || 'Lahore';
  });

  const [branches, setBranches] = useState(staticRestaurants);
  const [selectedBranch, setSelectedBranch] = useState(() => {
    return staticRestaurants.find(r => isBranchOpen(r)) || staticRestaurants[0];
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Fetch live restaurants from DB
  useEffect(() => {
    let isMounted = true;
    restaurantService.getAllRestaurants().then((liveList) => {
      if (isMounted && Array.isArray(liveList) && liveList.length > 0) {
        setBranches(liveList);
        // Prioritize open branch in selected city
        const openInCity = liveList.find(
          (r) => r.city && r.city.toLowerCase() === selectedCity.toLowerCase() && isBranchOpen(r)
        );
        const anyInCity = liveList.find(
          (r) => r.city && r.city.toLowerCase() === selectedCity.toLowerCase()
        );
        const firstOpen = liveList.find(r => isBranchOpen(r));
        setSelectedBranch(openInCity || anyInCity || firstOpen || liveList[0]);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(USER_CITY_KEY, selectedCity);
    // Auto sync selected branch to matching city (prefer open branch)
    const openBranchInCity = branches.find(
      (r) => r.city && r.city.toLowerCase() === selectedCity.toLowerCase() && isBranchOpen(r)
    );
    const branchInCity = branches.find(
      (r) => r.city && r.city.toLowerCase() === selectedCity.toLowerCase()
    );
    if (openBranchInCity) {
      setSelectedBranch(openBranchInCity);
    } else if (branchInCity) {
      setSelectedBranch(branchInCity);
    }
  }, [selectedCity, branches]);

  const changeCity = (city) => {
    setSelectedCity(city);
    const openBranch = branches.find(
      (r) => r.city && r.city.toLowerCase() === city.toLowerCase() && isBranchOpen(r)
    );
    const branch = branches.find(
      (r) => r.city && r.city.toLowerCase() === city.toLowerCase()
    );
    const targetBranch = openBranch || branch;
    if (targetBranch) {
      setSelectedBranch(targetBranch);
      if (isBranchOpen(targetBranch)) {
        toast.success(`Ordering location set to ${city} (${targetBranch.name})`);
      } else {
        const { openTime } = getBranchStatusInfo(targetBranch);
        toast(`Location set to ${city}. Note: ${targetBranch.name} is currently closed (Opens at ${openTime}).`, {
          icon: '🌙',
          duration: 4000
        });
      }
    } else {
      toast.error('Branch not found for selected city.');
    }
    setIsLocationModalOpen(false);
  };

  const changeBranch = (branch) => {
    const b = typeof branch === 'string'
      ? branches.find((r) => r.id === branch || r._id === branch || r.slug === branch)
      : branch;
    if (b) {
      if (!isBranchOpen(b)) {
        const { openTime } = getBranchStatusInfo(b);
        toast.error(
          `"${b.name}" is currently closed. Online orders will open at ${openTime}. Please select an open branch!`,
          { duration: 4500, icon: '🔒' }
        );
        return false;
      }
      setSelectedBranch(b);
      setSelectedCity(b.city);
      toast.success(`Active branch set to ${b.name}`);
      setIsLocationModalOpen(false);
      return true;
    }
    setIsLocationModalOpen(false);
    return false;
  };

  const dynamicCities = Array.from(new Set(branches.map((r) => r.city).filter(Boolean)));

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        selectedBranch,
        branches,
        cities: dynamicCities,
        changeCity,
        changeBranch,
        isLocationModalOpen,
        setIsLocationModalOpen
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
