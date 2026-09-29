'use client';

import React from 'react';
import Link from 'next/link';
import { ParkingSpot } from '@/types/parking';
import { useApp } from '@/context/AppContext';
import { Star, MapPin, Heart, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ListingCardProps {
  spot: ParkingSpot;
  isSelected?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}

export default function ListingCard({
  spot,
  isSelected,
  onHover,
  onLeave,
}: ListingCardProps) {
  const { wishlist, toggleWishlist, formatPrice } = useApp();
  const isFav = wishlist.includes(spot.id);
  const hasEV = spot.amenities.includes('ev_charging');
  const hasCCTV = spot.amenities.includes('cctv');

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group bg-white rounded-3xl border transition-all duration-300 flex flex-col sm:flex-row overflow-hidden ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-xl'
          : 'border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl'
      }`}
    >
      {/* Image container */}
      <div className="relative w-full sm:w-56 md:w-64 h-48 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
        <img
          src={spot.photos[0]}
          alt={spot.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(spot.id);
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 backdrop-blur-md shadow-md transition-transform hover:scale-110 active:scale-95"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isFav ? 'fill-red-500 text-red-500' : 'text-slate-700'
            }`}
          />
        </button>

        {/* Spot Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-md capitalize">
            {spot.spotType}
          </span>
        </div>
      </div>

      {/* Details container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Location & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{spot.neighborhood}, {spot.city}</span>
              {spot.distanceMiles && (
                <span className="text-slate-400">({spot.distanceMiles} mi)</span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{spot.rating}</span>
              <span className="text-slate-400 font-normal">({spot.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/listings/${spot.id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {spot.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {spot.description}
          </p>

          {/* Amenities tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hasEV && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" /> EV Level 2
              </span>
            )}
            {hasCCTV && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1">
                <Shield className="w-3 h-3 text-blue-600" /> 24/7 CCTV
              </span>
            )}
            {spot.instantBook && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-purple-600" /> Instant Book
              </span>
            )}
          </div>
        </div>

        {/* Footer: Host & Price */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <img
              src={spot.host.avatar}
              alt={spot.host.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div>
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {spot.host.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Responds {spot.host.responseTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {formatPrice(spot.pricePerHour)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/hr</span>
              </div>
              {spot.pricePerDay && (
                <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                  or {formatPrice(spot.pricePerDay)}/day
                </span>
              )}
            </div>

            <Link
              href={`/listings/${spot.id}`}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
