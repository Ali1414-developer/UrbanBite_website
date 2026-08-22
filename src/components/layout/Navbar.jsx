import React, { useState, useEffect } from 'react';
import { Link, useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu as MenuIcon,
  X,
  Search,
  MapPin,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  LogIn,
  LogOut,
  Flame,
  UtensilsCrossed,
  Store,
  Clock,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { MegaMenu } from './MegaMenu';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useLocation } from '../../context/LocationContext';
import { useSettings } from '../../context/SettingsContext';
import staticCategories from '../../data/categories';
import { categoryService } from '../../services/categoryService';

export const Navbar = ({ onOpenSearch }) => {
  const settings = useSettings();
  const [categoriesList, setCategoriesList] = useState(() => categoryService.getCachedCategories());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileMenuCategoriesOpen, setMobileMenuCategoriesOpen] = useState(false);

  const { totals, openCart } = useCart();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { count: favoritesCount } = useFavorites();
  const { selectedCity, selectedBranch, setIsLocationModalOpen } = useLocation();

  const routerLocation = useRouterLocation();
  const navigate = useNavigate();

  // Load dynamic categories
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const liveCats = await categoryService.getAllCategories();
        if (isMounted && Array.isArray(liveCats) && liveCats.length > 0) {
          setCategoriesList(liveCats);
        }
      } catch (err) {
        console.warn('Failed to load dynamic categories for Navbar:', err);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [routerLocation.pathname]);

  const isActivePath = (path) => {
    if (path === '/' && routerLocation.pathname === '/') return true;
    if (path !== '/' && routerLocation.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-200/80 py-2.5'
            : 'bg-white/95 backdrop-blur-md border-b border-stone-200/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={settings?.logo || '/logo.png'}
              alt={`${settings?.brandName || 'UrbanBite'} Logo`}
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-display font-extrabold text-2xl sm:text-[28px] tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors">
              {settings?.brandName || 'UrbanBite'}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActivePath('/')
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-700 hover:text-red-600 hover:bg-neutral-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActivePath('/about')
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-700 hover:text-red-600 hover:bg-neutral-50'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/menu"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActivePath('/menu')
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-700 hover:text-red-600 hover:bg-neutral-50'
              }`}
            >
              Menu
            </Link>

            <Link
              to="/restaurants"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActivePath('/restaurants')
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-700 hover:text-red-600 hover:bg-neutral-50'
              }`}
            >
              Restaurants
            </Link>

            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActivePath('/contact')
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-700 hover:text-red-600 hover:bg-neutral-50'
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location Selector Pill */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-red-50 border border-neutral-200 text-xs font-medium text-neutral-800 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="max-w-[130px] truncate font-medium">
                {selectedCity} ({selectedBranch?.name ? selectedBranch.name.replace('UrbanBite ', '') : 'Branch'})
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search dishes"
              className="p-2.5 rounded-full text-neutral-600 hover:text-red-600 hover:bg-neutral-100 transition-colors relative"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Count */}
            <Link
              to={isAuthenticated ? '/profile?tab=favorites' : '/login'}
              aria-label="Favorites"
              className="p-2.5 rounded-full text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors relative hidden sm:block"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 group"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                {totals.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {totals.itemCount}
                  </span>
                )}
              </div>
              <span className="hidden xs:inline">
                Cart {totals.itemCount > 0 && `(${totals.itemCount})`}
              </span>
            </button>

            {/* User Profile / Authentication Menu (Desktop/Tablet) */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-bold text-stone-800 hidden md:inline max-w-[90px] truncate">
                    {currentUser?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-stone-400 truncate">{currentUser.email}</p>
                      </div>

                      <div className="p-1 space-y-0.5 text-xs font-semibold text-stone-700">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 hover:text-red-600 transition-colors"
                        >
                          <User className="w-4 h-4 text-stone-400" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 hover:text-red-600 transition-colors"
                        >
                          <ClipboardList className="w-4 h-4 text-stone-400" />
                          <span>Order History</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left font-bold cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-display font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-colors"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-2xl bg-neutral-100 hover:bg-red-50 text-neutral-800 hover:text-red-600 border border-neutral-200/80 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-red-600" />
              ) : (
                <MenuIcon className="w-5 h-5 text-neutral-800" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-stone-200/90 shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="p-4 space-y-4">
              {/* User Bar on Mobile */}
              {isAuthenticated ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-bold text-sm flex items-center justify-center">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 leading-tight">{currentUser.name}</p>
                      <p className="text-[11px] text-stone-500 leading-tight">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-xs font-bold text-red-600 hover:underline px-2 py-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-sm text-center"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs border border-neutral-200 text-center"
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Location Selector Mobile */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLocationModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-50/70 border border-red-200/80 text-red-950 text-xs font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Branch: {selectedCity} • {selectedBranch?.name}</span>
                </div>
                <span className="text-red-700 text-[11px] underline">Change</span>
              </button>

              {/* Navigation Links */}
              <div className="space-y-1 text-sm font-bold text-stone-800">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800"
                >
                  <span>Home</span>
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800"
                >
                  <span>About Us</span>
                </Link>

                <Link
                  to="/menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800"
                >
                  <span>Menu</span>
                </Link>

                {/* Mobile Menu Categories Dropdown */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuCategoriesOpen(!mobileMenuCategoriesOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800 text-left cursor-pointer"
                  >
                    <span>Browse Categories ({categoriesList.length})</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 transition-transform ${
                        mobileMenuCategoriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileMenuCategoriesOpen && (
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-stone-50 rounded-2xl mt-1 border border-stone-200/60">
                      {categoriesList.map((cat) => (
                        <Link
                          key={cat._id || cat.id || cat.slug}
                          to={`/menu?category=${cat.slug || cat.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2 rounded-xl bg-white hover:bg-red-50 border border-stone-200/60 text-xs font-semibold text-stone-800 flex items-center gap-2 transition-colors"
                        >
                          <img
                            src={cat.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                            alt={cat.name}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <span className="truncate">{cat.name}</span>
                        </Link>
                      ))}
                      <Link
                        to="/menu"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="col-span-2 text-center p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                      >
                        Explore Full Menu →
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/restaurants"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800"
                >
                  <span>Restaurants & Locations</span>
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800"
                >
                  <span>Contact Us</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <div className="pt-2 border-t border-stone-200" />
                    <Link
                      to="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800"
                    >
                      <ClipboardList className="w-4 h-4 text-red-600" />
                      <span>My Order History</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-stone-100 text-stone-800"
                    >
                      <User className="w-4 h-4 text-red-600" />
                      <span>Customer Profile</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
