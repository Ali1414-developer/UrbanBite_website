import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus, User, Mail, Phone, Lock, Flame, ArrowRight, ShieldCheck, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePhone, validatePassword } from '../utils/validation';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Lahore',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 11-digit phone number (e.g. 03001234567)');
      return;
    }

    const passCheck = validatePassword(formData.password);
    if (!passCheck.isValid) {
      setError(passCheck.message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        password: formData.password
      });
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-stone-50">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-[0_10px_35px_rgba(0,0,0,0.12)] space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center mb-1 group">
            <img
              src="/logo.png"
              alt="UrbanBite Logo"
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Join UrbanBite VIP Club for express checkout, order tracking, and 20% OFF deals
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ali Raza"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Phone (11 Digits) *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03001234567"
                  maxLength={11}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="aliraza777212@gmail.com"
                required
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 font-medium"
              >
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Multan">Multan</option>
                <option value="Faisalabad">Faisalabad</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Default Address (Optional)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Sector Y, DHA Phase 6"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 focus:outline-none"
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 focus:outline-none"
                  tabIndex="-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            className="text-amber-600 font-bold hover:underline"
          >
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
