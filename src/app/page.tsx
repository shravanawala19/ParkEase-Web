'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSearch from '@/components/home/HeroSearch';
import FeaturedSpots from '@/components/home/FeaturedSpots';
import HowItWorks from '@/components/home/HowItWorks';
import EarningsCalculator from '@/components/home/EarningsCalculator';

import FaqSection from '@/components/home/FaqSection';
import ToastContainer from '@/components/common/Toast';
import AuthModal from '@/components/common/AuthModal';
import { Car, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <ToastContainer />
      <AuthModal />

      <main className="flex-1">
        {/* Hero & Search Engine */}
        <HeroSearch />

        {/* Featured Parking Listings Grid */}
        <FeaturedSpots />

        {/* How It Works (For Drivers & Space Owners) */}
        <HowItWorks />

        {/* Host Earnings Interactive Calculator */}
        <EarningsCalculator />



        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Bottom Call To Action Banner */}
        <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
              Start in Under 2 Minutes
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-4">
              Never Stress Over Urban Parking Again.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
              Join thousands of drivers who reserve private driveways and garage stalls with guaranteed entry codes, or list your driveway to earn steady passive income.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/browse"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Find Guaranteed Parking</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/owner"
                className="w-full sm:w-auto px-8 py-4 bg-blue-700/80 hover:bg-blue-800 text-white font-bold rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Host Your Driveway</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
