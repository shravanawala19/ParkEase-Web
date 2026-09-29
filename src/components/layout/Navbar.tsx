'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Car,
  Heart,
  User,
  Menu,
  X,
  Compass,
  PlusCircle,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  CalendarDays,
  DollarSign,
  ShieldCheck,
  LogOut,
  Sparkles,
  Database,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    userRole,
    setUserRole,
    currentUser,
    wishlist,
    openAuthModal,
    showToast,
    isSupabaseConnected,
    isStripeConfigured,
    signOutUser,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);


  const isHost = userRole === 'host';

  const handleRoleToggle = () => {
    setUserRole(isHost ? 'renter' : 'host');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Car className="w-6 h-6 transform -rotate-3" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    Park<span className="text-blue-600">Ease</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    BETA
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:block">
                  Smart Peer-to-Peer Parking
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/browse"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                  pathname === '/browse'
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Compass className="w-4 h-4" />
                Find Parking
              </Link>

              <Link
                href="/browse?type=driveway"
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
              >
                Driveways
              </Link>
              <Link
                href="/browse?type=ev"
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                EV Charging
              </Link>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">


            {/* Quick Role Switcher Pill */}
            <button
              onClick={handleRoleToggle}
              title={`Click to switch to ${isHost ? 'Renter' : 'Host'} view`}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-sm ${
                isHost
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isHost ? 'bg-indigo-600' : 'bg-emerald-600'}`} />
              <span>{isHost ? '🏠 Host View' : '🚗 Renter View'}</span>
              <span className="text-[10px] text-slate-400 font-normal underline ml-0.5">Switch</span>
            </button>

            {/* Host Spot CTA button */}
            <Link
              href="/dashboard/owner"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 transition-colors border border-blue-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Spot</span>
            </Link>

            {/* Wishlist Link with counter */}
            <Link
              href="/dashboard/renter#saved"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-red-500 hover:bg-slate-100/70 transition-colors"
              aria-label="Saved Spots"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Profile Dropdown or Auth Links */}
            {currentUser.id.startsWith('0000') ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 capitalize">
                      {userRole} Mode
                    </div>
                  </div>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {currentUser.email}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                      {isHost ? 'Active Space Host' : 'Verified Renter'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard/renter"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                      <span>Renter Bookings</span>
                    </Link>

                    <Link
                      href="/dashboard/owner"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>Host Dashboard & Earnings</span>
                    </Link>

                    <Link
                      href="/dashboard/renter#saved"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span>Saved Favorites ({wishlist.length})</span>
                    </Link>


                  </div>

                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleRoleToggle}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Switch to {isHost ? 'Renter' : 'Host'} Mode</span>
                      </div>
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {isHost ? 'Drive' : 'Earn'}
                      </span>
                    </button>

                    <button
                      onClick={() => openAuthModal('login')}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Switch Account / Sign In</span>
                    </button>

                    <button
                      onClick={async () => {
                        await signOutUser();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Active Mode</p>
              <p className="text-sm font-bold text-slate-900 capitalize">{userRole} Mode</p>
            </div>
            <button
              onClick={handleRoleToggle}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white"
            >
              Switch to {isHost ? 'Renter' : 'Host'}
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            <Link
              href="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 flex items-center gap-3"
            >
              <Compass className="w-5 h-5 text-blue-600" />
              <span>Browse All Parking Spots</span>
            </Link>

            <Link
              href="/dashboard/renter"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 flex items-center gap-3"
            >
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              <span>My Renter Bookings</span>
            </Link>

            <Link
              href="/dashboard/owner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 flex items-center gap-3"
            >
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
              <span>Host Dashboard & Earnings</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 flex items-center gap-3"
            >
              <User className="w-5 h-5 text-slate-500" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
