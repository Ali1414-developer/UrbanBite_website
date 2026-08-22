import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, UserPlus, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authRedirectUrl } = useAuth();
  const navigate = useNavigate();

  if (!isAuthModalOpen) return null;

  const handleLogin = () => {
    setIsAuthModalOpen(false);
    navigate(`/login?redirect=${encodeURIComponent(authRedirectUrl || '/checkout')}`);
  };

  const handleRegister = () => {
    setIsAuthModalOpen(false);
    navigate(`/register?redirect=${encodeURIComponent(authRedirectUrl || '/checkout')}`);
  };

  const handleContinueBrowsing = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs"
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-stone-100 text-center"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Header */}
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="UrbanBite Logo" className="w-14 h-14 object-contain" />
          </div>

          <h3 className="font-display font-black text-2xl text-stone-900 mb-2">
            Authentication Required
          </h3>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
            Please login to continue with your order and unlock fast checkout, real-time tracking, and exclusive member deals.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-3.5 px-5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl font-bold font-display text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Account</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-3.5 px-5 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white rounded-2xl font-bold font-display text-sm sm:text-base shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Create Free Account</span>
            </button>

            <button
              type="button"
              onClick={handleContinueBrowsing}
              className="w-full py-2.5 px-5 text-stone-500 hover:text-stone-800 font-medium text-xs sm:text-sm transition-colors"
            >
              Continue Browsing Menu
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
