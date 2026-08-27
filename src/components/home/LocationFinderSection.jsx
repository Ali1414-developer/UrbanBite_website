import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, ArrowRight, Building2, CheckCircle2, Lock, Moon } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { isBranchOpen, getBranchStatusInfo } from '../../utils/branchStatus';
import toast from 'react-hot-toast';

export const LocationFinderSection = () => {
  const [activeCity, setActiveCity] = useState('All');
  const navigate = useNavigate();
  const { branches = [], cities = [], changeBranch } = useLocation();

  const displayCities = ['All', ...(cities.length > 0 ? cities : ['Lahore', 'Islamabad', 'Multan'])];

  const filteredBranches =
    activeCity === 'All'
      ? branches.slice(0, 4)
      : branches.filter((r) => r.city && r.city.toLowerCase() === activeCity.toLowerCase());

  const handleOrderFromBranch = (branch) => {
    const open = isBranchOpen(branch);
    if (!open) {
      const { openTime } = getBranchStatusInfo(branch);
      toast.error(
        `"${branch.name}" is currently closed. Online orders will resume at ${openTime}. Please select an open branch nearby!`,
        { duration: 4500, icon: '🌙' }
      );
      return;
    }
    changeBranch(branch);
    navigate('/menu');
  };

  const handleClosedClick = (branch) => {
    const { openTime } = getBranchStatusInfo(branch);
    toast.error(
      `"${branch.name}" is currently closed. Online orders open at ${openTime}. Please choose an open branch!`,
      { duration: 4500, icon: '🔒' }
    );
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — centered */}
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-amber-600">
            Dine-in, Takeaway & Delivery
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-stone-900 mt-1">
            Find an UrbanBite Near You
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-1 max-w-xl mx-auto">
            Visit our vibrant branch dining rooms or order express hot delivery across top cities.
          </p>
        </div>

        {/* City Filter Pills — centered below heading */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {displayCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setActiveCity(city)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-display transition-all ${
                activeCity === city
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Branches Grid — 3 Equal Balanced Columns in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {filteredBranches.map((branch, index) => {
            const { isOpen, openTime } = getBranchStatusInfo(branch);

            return (
              <motion.div
                key={branch.id || branch.slug || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className={`bg-white rounded-3xl p-6 border shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full ${
                  isOpen
                    ? 'border-stone-200 hover:border-red-400/90 hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)]'
                    : 'border-red-200/80 bg-stone-50/50'
                }`}
              >
                {/* Branch Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                          {branch.city}
                        </span>
                        <h3 className="font-display font-bold text-stone-900 text-base">
                          {branch.name.replace('UrbanBite ', '')}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        isOpen
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {isOpen ? '● Open' : '● Closed'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                    {branch.address}
                  </p>

                  {/* Meta details */}
                  <div className="space-y-2 text-xs text-stone-600 border-t border-stone-200/60 pt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-[11px]">{branch.timing}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-[11px]">{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span className="text-[11px] font-bold text-stone-800">{branch.rating} rating</span>
                      <span className="text-[10px] text-stone-400">({branch.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Facilities Pills */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(branch.facilities || ['Dine-In', 'Takeaway', 'Express Delivery']).slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] font-medium text-stone-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {!isOpen && (
                    <div className="mt-3 p-2 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-[11px] text-red-700 font-semibold">
                      <Moon className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Closed • Opens at {openTime}</span>
                    </div>
                  )}
                </div>

                {/* Order action */}
                <div className="pt-4 mt-4 border-t border-stone-200/60">
                  {isOpen ? (
                    <button
                      type="button"
                      onClick={() => handleOrderFromBranch(branch)}
                      className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold font-display shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Order from this Branch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleClosedClick(branch)}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-red-50 border border-stone-200 hover:border-red-200 text-stone-500 hover:text-red-700 text-xs font-bold font-display transition-all flex items-center justify-center gap-1.5 cursor-not-allowed group"
                    >
                      <Lock className="w-3.5 h-3.5 text-stone-400 group-hover:text-red-500" />
                      <span>Branch Closed</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all restaurants link */}
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => navigate('/restaurants')}
            className="inline-flex items-center gap-2 text-stone-700 hover:text-amber-600 font-display font-bold text-sm underline underline-offset-4"
          >
            <span>View all restaurant branch locations & directions →</span>
          </button>
        </div>
      </div>
    </section>
  );
};
