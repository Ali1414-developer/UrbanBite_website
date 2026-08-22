import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import Button from '../common/Button';

export const RestaurantLocation = ({ restaurant }) => {
  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-base font-bold text-slate-900">
        <MapPin size={18} className="text-rose-600" />
        <h3>Branch Location & Directions</h3>
      </div>
      <p className="text-xs text-slate-600">{restaurant.address}</p>

      {/* Embedded Map Graphic Mock */}
      <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
          alt="Map Location"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute flex flex-col items-center gap-1 rounded-2xl bg-white/95 px-4 py-2 shadow-xl backdrop-blur-md">
          <MapPin size={24} className="text-rose-600 animate-bounce" />
          <span className="text-[11px] font-bold text-slate-900">{restaurant.name}</span>
        </div>
      </div>

      <Button
        variant="outline"
        fullWidth
        size="sm"
        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`, '_blank')}
        className="gap-2"
      >
        <Navigation size={14} /> Get Directions on Google Maps
      </Button>
    </div>
  );
};

export default RestaurantLocation;
