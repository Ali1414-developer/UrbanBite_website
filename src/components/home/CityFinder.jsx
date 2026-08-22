import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { CITIES } from '../../utils/constants';
import PageContainer from '../layout/PageContainer';

export const CityFinder = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <PageContainer>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-slate-50 p-6 md:p-8 border border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shrink-0 shadow-md">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Find UrbanBite In Your City</h3>
              <p className="text-xs text-slate-500">We operate 9+ modern branches across major cities in Pakistan</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            {CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => navigate(`/restaurants?city=${city.id}`)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-3 text-xs font-bold text-slate-800 shadow-sm hover:border-rose-500 hover:text-rose-600 hover:shadow-md transition-all"
              >
                <Navigation size={14} className="text-rose-500" />
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default CityFinder;
