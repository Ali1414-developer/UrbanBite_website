import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Check, Clock, Phone, Building2, Lock, Moon } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { isBranchOpen, getBranchStatusInfo } from '../../utils/branchStatus';
import toast from 'react-hot-toast';

export const LocationModal = () => {
  const { selectedCity, selectedBranch, branches = [], cities = [], changeCity, changeBranch, isLocationModalOpen, setIsLocationModalOpen } =
    useLocation();

  if (!isLocationModalOpen) return null;

  const displayCities = cities && cities.length > 0 ? cities : ['Lahore', 'Islamabad', 'Multan'];
  const branchesInCity = branches.filter((r) => r.city && r.city.toLowerCase() === selectedCity.toLowerCase());

  const handleBranchSelect = (branch) => {
    const open = isBranchOpen(branch);
    if (!open) {
      const { openTime } = getBranchStatusInfo(branch);
      toast.error(
        `"${branch.name}" is currently closed. Online orders will resume at ${openTime}. Please choose an open branch!`,
        { duration: 4500, icon: '🔒' }
      );
      return;
    }
    changeBranch(branch);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsLocationModalOpen(false)}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-5 sm:p-6 z-10 border border-stone-200/80 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Select Your City &amp; Branch
                </h3>
                <p className="text-xs text-stone-500">
                  Choose your nearest open UrbanBite kitchen for faster delivery &amp; pickup
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* City Selection Tabs */}
          <div className="py-4">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 block">
              1. Choose City
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {displayCities.map((city) => {
                const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => changeCity(city)}
                    className={`py-2.5 px-3 rounded-xl font-display font-bold text-sm transition-all border text-center ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Branch Selection List */}
          <div className="flex-1 overflow-y-auto pr-1">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 block">
              2. Select Branch in {selectedCity} (Only open branches can accept orders)
            </label>
            <div className="space-y-2.5">
              {branchesInCity.map((branch) => {
                const { isOpen, openTime } = getBranchStatusInfo(branch);
                const isBranchActive = selectedBranch?.id === branch.id;

                return (
                  <div
                    key={branch.id}
                    onClick={() => handleBranchSelect(branch)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      !isOpen
                        ? 'bg-stone-50/70 border-stone-200/80 opacity-75 cursor-not-allowed'
                        : isBranchActive
                        ? 'bg-red-50/70 border-red-400 ring-1 ring-red-400/50 cursor-pointer'
                        : 'bg-white border-stone-200 hover:border-red-300 hover:bg-stone-50/60 cursor-pointer'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-stone-900 text-sm sm:text-base">
                          {branch.name}
                        </h4>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            isOpen
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">{branch.address}</p>
                      <div className="flex items-center gap-4 text-xs text-stone-600 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {branch.timing}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          {branch.phone}
                        </span>
                      </div>

                      {!isOpen && (
                        <p className="text-[11px] text-red-600 font-semibold pt-1 flex items-center gap-1">
                          <Moon className="w-3 h-3 text-red-500" />
                          <span>Closed • Orders resume at {openTime}</span>
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 pt-1">
                      {!isOpen ? (
                        <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center" title="Branch is closed">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      ) : isBranchActive ? (
                        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-stone-300" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
