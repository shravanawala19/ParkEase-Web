'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PhotoGallery from '@/components/listing/PhotoGallery';
import BookingWidget from '@/components/listing/BookingWidget';
import ReviewsSection from '@/components/listing/ReviewsSection';
import ParkingMap from '@/components/search/ParkingMap';
import ToastContainer from '@/components/common/Toast';
import AuthModal from '@/components/common/AuthModal';
import {
  MapPin,
  Star,
  Shield,
  Zap,
  Clock,
  Car,
  CheckCircle2,
  Lock,
  Compass,
  ArrowLeft,
  Ruler,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';
import { POPULAR_AMENITIES } from '@/data/mockData';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { spots, formatPrice } = useApp();

  const spotId = params?.id as string;
  const spot = spots.find((s) => s.id === spotId) || spots[0];

  if (!spot) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Spot not found</h2>
          <Link href="/browse" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
            Browse All Spots
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Related spots nearby
  const nearbySpots = spots.filter((s) => s.id !== spot.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <ToastContainer />
      <AuthModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Back navigation */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to search results</span>
          </button>
        </div>

        {/* Title and location header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {spot.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{spot.rating}</span>
              <span className="text-slate-400 font-normal">({spot.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{spot.address}, {spot.city}, {spot.state} {spot.zipCode}</span>
            </div>

            {spot.distanceMiles && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold">
                {spot.distanceMiles} miles from Downtown
              </span>
            )}
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <PhotoGallery spot={spot} />

        {/* Two-column layout: Info on Left, Sticky Booking on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Left Column (Spot details) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Host overview badge card */}
            <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={spot.host.avatar}
                  alt={spot.host.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    Hosted by {spot.host.name}
                    {spot.host.isSuperhost && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        ★ Superhost
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Host since {spot.host.joinedDate} · {spot.host.responseTime} response time · {spot.host.responseRate} rate
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Contacting host: ${spot.host.name} (Simulation)`)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span>Message Host</span>
              </button>
            </div>

            {/* Spot Dimensions & Specifications */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-600" />
                <span>Spot Dimensions & Compatibility</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-medium block">Length & Width</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {spot.dimensions.lengthFt} ft × {spot.dimensions.widthFt} ft
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-medium block">Height Clearance</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {spot.dimensions.heightClearanceFt ? `${spot.dimensions.heightClearanceFt} ft max` : 'Open Air / No Limit'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-400 font-medium block">Allowed Vehicles</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block capitalize">
                    {spot.allowedVehicles.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3">About This Parking Space</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {spot.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {POPULAR_AMENITIES.map((item) => {
                  const hasIt = spot.amenities.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border ${
                        hasIt
                          ? 'border-blue-200/80 bg-blue-50/50 text-slate-900'
                          : 'border-slate-100 bg-slate-50/40 text-slate-400 line-through'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          hasIt ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Access & Security Instructions Preview */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>Access & Security</span>
              </h3>
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed mb-4">
                <strong>Gate PIN & Barcode:</strong> Provided immediately upon reservation completion in your Renter Dashboard & Booking Confirmation.
              </div>

              <div className="space-y-2">
                {spot.securityFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map View */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Location & Neighborhood</h3>
              <p className="text-xs text-slate-500 mb-4">
                {spot.neighborhood}, {spot.city}. Exact street number disclosed immediately on your booking receipt.
              </p>
              <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200">
                <ParkingMap spots={[spot]} selectedSpotId={spot.id} />
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection spot={spot} />
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <BookingWidget spot={spot} />
          </div>
        </div>

        {/* Nearby Suggestions */}
        <div className="mt-20 pt-10 border-t border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Similar Spots Nearby</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbySpots.map((near) => (
              <Link
                key={near.id}
                href={`/listings/${near.id}`}
                className="group bg-white rounded-3xl border border-slate-200 p-4 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={near.photos[0]}
                    alt={near.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                    {near.spotType}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-blue-600 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow">
                    {formatPrice(near.pricePerHour)}/hr
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>{near.neighborhood}</span>
                  <span className="ml-auto font-bold text-slate-900">★ {near.rating}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {near.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
