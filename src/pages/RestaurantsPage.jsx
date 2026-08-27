import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Search,
  Building2,
  CheckCircle2,
  Check,
  ArrowRight,
  Sparkles,
  Loader2,
  Lock,
  Moon,
  AlertCircle
} from 'lucide-react';
import restaurantService from '../services/restaurantService';
import { useLocation } from '../context/LocationContext';
import { isBranchOpen, getBranchStatusInfo } from '../utils/branchStatus';
import toast from 'react-hot-toast';

export const RestaurantsPage = () => {
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { changeBranch } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getAllRestaurants();
        if (isMounted) {
          setRestaurantsList(data || []);
        }
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBranches();
    return () => { isMounted = false; };
  }, []);

  const dynamicCities = ['All', ...Array.from(new Set(restaurantsList.map((r) => r.city).filter(Boolean)))];

  const filtered = restaurantsList.filter((r) => {
    const matchCity = selectedCity === 'All' || (r.city && r.city.toLowerCase() === selectedCity.toLowerCase());
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      (r.address && r.address.toLowerCase().includes(q)) ||
      (r.city && r.city.toLowerCase().includes(q)) ||
      (r.facilities && r.facilities.some((f) => f.toLowerCase().includes(q)));
    return matchCity && matchSearch;
  });

  const handleOrderHere = (branch) => {
    const open = isBranchOpen(branch);
    if (!open) {
      const { openTime } = getBranchStatusInfo(branch);
      toast.error(`"${branch.name}" is currently closed. Online orders and kitchen service open at ${openTime}. Please select an open branch nearby!`, {
        duration: 4500,
        icon: '🌙'
      });
      return;
    }
    changeBranch(branch);
    navigate('/menu');
  };

  const handleClosedBranchClick = (branch) => {
    const { openTime } = getBranchStatusInfo(branch);
    toast.error(
      `"${branch.name}" is currently closed. Orders will resume at ${openTime}. Please select another branch that is open now!`,
      { duration: 4500, icon: '🔒' }
    );
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-red-100/50 to-amber-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 inline-flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>Locations &amp; Dine-In</span>
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-stone-900 tracking-tight">
              Our Restaurant Branches
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
              Discover UrbanBite dining rooms, drive-thrus, and express kitchen hubs across Lahore, Islamabad, and Multan.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* City Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {dynamicCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-display transition-all ${
                  selectedCity === city
                    ? 'bg-red-600 text-white shadow-[0_6px_20px_rgba(220,38,38,0.35)]'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 shadow-2xs'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search branch name, street, area..."
              className="w-full pl-10 pr-4 py-2 bg-stone-100 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>
        </div>

        {/* Branches Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-sm font-medium">Loading restaurant branches from network...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <Building2 className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">No branches found</h3>
            <p className="text-stone-500 text-sm max-w-sm mx-auto">
              No restaurant branch matched your selected city or search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((branch, index) => {
              const { isOpen, openTime } = getBranchStatusInfo(branch);

              return (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-white rounded-3xl p-6 border shadow-xs transition-all duration-300 flex flex-col justify-between ${
                    isOpen
                      ? 'border-stone-200 hover:border-red-400/90 hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)]'
                      : 'border-red-200/80 bg-stone-50/50 hover:shadow-[0_12px_28px_rgba(239,68,68,0.2)]'
                  }`}
                >
                  <div>
                    {/* Branch Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                          {branch.city}
                        </span>
                        <h3 className="font-display font-black text-xl text-stone-900 mt-0.5">
                          {branch.name}
                        </h3>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 inline-flex items-center gap-1 ${
                          isOpen
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {isOpen ? '● Open Now' : '● Closed'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                      {branch.address}
                    </p>

                    {/* Info rows */}
                    <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>Hours:</strong> {branch.timing}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                        <span><strong>Phone:</strong> {branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                        <span className="font-bold text-stone-900">{branch.rating} rating</span>
                        <span className="text-stone-400">({branch.reviewCount} customer reviews)</span>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="pt-4">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                        Branch Amenities
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {branch.facilities.map((f, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-medium"
                          >
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Closed Notice Banner */}
                    {!isOpen && (
                      <div className="mt-4 p-3 rounded-2xl bg-red-50/90 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                        <Moon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Branch is currently closed</p>
                          <p className="text-[11px] text-red-600 mt-0.5">
                            Kitchen and online orders will open at {openTime}. Please select an open branch nearby to order now.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Button */}
                  <div className="pt-5 mt-5 border-t border-stone-100">
                    {isOpen ? (
                      <button
                        type="button"
                        onClick={() => handleOrderHere(branch)}
                        className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-display font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Select &amp; Order from here</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleClosedBranchClick(branch)}
                        className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-red-50 border border-stone-200 hover:border-red-200 text-stone-500 hover:text-red-700 font-display font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-not-allowed group"
                      >
                        <Lock className="w-4 h-4 text-stone-400 group-hover:text-red-500 transition-colors" />
                        <span>Closed • Orders Unavailable</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
