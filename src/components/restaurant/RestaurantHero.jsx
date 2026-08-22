import React from 'react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';
import Badge from '../common/Badge';
import PageContainer from '../layout/PageContainer';

export const RestaurantHero = ({ restaurant }) => {
  if (!restaurant) return null;

  return (
    <div className="relative bg-slate-950 text-white py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src={restaurant.coverImage} alt={restaurant.name} className="h-full w-full object-cover blur-sm" />
      </div>

      <PageContainer className="relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-36 w-36 rounded-3xl object-cover border-4 border-white/20 shadow-2xl shrink-0"
          />
          <div className="space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant={restaurant.isOpen ? 'emerald' : 'slate'}>
                {restaurant.isOpen ? 'Branch Open' : 'Closed'}
              </Badge>
              <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                {restaurant.city} • {restaurant.area}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold sm:text-4xl">{restaurant.name}</h1>
            <p className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-300">
              <MapPin size={16} className="text-rose-500" /> {restaurant.address}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star size={16} fill="currentColor" /> {restaurant.rating} ({restaurant.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} className="text-slate-300" /> {restaurant.openingTime} - {restaurant.closingTime}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={16} className="text-slate-300" /> {restaurant.phone}
              </span>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default RestaurantHero;
