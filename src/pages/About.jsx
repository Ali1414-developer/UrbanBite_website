import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Flame, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export const About = () => {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 py-16 text-white text-center border-b border-slate-800">
        <PageContainer>
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Our Story</span>
            <h1 className="text-4xl font-extrabold">About UrbanBite Foods</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Pioneering taste, speed, and quality in Pakistani fast-food dining since 2020.
            </p>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="pt-16 space-y-16">
        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <Flame size={16} /> Flame-Grilled Excellence
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Redefining Fast Food With Uncompromised Taste
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              UrbanBite was born out of a simple passion: to serve restaurant-grade, freshly smashed beef burgers, hand-breaded crispy zinger chicken, and artisanal pizzas made with zero compromises on quality.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We source our prime beef from certified local farms, grind our patties daily, and deliver food hot with state-of-the-art thermal packaging technology across Lahore, Islamabad, and Multan.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="UrbanBite Kitchen"
              className="h-80 w-full object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Halal Certified</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strict compliance with international hygiene protocols and 100% Halal certified meats.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Award Winning Taste</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Voted Best Smash Burger and Fried Chicken App in Lahore & Islamabad for 2 consecutive years.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HeartHandshake size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Community & Sustainability</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Committed to eco-friendly biodegradable packaging and supporting local Pakistani farmers.
            </p>
          </div>
        </div>
      </PageContainer>
    </main>
  );
};

export default About;
