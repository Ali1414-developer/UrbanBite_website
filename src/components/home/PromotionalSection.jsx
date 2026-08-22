import React from 'react';
import { Tag, Copy, Check } from 'lucide-react';
import offers from '../../data/offers';
import PageContainer from '../layout/PageContainer';
import { useState } from 'react';

export const PromotionalSection = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section className="py-16 bg-slate-900 text-white">
      <PageContainer>
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Deals & Coupons</span>
          <h2 className="text-3xl font-extrabold mt-1">Exclusive Urban Discounts</h2>
          <p className="text-xs text-slate-400 mt-2">Apply promo codes during checkout to save big on your orders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${offer.bgGradient} p-6 shadow-xl text-white flex flex-col justify-between`}
            >
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-[11px] font-bold backdrop-blur-md">
                  <Tag size={12} /> Special Voucher
                </span>
                <h3 className="text-xl font-black mt-3">{offer.title}</h3>
                <p className="text-xs text-white/80 mt-1">{offer.description}</p>
              </div>

              <div className="relative z-10 pt-6 flex items-center justify-between">
                <div className="rounded-xl bg-black/30 px-3.5 py-1.5 backdrop-blur-md border border-white/20">
                  <span className="font-mono text-sm font-bold tracking-widest">{offer.code}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className="flex items-center gap-1 rounded-xl bg-white text-slate-900 px-3 py-1.5 text-xs font-bold shadow-md hover:bg-slate-100 transition-all"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check size={14} className="text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};

export default PromotionalSection;
