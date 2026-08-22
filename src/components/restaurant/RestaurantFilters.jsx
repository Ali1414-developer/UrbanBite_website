import React from 'react';
import SearchInput from '../common/SearchInput';
import { CITIES } from '../../utils/constants';

export const RestaurantFilters = ({ selectedCity, setSelectedCity, searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-8">
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
        <button
          type="button"
          onClick={() => setSelectedCity('all')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
            selectedCity === 'all' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          All Cities
        </button>
        {CITIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCity(c.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
              selectedCity === c.id ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="w-full md:w-72">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search by area or branch name..."
        />
      </div>
    </div>
  );
};

export default RestaurantFilters;
