'use client';

import React, { useState } from 'react';
import { ParkingSpot } from '@/types/parking';
import { useApp } from '@/context/AppContext';
import { Heart, Share2, Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
  spot: ParkingSpot;
}

export default function PhotoGallery({ spot }: PhotoGalleryProps) {
  const { wishlist, toggleWishlist, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const isFav = wishlist.includes(spot.id);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', undefined, 'info');
    }
  };

  const allPhotos = spot.photos.length >= 5
    ? spot.photos
    : [
        ...spot.photos,
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      ].slice(0, 5);

  return (
    <div className="relative">
      {/* Top action buttons */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            {spot.spotType} Parking
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            onClick={() => toggleWishlist(spot.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-sm"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFav ? 'fill-red-500 text-red-500' : 'text-slate-700'
              }`}
            />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Modern 5-Photo Mosaic Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] sm:h-[420px] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        {/* Main large photo */}
        <div
          onClick={() => {
            setCurrentIdx(0);
            setModalOpen(true);
          }}
          className="md:col-span-2 h-full cursor-pointer overflow-hidden relative group"
        >
          <img
            src={allPhotos[0]}
            alt={spot.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Secondary 2 photos */}
        <div className="hidden md:flex flex-col gap-3 h-full">
          <div
            onClick={() => {
              setCurrentIdx(1);
              setModalOpen(true);
            }}
            className="flex-1 cursor-pointer overflow-hidden relative group"
          >
            <img
              src={allPhotos[1]}
              alt={spot.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div
            onClick={() => {
              setCurrentIdx(2);
              setModalOpen(true);
            }}
            className="flex-1 cursor-pointer overflow-hidden relative group"
          >
            <img
              src={allPhotos[2]}
              alt={spot.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right 2 photos */}
        <div className="hidden md:flex flex-col gap-3 h-full">
          <div
            onClick={() => {
              setCurrentIdx(3);
              setModalOpen(true);
            }}
            className="flex-1 cursor-pointer overflow-hidden relative group"
          >
            <img
              src={allPhotos[3]}
              alt={spot.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div
            onClick={() => {
              setCurrentIdx(4);
              setModalOpen(true);
            }}
            className="flex-1 cursor-pointer overflow-hidden relative group"
          >
            <img
              src={allPhotos[4]}
              alt={spot.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* View all photos button */}
        <button
          onClick={() => {
            setCurrentIdx(0);
            setModalOpen(true);
          }}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md backdrop-blur-md transition-all hover:scale-105"
        >
          <Grid className="w-4 h-4 text-blue-600" />
          <span>Show all {allPhotos.length} photos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-4">
            <span className="text-sm font-semibold">
              Photo {currentIdx + 1} of {allPhotos.length}
            </span>
            <button
              onClick={() => setModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full">
            <img
              src={allPhotos[currentIdx]}
              alt=""
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() =>
                setCurrentIdx((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))
              }
              className="absolute left-4 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setCurrentIdx((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-4 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-4 overflow-x-auto">
            {allPhotos.map((p, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIdx === i ? 'border-blue-500 scale-105' : 'border-transparent opacity-50'
                }`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
