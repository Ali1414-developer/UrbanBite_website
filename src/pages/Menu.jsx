import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuHeader from '../components/menu/MenuHeader';
import CategoryNavigation from '../components/menu/CategoryNavigation';
import MenuFilters from '../components/menu/MenuFilters';
import FoodGrid from '../components/menu/FoodGrid';
import PageContainer from '../components/layout/PageContainer';
import foodService from '../services/foodService';

export const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [filterType, setFilterType] = useState('all');
  const [allFoods, setAllFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    foodService.getAllFoods().then((res) => {
      setAllFoods(res);
      setIsLoading(false);
    });
  }, []);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const processedFoods = useMemo(() => {
    let result = [...allFoods];

    if (selectedCategory !== 'all') {
      result = result.filter((f) => f.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
      );
    }

    if (filterType === 'popular') {
      result = result.filter((f) => f.isPopular);
    } else if (filterType === 'new') {
      result = result.filter((f) => f.isNew);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [allFoods, selectedCategory, searchQuery, filterType, sortBy]);

  return (
    <main className="min-h-screen bg-white pb-20">
      <MenuHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryNavigation
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      <PageContainer className="pt-8">
        <MenuFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
          </div>
        ) : (
          <FoodGrid foods={processedFoods} />
        )}
      </PageContainer>
    </main>
  );
};

export default Menu;
