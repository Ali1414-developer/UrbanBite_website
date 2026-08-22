import React from 'react';
import PageContainer from '../layout/PageContainer';
import SearchInput from '../common/SearchInput';

export const MenuHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-slate-900 py-12 text-white border-b border-slate-800">
      <PageContainer>
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500">UrbanBite Kitchen</span>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Our Complete Food Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Select from 120+ freshly prepared items across 12 distinct categories.
          </p>

          <div className="pt-2">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search smash burgers, spicy wings, lava cakes, pizzas..."
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default MenuHeader;
