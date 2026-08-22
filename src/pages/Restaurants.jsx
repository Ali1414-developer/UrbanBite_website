import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import RestaurantFilters from '../components/restaurant/RestaurantFilters';
import restaurantService from '../services/restaurantService';
import EmptyState from '../components/common/EmptyState';

export const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'all';

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restaurantService.getAllRestaurants().then((res) => {
      setRestaurantsList(res);
      setIsLoading(false);
    });
  }, []);

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurantsList];

    if (selectedCity !== 'all') {
      result = result.filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q)
      );
    }

    return result;
  }, [restaurantsList, selectedCity, searchQuery]);

  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white py-10 border-b border-stone-200 shadow-2xs">
        <PageContainer>
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">UrbanBite Outlets</span>
            <h1 className="text-3xl font-extrabold sm:text-4xl text-stone-900 font-display">Our Restaurant Branches</h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Locate nearby UrbanBite dining, drive-thru, and express takeaway locations across Pakistan.
            </p>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="pt-8">
        <RestaurantFilters
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <EmptyState
            title="No branches found"
            description="We could not find any branch matching your selected city or search filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </PageContainer>
    </main>
  );
};

export default Restaurants;
