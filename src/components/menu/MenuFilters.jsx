import React from 'react';
import Select from '../common/Select';

export const MenuFilters = ({ sortBy, setSortBy, filterType, setFilterType }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-8">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilterType('popular')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            filterType === 'popular' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Popular
        </button>
        <button
          type="button"
          onClick={() => setFilterType('new')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            filterType === 'new' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          New
        </button>
      </div>

      <div className="w-44">
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          placeholder=""
          options={[
            { value: 'recommended', label: 'Recommended' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'rating', label: 'Top Rated' },
          ]}
        />
      </div>
    </div>
  );
};

export default MenuFilters;
