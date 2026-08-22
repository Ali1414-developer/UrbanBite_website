import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RestaurantHero from '../components/restaurant/RestaurantHero';
import BranchInformation from '../components/restaurant/BranchInformation';
import OpeningHours from '../components/restaurant/OpeningHours';
import RestaurantLocation from '../components/restaurant/RestaurantLocation';
import PageContainer from '../components/layout/PageContainer';
import foodService from '../services/foodService';
import restaurantService from '../services/restaurantService';
import FoodGrid from '../components/menu/FoodGrid';
import Button from '../components/common/Button';

export const RestaurantDetails = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [branchMenu, setBranchMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      restaurantService.getRestaurantByIdOrSlug(restaurantId),
      foodService.getAllFoods({ limit: 8 }),
    ]).then(([restRes, foodsRes]) => {
      setRestaurant(restRes);
      setBranchMenu(foodsRes);
      setIsLoading(false);
    });
  }, [restaurantId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Branch Not Found</h2>
        <Link to="/restaurants" className="text-rose-600 font-bold mt-2 inline-block">
          Back to all branches
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <RestaurantHero restaurant={restaurant} />

      <PageContainer className="pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Branch Features & Hours Sidebar */}
          <div className="space-y-6">
            <BranchInformation restaurant={restaurant} />
            <OpeningHours restaurant={restaurant} />
            <RestaurantLocation restaurant={restaurant} />
          </div>

          {/* Branch Special Menu */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Specialities</span>
                <h2 className="text-2xl font-extrabold text-slate-900">Popular at {restaurant.name}</h2>
              </div>
              <Link to="/menu">
                <Button variant="outline" size="sm">
                  View Complete Menu
                </Button>
              </Link>
            </div>

            <FoodGrid foods={branchMenu} />
          </div>
        </div>
      </PageContainer>
    </main>
  );
};

export default RestaurantDetails;
