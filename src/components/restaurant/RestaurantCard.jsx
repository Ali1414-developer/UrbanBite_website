import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import Rating from '../common/Rating';
import Badge from '../common/Badge';

export const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="group rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-xl hover:border-rose-300 transition-all flex flex-col justify-between">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant={restaurant.isOpen ? 'emerald' : 'slate'}>
              {restaurant.isOpen ? 'Open Now' : 'Closed'}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md">
            <Rating rating={restaurant.rating} count={restaurant.reviewCount} />
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              {restaurant.city} • {restaurant.area}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
            {restaurant.name}
          </h3>

          <p className="flex items-start gap-2 text-xs text-slate-500">
            <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{restaurant.address}</span>
          </p>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" /> {restaurant.openingTime} - {restaurant.closingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-slate-400" /> {restaurant.phone}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link
          to={`/restaurants/${restaurant.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-600 transition-all"
        >
          View Branch Menu <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
