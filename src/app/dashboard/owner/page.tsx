'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/common/Toast';
import AddListingModal from '@/components/dashboard/AddListingModal';
import AuthModal from '@/components/common/AuthModal';
import {
  DollarSign,
  PlusCircle,
  CalendarCheck,
  TrendingUp,
  ShieldCheck,
  Star,
  MapPin,
  Car,
  ToggleLeft,
  ToggleRight,
  Eye,
  CheckCircle2,
  Edit2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function OwnerDashboardPage() {
  const {
    currentUser,
    spots,
    bookings,
    toggleSpotStatus,
    updateSpotPrice,
    showToast,
    formatPrice,
    currency,
  } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingSpotId, setEditingSpotId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(10);

  // Host's spots — filter by host.id in live mode; fallback to first 3 spots in demo mode
  const hostSpots = (() => {
    const owned = spots.filter((s) => s.host.id === currentUser.id);
    return owned.length > 0 ? owned : spots.slice(0, 3);
  })();

  const handleOpenEditPrice = (spotId: string, currentPrice: number) => {
    setEditingSpotId(spotId);
    setEditPriceVal(currentPrice);
  };

  const handleSavePrice = (spotId: string) => {
    updateSpotPrice(spotId, editPriceVal);
    setEditingSpotId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <ToastContainer />
      <AuthModal />
      <AddListingModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Host Welcome & Metrics Banner */}
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
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Superhost
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Host Dashboard · Managing {hostSpots.length} parking stalls in San Francisco
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Parking Spot</span>
            </button>
          </div>

          {/* Key Host Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> This Month
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">
                {formatPrice(1280.00)}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">↑ +18% from last month</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Lifetime Earned
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {formatPrice(3420.00)}
              </span>
              <span className="text-[11px] text-slate-400">Direct deposit connected</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" /> Total Bookings
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                87
              </span>
              <span className="text-[11px] text-slate-400">84% occupancy rate</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Host Rating
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                4.95★
              </span>
              <span className="text-[11px] text-slate-400">100% 5-min response time</span>
            </div>
          </div>
        </div>

        {/* Managed Parking Spots Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Managed Parking Spaces</h2>
              <p className="text-xs text-slate-500">Toggle availability, change prices, or preview public listing</p>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Another Spot</span>
            </button>
          </div>

          <div className="space-y-4">
            {hostSpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex gap-4">
                  <img
                    src={spot.photos[0]}
                    alt={spot.title}
                    className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          spot.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {spot.isActive ? '● Live & Bookable' : '○ Paused'}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">{spot.spotType}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">
                      {spot.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      <span>{spot.address}</span>
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs">
                      {editingSpotId === spot.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="2"
                            max="50"
                            value={editPriceVal}
                            onChange={(e) => setEditPriceVal(Number(e.target.value))}
                            className="w-16 p-1 border border-blue-500 rounded text-xs font-bold text-center"
                          />
                          <button
                            type="button"
                            onClick={() => handleSavePrice(spot.id)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSpotId(null)}
                            className="text-xs text-slate-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">
                            {formatPrice(spot.pricePerHour)}/hr
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenEditPrice(spot.id, spot.pricePerHour)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-medium">★ {spot.rating} ({spot.reviewCount} reviews)</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-medium">{spot.dimensions.lengthFt}×{spot.dimensions.widthFt} ft</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
                  {/* Status Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSpotStatus(spot.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      spot.isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>{spot.isActive ? 'Active' : 'Paused'}</span>
                  </button>

                  <Link
                    href={`/listings/${spot.id}`}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors"
                    title="View public listing page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Driver Reservations on Your Spots */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-8">
          <h3 className="font-bold text-slate-900 text-lg mb-1">
            Recent Incoming Driver Reservations
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Drivers who reserved your stalls with automated gate authorization
          </p>

          <div className="divide-y divide-slate-100">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                    🚗
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{b.renterName}</h4>
                    <p className="text-xs text-slate-500">
                      Vehicle: <span className="font-mono font-medium">{b.vehiclePlate}</span> ({b.vehicleModel})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block">Date & Hours</span>
                    <span className="font-bold text-slate-800">
                      {b.startDate} ({b.startTime} - {b.endTime})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Payout</span>
                    <span className="font-extrabold text-emerald-600 text-sm">
                      +{formatPrice(b.totalAmount - 2.5)}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Host Guarantee Footer Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-base">Your Spaces Are 100% Protected</h4>
              <p className="text-xs text-indigo-200 mt-0.5">
                Every reservation includes $1,000,000 property damage & public liability guarantee at no cost.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => showToast('Host policy terms PDF opened', undefined, 'info')}
            className="px-4 py-2 bg-white text-indigo-900 text-xs font-bold rounded-xl hover:bg-indigo-50 transition-colors shrink-0"
          >
            Review Policy Details
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
