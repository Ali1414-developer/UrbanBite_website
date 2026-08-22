import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative h-[calc(100vh-4rem)] max-h-[750px] min-h-[480px] flex items-center justify-center overflow-hidden bg-stone-950 text-white px-4 py-6 sm:py-8">
      {/* ── Background Fullscreen Continuous Restaurant Video ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
      >
        <source src="/5101165-uhd_3840_2160_25fps.mp4" type="video/mp4" />
      </video>

      {/* ── Light Cinematic Overlay — bright, clear video visibility ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/55 pointer-events-none" />

      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── Hero Text Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4 sm:space-y-6">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] tracking-tight text-white drop-shadow-lg"
        >
          Fresh Flavors. Made for Every Taste.
        </motion.h1>

        {/* Supporting paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-neutral-200 text-sm sm:text-base md:text-lg font-normal max-w-xl mx-auto leading-relaxed drop-shadow-md"
        >
          Handcrafted prime beef smashers, crispy buttermilk fried chicken, and artisanal stone-baked pizzas delivered piping hot to your door.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
        >
          <Link
            to="/menu"
            className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Order Now</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
          </Link>

          <Link
            to="/menu"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-sm sm:text-base rounded-2xl border border-white/25 hover:border-white/40 transition-all text-center"
          >
            Explore Full Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
