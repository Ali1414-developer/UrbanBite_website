import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Tag, Copy, Check } from 'lucide-react';
import { offers as defaultOffers } from '../../data/offers';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DealsPromoSection = () => {
  const navigate = useNavigate();
  const { applyPromoCode } = useCart();
  const [copiedCode, setCopiedCode] = useState(null);
  const [dealsList, setDealsList] = useState(defaultOffers);

  useEffect(() => {
    let isMounted = true;
    api.get('/promos').then(({ data }) => {
      if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
        const mapped = data.data.map((p, idx) => ({
          id: p._id || p.id || `promo-${idx}`,
          title: p.title || p.description || `${p.code} Discount`,
          description: p.description || `Get ${p.discountPercent || p.discountAmount || 20}% off your order!`,
          code: p.code,
          badge: p.discountPercent ? `${p.discountPercent}% OFF` : p.discountAmount ? `Rs. ${p.discountAmount} OFF` : 'SPECIAL OFFER',
          tag: p.minimumOrder ? `Min. order Rs. ${p.minimumOrder}` : 'Limited Time Offer',
          image: p.image || defaultOffers[idx % defaultOffers.length]?.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
        }));
        setDealsList(mapped);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyPromoCode(code);
    toast.success(`Promo code "${code}" copied & applied!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-16 sm:py-20 bg-amber-50/60 border-y border-amber-100 relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 text-xs font-bold mb-3 border border-amber-300/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Promotions</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight">
            Good Food. Better Deals.
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-2">
            Enjoy unbeatable savings on your favorite burgers, combos, and family-sized meal boxes.
          </p>
        </div>

        {/* Promo Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealsList.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-red-400/90 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Offer Image Frame */}
              <div className="relative w-full h-44 overflow-hidden bg-stone-100">
                <img
                  src={offer.image}
                  alt={offer.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Offer Discount Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white shadow-md">
                    {offer.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-xs font-medium text-amber-200">
                  {offer.tag}
                </div>
              </div>

              {/* Offer Content */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-stone-900 text-lg group-hover:text-amber-600 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Coupon Code & Order CTA */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(offer.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-amber-700 text-xs font-mono font-bold transition-all"
                  >
                    {copiedCode === offer.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{offer.code}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      applyPromoCode(offer.code);
                      navigate('/menu');
                    }}
                    className="px-4 py-2 sm:px-5 sm:py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs sm:text-sm font-bold font-display shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Claim</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
