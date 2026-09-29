'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Star, MapPin, Heart, Zap, Shield, ArrowRight, Check } from 'lucide-react';

export default function FeaturedSpots() {
  const { spots, wishlist, toggleWishlist, formatPrice } = useApp();
  const featured = spots.slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100/70 px-3 py-1 rounded-full">
              Top Rated Near You
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              Featured Parking Spots
            </h2>
            <p className="text-slate-600 mt-2 text-base max-w-xl">
              Hand-picked verified driveways and secure private garages with instant confirmation.
            </p>
          </div>
          <Link
            href="/browse"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:gap-3 transition-all"
          >
            <span>View All ({spots.length}) Spots</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((spot) => {
            const isFav = wishlist.includes(spot.id);
            const hasEV = spot.amenities.includes('ev_charging');

            return (
              <div
                key={spot.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
              >
                {/* Photo container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={spot.photos[0]}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(spot.id);
                    }}
                    className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 backdrop-blur-md shadow-md transition-transform hover:scale-110 active:scale-95"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-slate-700'
                      }`}
                    />
                  </button>

                  {/* Tag Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md capitalize">
                      {spot.spotType}
                    </span>
                    {hasEV && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                        <Zap className="w-3 h-3 fill-current" />
                        EV Charger
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Info: Price Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-baseline gap-1 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                      <span className="text-lg font-black tracking-tight text-white">
                        {formatPrice(spot.pricePerHour)}
                      </span>
                      <span className="text-xs text-slate-300">/hr</span>
                      {spot.pricePerDay && (
                        <span className="text-[10px] text-emerald-400 font-semibold ml-1">
                          ({formatPrice(spot.pricePerDay)}/day)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 bg-white/90 text-slate-900 backdrop-blur-md px-2 py-1 rounded-xl text-xs font-bold shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{spot.rating}</span>
                      <span className="text-slate-500 text-[10px]">({spot.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{spot.neighborhood}, {spot.city}</span>
                      {spot.distanceMiles && (
                        <span className="text-slate-400">· {spot.distanceMiles} mi away</span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/listings/${spot.id}`}>
                        {spot.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={spot.host.avatar}
                        alt={spot.host.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="text-xs text-slate-600 font-medium truncate max-w-[100px]">
                        {spot.host.name.split(' ')[0]}
                      </span>
                      {spot.host.isSuperhost && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          Superhost
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/listings/${spot.id}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Book <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
