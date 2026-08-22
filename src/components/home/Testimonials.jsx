import React from 'react';
import { Star, Quote } from 'lucide-react';
import testimonials from '../../data/testimonials';
import PageContainer from '../layout/PageContainer';

export const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <PageContainer>
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Customer Love</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">What Food Lovers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative rounded-3xl bg-slate-50 p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 text-slate-200" size={40} />
              <div className="relative z-10">
                <div className="flex items-center text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">"{t.content}"</p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-200/60 mt-6">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[10px] text-slate-500">{t.role} • {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default Testimonials;
