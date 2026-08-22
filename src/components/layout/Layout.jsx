import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from '../common/AuthModal';
import { SearchModal } from '../common/SearchModal';
import { LocationModal } from '../common/LocationModal';

export const Layout = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isMenuPage = location.pathname.startsWith('/menu');

  // Global keyboard shortcut '/' to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-white w-full max-w-full ${
        isMenuPage ? 'h-screen overflow-hidden' : 'overflow-x-hidden'
      }`}
    >
      {/* Sticky Global Navbar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Routed Page Content */}
      <main
        className={`flex-1 w-full max-w-full pt-16 ${
          isMenuPage ? 'h-[calc(100vh-64px)] overflow-hidden flex flex-col' : 'overflow-x-hidden'
        }`}
      >
        {children}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <AuthModal />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <LocationModal />

      {/* Global Footer (shown on all pages except full-screen menu app view) */}
      {!isMenuPage && <Footer />}
    </div>
  );
};
