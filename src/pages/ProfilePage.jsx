import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  Heart,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  LogOut,
  Save,
  ShoppingBag,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { foodService } from '../services/foodService';
import { FoodCard } from '../components/common/FoodCard';
import { validatePhone } from '../utils/validation';
import toast from 'react-hot-toast';
import { FoodModal } from '../components/common/FoodModal';
import { useCart } from '../context/CartContext';

export const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details'; // 'details', 'favorites'

  const { currentUser, isAuthenticated, updateProfile, logout, promptLogin } = useAuth();
  const { favorites } = useFavorites();
  const { addToCart } = useCart();
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodsList, setFoodsList] = useState(() => foodService.getCachedFoods());
  const navigate = useNavigate();

  useEffect(() => {
    foodService.getAllFoods().then((list) => {
      if (Array.isArray(list) && list.length > 0) setFoodsList(list);
    }).catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    city: currentUser?.city || 'Lahore',
    address: currentUser?.address || ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        city: currentUser.city || 'Lahore',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <User className="w-16 h-16 mx-auto text-stone-400" />
        <h2 className="font-display font-bold text-2xl text-stone-900">Sign in to view your profile</h2>
        <p className="text-stone-500 text-sm">Access your saved favorites, address book, and order history.</p>
        <button
          type="button"
          onClick={() => promptLogin('/profile')}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm"
        >
          Login to Account
        </button>
      </div>
    );
  }

  const favoriteFoodItems = foodsList.filter(
    (f) => favorites.includes(f.id) || favorites.includes(f._id) || favorites.includes(f.slug)
  );

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Please enter a valid 11-digit Pakistani phone number (e.g. 03001234567)');
      return;
    }
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0">
              {currentUser.name?.charAt(0) || 'U'}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                UrbanBite VIP Member
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900">
                {currentUser.name}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentUser.email} • {currentUser.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold text-stone-800 transition-colors shadow-2xs"
            >
              Order History
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 gap-4">
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'details' })}
            className={`pb-3 font-display font-bold text-sm sm:text-base border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Delivery Address</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'favorites' })}
            className={`pb-3 font-display font-bold text-sm sm:text-base border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-4 h-4 text-red-500" />
            <span>Saved Favorites ({favorites.length})</span>
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] max-w-2xl"
          >
            <h3 className="font-display font-bold text-stone-900 text-lg mb-4">
              Edit Account Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number (11 Digits)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="03001234567"
                  maxLength={11}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 font-semibold"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Multan">Multan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Default Delivery Address</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House 42, Street 7, Sector Y, DHA Phase 6..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* Tab 2: Favorites */}
        {activeTab === 'favorites' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {favoriteFoodItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
                <Heart className="w-12 h-12 mx-auto text-stone-300 mb-2" />
                <h3 className="font-display font-bold text-lg text-stone-900">No favorite dishes yet</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-5">
                  Click the heart icon on any burger, pizza, or dessert in our menu to save it here!
                </p>
                <Link to="/menu" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteFoodItems.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onSelectFood={(item) => setSelectedFood(item)}
                    onQuickAdd={(item) => addToCart(item, 1, '')}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <FoodModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
