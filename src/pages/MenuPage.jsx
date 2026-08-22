import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Flame,
  Sparkles,
  Star,
  Tag,
  Check,
  X,
  Utensils,
  ChevronDown,
  ShoppingBag,
  ArrowRight,
  Layers,
  LayoutGrid,
  Sparkle
} from 'lucide-react';
import { foods as defaultFoods } from '../data/foods';
import { categories as defaultCategories } from '../data/categories';
import { categoryService } from '../services/categoryService';
import { foodService } from '../services/foodService';
import { FoodCard } from '../components/common/FoodCard';
import { FoodModal } from '../components/common/FoodModal';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

export const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categoriesList, setCategoriesList] = useState(() => categoryService.getCachedCategories());
  const [foodsList, setFoodsList] = useState(() => foodService.getCachedFoods());
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [highlightedCategory, setHighlightedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-asc', 'price-desc', 'rating'
  const [selectedTag, setSelectedTag] = useState('all'); // 'all', 'new', 'spicy', 'popular', 'deals'
  const [selectedFood, setSelectedFood] = useState(null);

  const { addToCart } = useCart();
  const sidebarNavRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Load live categories and foods from MongoDB
  useEffect(() => {
    let isMounted = true;
    const fetchLiveMenu = async () => {
      try {
        const [cats, fds] = await Promise.all([
          categoryService.getAllCategories(),
          foodService.getAllFoods()
        ]);
        if (isMounted) {
          if (Array.isArray(cats) && cats.length > 0) {
            setCategoriesList(cats);
          }
          if (Array.isArray(fds) && fds.length > 0) {
            setFoodsList(fds);
          }
        }
      } catch (err) {
        console.warn('Failed to load dynamic categories or foods:', err);
      }
    };
    fetchLiveMenu();
    return () => { isMounted = false; };
  }, []);

  // Sync state if URL query param changes
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setActiveCategory(cat);
    setHighlightedCategory(cat);
  }, [searchParams]);

  const handleCategorySelect = (slug) => {
    if (activeCategory === 'all' && slug !== 'all') {
      // Smooth scroll inside right container
      const targetEl = document.getElementById(`category-${slug}`);
      if (targetEl && scrollContainerRef.current) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightedCategory(slug);
        return;
      }
    }

    setActiveCategory(slug);
    setHighlightedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtered and sorted foods
  const filteredFoods = useMemo(() => {
    let list = [...foodsList];

    // Category filter (when not 'all')
    if (activeCategory !== 'all') {
      const target = String(activeCategory).toLowerCase();
      const matchedCat = categoriesList.find(
        (c) =>
          c.slug?.toLowerCase() === target ||
          c._id?.toString().toLowerCase() === target ||
          c.id?.toString().toLowerCase() === target ||
          c.name?.toLowerCase() === target
      );
      const possibleMatches = [
        target,
        matchedCat?.slug?.toLowerCase(),
        matchedCat?._id?.toString().toLowerCase(),
        matchedCat?.id?.toString().toLowerCase()
      ].filter(Boolean);

      list = list.filter((f) => {
        const catId = (f.categoryId || '').toString().toLowerCase();
        const catSlug = (f.categorySlug || '').toString().toLowerCase();
        return possibleMatches.includes(catId) || possibleMatches.includes(catSlug);
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          (f.categoryId && f.categoryId.toLowerCase().includes(q)) ||
          (f.ingredients && f.ingredients.some((i) => i.toLowerCase().includes(q)))
      );
    }

    // Tag filter
    if (selectedTag === 'new') {
      list = list.filter((f) => f.isNew);
    } else if (selectedTag === 'deals') {
      list = list.filter((f) => f.discount > 0);
    } else if (selectedTag === 'popular') {
      list = list.filter((f) => f.isPopular);
    } else if (selectedTag === 'spicy') {
      list = list.filter((f) => f.spicy);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [foodsList, activeCategory, searchQuery, sortBy, selectedTag]);

  // Group foods category-wise
  const groupedCategorySections = useMemo(() => {
    const activeCategories = activeCategory === 'all'
      ? categoriesList
      : categoriesList.filter(c => c.slug === activeCategory || c.id === activeCategory);

    const groups = [];

    activeCategories.forEach(cat => {
      const catSlug = (cat.slug || '').toLowerCase();
      const catId = (cat.id || cat._id || '').toString().toLowerCase();

      const items = filteredFoods.filter(f => {
        const fCatId = (f.categoryId || '').toString().toLowerCase();
        const fCatSlug = (f.categorySlug || '').toString().toLowerCase();
        return fCatId === catSlug || fCatId === catId || fCatSlug === catSlug;
      });

      if (items.length > 0) {
        groups.push({
          category: cat,
          items
        });
      }
    });

    // Capture any remaining items that didn't match a listed category
    const matchedItemIds = new Set(groups.flatMap(g => g.items.map(i => i.id || i._id)));
    const orphanItems = filteredFoods.filter(f => !matchedItemIds.has(f.id || f._id));
    if (orphanItems.length > 0) {
      groups.push({
        category: {
          name: 'Special Selections',
          slug: 'other',
          description: 'Chef specials and delicious menu additions',
          image: ''
        },
        items: orphanItems
      });
    }

    return groups;
  }, [categoriesList, filteredFoods, activeCategory]);

  // Scroll spy inside right scroll container
  useEffect(() => {
    if (activeCategory !== 'all') return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const categoryElements = groupedCategorySections.map(g => ({
        slug: g.category.slug,
        el: document.getElementById(`category-${g.category.slug}`)
      })).filter(item => item.el);

      const scrollPosition = container.scrollTop + 140;

      for (let i = categoryElements.length - 1; i >= 0; i--) {
        const { slug, el } = categoryElements[i];
        if (el.offsetTop <= scrollPosition) {
          setHighlightedCategory(slug);
          break;
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [groupedCategorySections, activeCategory]);

  return (
    <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden bg-stone-50">
      
      {/* ══════════════ LEFT FIXED SIDEBAR ══════════════ */}
      <aside className="w-64 xl:w-72 shrink-0 bg-white border-r border-stone-200 h-full flex flex-col z-20 shadow-xs select-none">
        
        {/* Sidebar Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm text-stone-900 leading-tight">
                Categories
              </h3>
              <span className="text-[11px] text-stone-400 font-medium">
                {categoriesList.length} Menus
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
            {foodsList.length} Items
          </span>
        </div>

        {/* Navigation Categories List */}
        <nav
          ref={sidebarNavRef}
          className="flex-1 overflow-y-auto p-3 space-y-1 custom-sidebar-scroll"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#E5E7EB transparent' }}
        >
          {/* "All Dishes" Nav Item */}
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer text-left ${
              activeCategory === 'all' && highlightedCategory === 'all'
                ? 'bg-red-50 text-red-600 font-bold border-l-4 border-red-600 shadow-xs pl-2.5'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                activeCategory === 'all' && highlightedCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-stone-100 text-stone-500'
              }`}>
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">All Dishes</span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              activeCategory === 'all' && highlightedCategory === 'all'
                ? 'bg-red-100 text-red-700'
                : 'bg-stone-100 text-stone-500'
            }`}>
              {foodsList.length}
            </span>
          </button>

          {/* Dynamic Category Nav Items */}
          {categoriesList.map((cat) => {
            const isCurrentActive = activeCategory === cat.slug;
            const isHighlighted = highlightedCategory === cat.slug;
            const isSelected = isCurrentActive || (activeCategory === 'all' && isHighlighted);
            const count = foodsList.filter((f) => f.categoryId === cat.slug || f.categorySlug === cat.slug).length;

            return (
              <button
                key={cat._id || cat.id || cat.slug}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-red-50 text-red-600 font-bold border-l-4 border-red-600 shadow-xs pl-2.5'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                    alt={cat.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                    }}
                    className={`w-7 h-7 rounded-lg object-cover shrink-0 ${
                      isSelected ? 'ring-2 ring-red-400' : 'ring-1 ring-stone-200'
                    }`}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isSelected ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Status */}
        <div className="p-3 border-t border-stone-100 bg-stone-50/60 text-[11px] text-stone-400 text-center font-medium">
          UrbanBite Menu Directory
        </div>
      </aside>

      {/* ══════════════ RIGHT INDEPENDENT SCROLL AREA ══════════════ */}
      <main
        ref={scrollContainerRef}
        className="flex-1 h-full overflow-y-auto overflow-x-hidden flex flex-col bg-stone-50"
      >
        {/* Fixed / Sticky Search & Filter Bar at Top (Sleek Compact Height) */}
        <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-md px-5 sm:px-7 xl:px-8 py-2 border-b border-stone-200/90 shadow-2xs">
          <div className="bg-white rounded-xl p-1.5 sm:px-3 sm:py-1.5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, pizzas, burgers..."
                className="w-full pl-8 pr-8 py-1.5 bg-stone-100 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 border border-transparent focus:border-red-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Tag Filters */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5">
              {[
                { id: 'all', label: 'All', icon: Utensils },
                { id: 'popular', label: 'Popular', icon: Star },
                { id: 'deals', label: 'Deals', icon: Tag },
                { id: 'new', label: 'New', icon: Sparkles },
                { id: 'spicy', label: 'Spicy', icon: Flame }
              ].map((tag) => {
                const IconComp = tag.icon;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTag(tag.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold font-display whitespace-nowrap transition-colors border cursor-pointer ${
                      selectedTag === tag.id
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200/80'
                    }`}
                  >
                    <IconComp className="w-3 h-3" />
                    <span>{tag.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
              <span className="text-[11px] font-bold text-stone-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-800 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable Food Items List */}
        <div className="flex-1 px-5 sm:px-7 xl:px-8 py-6 space-y-6">
          
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-stone-500 px-1 border-b border-stone-200 pb-3">
            <span className="font-semibold">
              Showing <strong>{filteredFoods.length}</strong> dishes across <strong>{groupedCategorySections.length}</strong> {groupedCategorySections.length === 1 ? 'category' : 'categories'}
            </span>
            {activeCategory !== 'all' && (
              <button
                type="button"
                onClick={() => handleCategorySelect('all')}
                className="text-red-600 hover:text-red-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Show All Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Food Items: Category-Wise Sections */}
          {groupedCategorySections.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 my-4 shadow-xs">
              <Utensils className="w-12 h-12 mx-auto text-stone-300 mb-3" />
              <h3 className="font-display font-bold text-lg text-stone-800">
                No food items match your search
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto mt-1 mb-5">
                Try searching for a different keyword or resetting your filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setSelectedTag('all');
                }}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8 pb-16">
              {groupedCategorySections.map(({ category, items }) => (
                <section
                  key={category._id || category.id || category.slug}
                  id={`category-${category.slug}`}
                  className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs scroll-mt-6"
                >
                  {/* Category Header Banner */}
                  <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-xs ring-1 ring-stone-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
                          <Utensils className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h2 className="font-display font-extrabold text-lg sm:text-xl text-stone-900 flex items-center gap-2.5">
                          <span>{category.name}</span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200/60">
                            {items.length} {items.length === 1 ? 'Item' : 'Items'}
                          </span>
                        </h2>
                        {category.description && (
                          <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {activeCategory === 'all' && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(category.slug);
                          searchParams.set('category', category.slug);
                          setSearchParams(searchParams);
                          if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="text-xs font-bold text-stone-500 hover:text-red-600 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                      >
                        <span>Only this</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Responsive Food Cards Grid */}
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                    <AnimatePresence>
                      {items.map((food) => (
                        <FoodCard
                          key={food.id || food._id}
                          food={food}
                          onSelectFood={(item) => setSelectedFood(item)}
                          onQuickAdd={(item) => addToCart(item, 1, '')}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      <FoodModal
        food={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />

      {/* ── Sticky Floating Cart Bar ── */}
      <StickyCartBar />
    </div>
  );
};

/**
 * Sticky bottom cart bar — only visible when cart has items.
 * Shows item count + grand total + direct link to cart.
 */
const StickyCartBar = () => {
  const { cartItems, totals } = useCart();
  const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  if (totalQty === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40"
      >
        <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-semibold">
                {totalQty} {totalQty === 1 ? 'item' : 'items'} in cart
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white">
                {formatPrice(totals.grandTotal)}
              </div>
            </div>
          </div>

          <Link
            to="/cart"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
