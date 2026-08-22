import React from 'react';
import { motion } from 'motion/react';
import { Flame, ShieldCheck, Zap, HeartHandshake, Award, Utensils, Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

export const WhyChooseUsSection = () => {
  const features = [
    {
      icon: Flame,
      title: 'Fresh Prime Ingredients',
      description: '100% pure smash patties and fresh chicken marinated with natural spices daily.'
    },
    {
      icon: Zap,
      title: 'Express 30-Min Delivery',
      description: 'Thermal insulated packaging guarantees your food arrives sizzling hot.'
    },
    {
      icon: ShieldCheck,
      title: '100% Certified Clean',
      description: 'Audited open kitchens adhering to strict international hygiene standards.'
    },
    {
      icon: Award,
      title: 'Crafted by Chefs',
      description: 'Signature recipes featuring house-made secret sauces and artisanal crusts.'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-stone-100/60 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* Features Pillars Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              The UrbanBite Promise
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-stone-900 mt-1">
              Why Food Lovers Choose Us
            </h2>
            <p className="text-stone-500 text-sm sm:text-base mt-2">
              Uncompromising quality, explosive flavors, and unmatched customer care in every bite.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 transition-all duration-300 text-center sm:text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-stone-900 text-lg mb-2">
                    {f.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Customer Testimonials Carousel/Grid */}
        <div className="pt-8 border-t border-stone-200/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              Customer Love
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-1">
              What Foodies Say About UrbanBite
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-stone-400">{t.dish}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-stone-700 text-sm italic leading-relaxed mb-6">
                    "{t.comment}"
                  </p>
                </div>

                {/* Author info */}
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <h4 className="font-display font-bold text-stone-900 text-sm">
                      {t.name}
                    </h4>
                    <p className="text-xs text-stone-400">{t.city} • Verified Foodie</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
