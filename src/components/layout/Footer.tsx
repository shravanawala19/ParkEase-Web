import React from 'react';
import Link from 'next/link';
import { Car, ShieldCheck, Zap, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Trust banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">100% Guaranteed Parking</h4>
                <p className="text-xs text-slate-400 mt-0.5">Your spot is reserved solely for you. No circling, no hassle.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">$1,000,000 Host Protection</h4>
                <p className="text-xs text-slate-400 mt-0.5">Property damage and public liability insurance on every reservation.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Instant Digital Gate Pass</h4>
                <p className="text-xs text-slate-400 mt-0.5">Receive gate codes & barcode scanner passes directly on your phone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Park<span className="text-blue-500">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              The modern marketplace connecting homeowners with empty driveways to commuters and travelers searching for affordable, guaranteed parking.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for stress-free daily commutes</span>
            </div>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase text-xs">For Drivers</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  Find Daily Parking
                </Link>
              </li>
              <li>
                <Link href="/browse?type=airport" className="hover:text-white transition-colors">
                  Airport Long-Term
                </Link>
              </li>
              <li>
                <Link href="/browse?type=ev" className="hover:text-white transition-colors">
                  EV Charging Spots
                </Link>
              </li>
              <li>
                <Link href="/dashboard/renter" className="hover:text-white transition-colors">
                  My Reservations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase text-xs">For Hosts</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard/owner" className="hover:text-white transition-colors">
                  List Your Space
                </Link>
              </li>
              <li>
                <Link href="/#calculator" className="hover:text-white transition-colors">
                  Earnings Calculator
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner" className="hover:text-white transition-colors">
                  Host Protection Guarantee
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner" className="hover:text-white transition-colors">
                  Pricing Strategies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase text-xs">Top Cities</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/browse?city=San+Francisco" className="hover:text-white transition-colors">
                  San Francisco, CA
                </Link>
              </li>
              <li>
                <Link href="/browse?city=New+York" className="hover:text-white transition-colors">
                  New York, NY
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Chicago" className="hover:text-white transition-colors">
                  Chicago, IL
                </Link>
              </li>
              <li>
                <Link href="/browse?city=Los+Angeles" className="hover:text-white transition-colors">
                  Los Angeles, CA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ParkEase Inc. All rights reserved. Part 1 Frontend UI/UX Preview.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
