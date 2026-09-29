'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/common/Toast';
import ReviewModal from '@/components/common/ReviewModal';
import AuthModal from '@/components/common/AuthModal';
import {
  CalendarDays,
  Clock,
  MapPin,
  Car,
  Heart,
  Star,
  CheckCircle2,
  XCircle,
  QrCode,
  ArrowRight,
  TrendingDown,
  Compass,
  AlertCircle,
} from 'lucide-react';

export default function RenterDashboardPage() {
  const {
    currentUser,
    bookings,
    spots,
    wishlist,
    cancelBooking,
    openReviewModal,
    showToast,
    formatPrice,
    currency,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');
  const [cancelModalBookingId, setCancelModalBookingId] = useState<string | null>(null);

  // Scope bookings to current user — in live mode filter by renterEmail; demo shows all
  const userBookings = (() => {
    const mine = bookings.filter((b) => b.renterEmail === currentUser.email);
    return mine.length > 0 ? mine : bookings;
  })();

  const upcomingBookings = userBookings.filter((b) => b.status === 'upcoming');
  const pastBookings = userBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const savedSpotsList = spots.filter((s) => wishlist.includes(s.id));

  const handleConfirmCancel = () => {
    if (cancelModalBookingId) {
      cancelBooking(cancelModalBookingId);
      setCancelModalBookingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <ToastContainer />
      <ReviewModal />
      <AuthModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* User Welcome Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Verified Driver
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Member since {currentUser.memberSince} · {currentUser.email}
                </p>
              </div>
            </div>

            <Link
              href="/browse"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Find New Parking Spot</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold block">Active Bookings</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {upcomingBookings.length}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold block">Total Completed Trips</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {pastBookings.filter((b) => b.status === 'completed').length}
              </span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> Saved vs Commercial Garages
              </span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                $340.00
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Upcoming Reservations ({upcomingBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'past'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Trip History ({pastBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favorites ({savedSpotsList.length})</span>
          </button>
        </div>

        {/* TAB 1: Upcoming Reservations */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No Upcoming Reservations</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Ready for your next trip? Find safe, affordable parking spots across the city.
                </p>
                <Link
                  href="/browse"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  <span>Search Parking Spots</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={b.spotPhoto}
                      alt={b.spotTitle}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Active Pass
                        </span>
                        <span className="text-xs font-mono text-slate-400">{b.id}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{b.spotTitle}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span>{b.spotAddress}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          📅 {b.startDate} ({b.startTime} - {b.endTime})
                        </span>
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          🚗 {b.vehiclePlate} ({b.vehicleModel})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                    {/* Gate PIN box */}
                    <div className="bg-blue-50 border border-blue-200/80 px-4 py-2 rounded-xl text-center w-full md:w-auto">
                      <span className="text-[10px] uppercase font-bold text-blue-700 block">
                        Gate Code PIN
                      </span>
                      <span className="text-lg font-mono font-black text-blue-900 tracking-wider">
                        {b.gateCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Link
                        href={`/booking-confirmation/${b.id}`}
                        className="flex-1 md:flex-none text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                      >
                        View Digital Pass
                      </Link>

                      <button
                        type="button"
                        onClick={() => setCancelModalBookingId(b.id)}
                        className="px-3 py-2 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Trip History */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No Past Trips Yet</h3>
              </div>
            ) : (
              pastBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={b.spotPhoto}
                      alt={b.spotTitle}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            b.status === 'completed'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {b.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{b.id}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{b.spotTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{b.startDate} · {formatPrice(b.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {b.status === 'completed' && (
                      <button
                        type="button"
                        onClick={() => openReviewModal(b)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          b.hasReviewed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{b.hasReviewed ? 'Reviewed ★★★★★' : 'Leave a Review'}</span>
                      </button>
                    )}

                    <Link
                      href={`/listings/${b.spotId}`}
                      className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
                    >
                      Book Again
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: Saved Favorites */}
        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSpotsList.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No Saved Spots Yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click the heart icon on any parking spot to save it here for quick access.
                </p>
                <Link
                  href="/browse"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Browse Spots
                </Link>
              </div>
            ) : (
              savedSpotsList.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-3 bg-slate-100">
                      <img
                        src={spot.photos[0]}
                        alt={spot.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-blue-600 text-white font-black text-xs px-2.5 py-1 rounded-xl">
                        {formatPrice(spot.pricePerHour)}/hr
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{spot.neighborhood}</span>
                      <span className="font-bold text-slate-900">★ {spot.rating}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                      {spot.title}
                    </h4>
                  </div>

                  <Link
                    href={`/listings/${spot.id}`}
                    className="mt-4 w-full py-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl text-center transition-colors"
                  >
                    Reserve Now
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Cancellation Confirmation Modal */}
      {cancelModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Cancel Reservation?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Under our 2-hour policy, you will receive a full 100% refund. The space will be released to other drivers.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setCancelModalBookingId(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
