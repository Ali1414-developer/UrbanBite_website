import React from 'react';
import { Link } from 'react-router-dom';
import { X, Flame, Utensils, MapPin, Info, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

export const MobileMenu = ({ isOpen, onClose }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-10 w-full max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <Link to="/" onClick={onClose} className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white">
                    <Flame size={20} fill="currentColor" />
                  </div>
                  <span className="text-lg font-black text-slate-900">UrbanBite</span>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-2">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Flame size={18} /> Home
                </Link>
                <Link
                  to="/menu"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Utensils size={18} /> Full Food Menu
                </Link>
                <Link
                  to="/restaurants"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                >
                  <MapPin size={18} /> City Branches
                </Link>
                <Link
                  to="/about"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Info size={18} /> About UrbanBite
                </Link>
              </nav>
            </div>

            {/* User Auth Section */}
            <div className="border-t border-slate-100 pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-2 px-2">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt="User"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{currentUser?.fullName}</p>
                      <p className="text-xs text-slate-500">{currentUser?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <User size={16} /> My Account Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="flex w-full items-center justify-center rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-700"
                  >
                    Register Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
