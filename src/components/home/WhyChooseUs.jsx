import React from 'react';
import { Truck, ShieldCheck, ChefHat, Sparkles } from 'lucide-react';
import PageContainer from '../layout/PageContainer';

export const WhyChooseUs = () => {
  const features = [
    {
      icon: Truck,
      title: 'Ultra Fast 30-Min Delivery',
      description: 'Hot thermal insulated bags guarantee your food arrives piping hot.',
    },
    {
      icon: ChefHat,
      title: 'Master Chefs & Fresh Herbs',
      description: 'Crafted daily with 100% prime beef and fresh organic vegetables.',
    },
    {
      icon: ShieldCheck,
      title: '100% Halal & Hygienic',
      description: 'Certified food safety handling with sealed tamper-proof packaging.',
    },
    {
      icon: Sparkles,
      title: 'Zero Delivery Fee Above Rs. 1500',
      description: 'Order for family or friends and enjoy free delivery on us.',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <PageContainer>
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">The UrbanBite Standard</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Why Foodies Love Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, index) => {
            const Icon = f.icon;
            return (
              <div
                key={index}
                className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/70 hover:shadow-xl transition-all"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <Icon size={24} />
                </div>
                <h4 className="text-base font-bold text-slate-900">{f.title}</h4>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
};

export default WhyChooseUs;
