import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryBar } from '../components/home/CategoryBar';
import { PopularFoodSection } from '../components/home/PopularFoodSection';
import { DealsPromoSection } from '../components/home/DealsPromoSection';
import { LocationFinderSection } from '../components/home/LocationFinderSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { FoodModal } from '../components/common/FoodModal';

export const HomePage = () => {
  const [selectedFood, setSelectedFood] = useState(null);

  return (
    <div>
      {/* Hero Banner with CTA */}
      <HeroSection />

      {/* Category Strip */}
      <CategoryBar />

      {/* Customer Favorites Food Grid */}
      <PopularFoodSection onSelectFood={(food) => setSelectedFood(food)} />

      {/* Deals & Promotional Coupons */}
      <DealsPromoSection />

      {/* Location / Branch Finder */}
      <LocationFinderSection />

      {/* Brand Values & Testimonials */}
      <WhyChooseUsSection />

      {/* Product Detail Modal */}
      <FoodModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
