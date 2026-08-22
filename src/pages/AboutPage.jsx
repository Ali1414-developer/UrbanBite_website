import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Flame, ShieldCheck, Heart, Clock, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { foodService } from '../services/foodService';

/**
 * AnimatedCounter component
 * Counts smoothly from 0 to target number when scrolled into viewport.
 */
const AnimatedCounter = ({ target, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) return;

    const totalSteps = 60;
    const stepDuration = (duration * 1000) / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // Smooth ease-out exponential curve
      const progress = 1 - Math.pow(2, -10 * (currentStep / totalSteps));
      const currentVal = Math.round(start + (end - start) * progress);

      if (currentStep >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentVal);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="font-sans font-extrabold text-3xl sm:text-4xl text-red-600 block tabular-nums tracking-tight">
      {count}{suffix}
    </span>
  );
};

export const AboutPage = () => {
  const [totalMenuCount, setTotalMenuCount] = useState(120);

  // Load live menu foods count dynamically from backend / cache
  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      try {
        const foods = await foodService.getAllFoods();
        if (isMounted && Array.isArray(foods) && foods.length > 0) {
          setTotalMenuCount(foods.length);
        }
      } catch (e) {
        console.warn('Could not load live food count for about page:', e);
      }
    };
    fetchCount();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Header (Aesthetic Light Design) */}
        <div className="bg-gradient-to-b from-red-50/70 via-neutral-50 to-white rounded-3xl p-8 sm:p-16 border border-neutral-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.12)] relative overflow-hidden text-center space-y-5">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-red-600 border border-red-100 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Passion & Heritage</span>
            </div>

            <h1 className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl text-neutral-900 tracking-tight leading-[1.15]">
              Serving <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">Fresh & Delicious Food</span> Since 2021
            </h1>

            <p className="text-neutral-600 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto pt-1">
              At UrbanBite, we set out with a simple mission: redefine modern casual dining with pure prime ingredients, explosive bold flavors, and welcoming hospitality.
            </p>
          </div>
        </div>

        {/* Story Grid */}
        <div id="story" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
              The UrbanBite Story
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
              From a Passionate Kitchen to Nationally Loved Flavors
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              UrbanBite was born from a simple mission: bring gourmet smash burgers and artisan stone-baked pizzas to food lovers without compromising on ingredient quality.
            </p>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Our 100% prime beef patties are smashed fresh daily, buttermilk chicken is marinated in house spices, and sourdough crusts are fermented for 48 hours for ultimate flavor.
            </p>

            {/* ── Functional Live Animated Metrics Counters ── */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
              <div>
                <AnimatedCounter target={totalMenuCount} suffix="+" duration={2} />
                <span className="text-xs text-neutral-500 font-medium mt-1 block">Handcrafted Menu Items</span>
              </div>
              <div>
                <AnimatedCounter target={7} suffix="+" duration={1.5} />
                <span className="text-xs text-neutral-500 font-medium mt-1 block">Flagship Branches</span>
              </div>
              <div>
                <AnimatedCounter target={100} suffix="k+" duration={2.2} />
                <span className="text-xs text-neutral-500 font-medium mt-1 block">Satisfied Foodies</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.12)] aspect-4/3 bg-neutral-100 border border-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
              alt="UrbanBite Restaurant Kitchen"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars / Values Section */}
        <div id="values" className="bg-neutral-50 rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
              Our Core Pillars
            </span>
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-neutral-900 mt-1">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-3 text-center sm:text-left bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto sm:mx-0">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-neutral-900 text-lg">Fresh, Never Frozen</h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                We partner directly with local farms for daily deliveries of fresh meats, crisp produce, and artisanal dairy.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-neutral-900 text-lg">100% Halal Certified</h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Every single ingredient and preparation method adheres strictly to certified Halal and international hygiene standards.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto sm:mx-0">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-neutral-900 text-lg">Customer Delight</h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                If an order isn't piping hot or completely satisfactory, our manager resolution team replaces it instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Hours & Active Deals Info Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-neutral-900 border border-neutral-200 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider">
                <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                URBAN FEAST PROMO ACTIVE
              </div>
              <h4 className="font-sans font-bold text-xl text-neutral-900 mt-0.5">
                Use code <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-600 font-mono font-bold text-base border border-red-100">URBAN20</span> for 20% OFF
              </h4>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                Valid on all burger combos, pizzas, and family feast orders across all branches.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold text-neutral-900 text-xs">Branch Hours</span>
                <span className="text-neutral-500 text-[11px]">11:00 AM – 02:00 AM Daily</span>
              </div>
            </div>

            <Link
              to="/restaurants"
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 group"
            >
              <MapPin className="w-4 h-4" />
              <span>Find Branches</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
