import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Phone, Mail, MapPin, Heart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const settings = useSettings();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = new FormData(e.target).get('newsletter_email');
    if (email) {
      toast.success('Thank you for subscribing to VIP Offers!');
      e.target.reset();
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={settings?.logo || '/logo.png'}
                alt={`${settings?.brandName || 'UrbanBite'} Logo`}
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-sans font-bold text-2xl sm:text-[28px] tracking-tight text-white">
                {settings?.brandName || 'UrbanBite'}
              </span>
            </Link>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              UrbanBite brings you premium handcrafted smash burgers, crispy buttermilk fried chicken, authentic stone-baked pizzas, and artisanal sides made fresh to order with the finest ingredients. Delivering hot and fresh across Pakistan.
            </p>
          </div>

          {/* Col 3: Quick Navigation (Navbar Sequence) */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase">
              {settings?.brandName || 'UrbanBite'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/" className="hover:text-red-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-red-500 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="hover:text-red-500 transition-colors">
                  Restaurants & Branches
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-red-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Explore Menu */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/menu" className="hover:text-red-500 transition-colors">
                  Full Menu (120+ Items)
                </Link>
              </li>
              <li>
                <Link to="/menu?category=burgers" className="hover:text-red-500 transition-colors">
                  Gourmet Burgers
                </Link>
              </li>
              <li>
                <Link to="/menu?category=pizza" className="hover:text-red-500 transition-colors">
                  Stone-Baked Pizza
                </Link>
              </li>
              <li>
                <Link to="/menu?category=chicken" className="hover:text-red-500 transition-colors">
                  Crispy Chicken & Wings
                </Link>
              </li>
              <li>
                <Link to="/menu?category=value-meals" className="hover:text-red-500 transition-colors">
                  Value Combo Meals
                </Link>
              </li>
              <li>
                <Link to="/menu?category=desserts" className="hover:text-red-500 transition-colors">
                  Desserts & Shakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Customer Support & Contact */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`tel:${settings?.contactPhone || '04211187226'}`} className="hover:text-red-500 transition-colors">
                  {settings?.contactPhone ? `Helpline: ${settings.contactPhone}` : 'UAN: 042-111-URBAN (87226)'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`mailto:${settings?.contactEmail || 'support@urbanbite.pk'}`} className="hover:text-red-500 transition-colors">
                  {settings?.contactEmail || 'support@urbanbite.pk'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{settings?.defaultBranch ? `${settings.defaultBranch} • Express Delivery` : 'Lahore • Islamabad • Multan • Faisalabad'}</span>
              </li>
            </ul>

          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex items-center justify-center text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings?.brandName || 'UrbanBite'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
