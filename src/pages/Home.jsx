import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CityFinder from '../components/home/CityFinder';
import PopularCategories from '../components/home/PopularCategories';
import PopularFoods from '../components/home/PopularFoods';
import PromotionalSection from '../components/home/PromotionalSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import AppPromotion from '../components/home/AppPromotion';

export const Home = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <HeroSection />
      <CityFinder />
      <PopularCategories />
      <PopularFoods />
      <PromotionalSection />
      <WhyChooseUs />
      <Testimonials />
      <AppPromotion />
    </main>
  );
};

export default Home;
