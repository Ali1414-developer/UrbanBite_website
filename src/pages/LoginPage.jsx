import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Lock, Mail, Flame, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-stone-50">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-6"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center mb-1 group">
            <img
              src="/logo.png"
              alt="UrbanBite Logo"
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900">
            Welcome to Urban<span className="text-red-600">Bite</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Sign in to track orders, save favorites, and claim member discounts
          </p>
        </div>

        {/* 1-Click Demo Accounts Pill */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Quick 1-Click Demo Logins:</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('aliraza777212@gmail.com', 'Password123!')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-100/70 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 transition-colors truncate"
            >
              Demo: Ali Raza
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('sara@example.com', 'Password123!')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-100/70 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 transition-colors truncate"
            >
              Demo: Sara Ahmed
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 focus:outline-none"
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 text-xs text-stone-500">
          Don't have an UrbanBite account yet?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-amber-600 font-bold hover:underline"
          >
            Create Free Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
