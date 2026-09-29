'use client';

import React, { useState } from 'react';
import { ParkingSpot } from '@/types/parking';
import { Star, ThumbsUp, CheckCircle2, MessageSquare } from 'lucide-react';

interface ReviewsSectionProps {
  spot: ParkingSpot;
}

export default function ReviewsSection({ spot }: ReviewsSectionProps) {
  const [helpfulCounts, setHelpfulCounts] = useState<{ [key: string]: number }>({});

  const handleHelpful = (reviewId: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  return (
    <section className="mt-12 pt-10 border-t border-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span>{spot.rating}</span>
            <span className="text-slate-400 font-normal text-lg">
              · {spot.reviewCount} customer reviews
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Ratings from verified drivers who completed reservations at this spot.
          </p>
        </div>
      </div>

      {/* Rating category score bars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
        <div>
          <span className="text-xs font-semibold text-slate-600 block mb-1">Gate / Entry Access</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[98%]" />
            </div>
            <span className="text-xs font-bold text-slate-900">4.9</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-600 block mb-1">Listing Accuracy</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[100%]" />
            </div>
            <span className="text-xs font-bold text-slate-900">5.0</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-600 block mb-1">Spot Cleanliness</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[96%]" />
            </div>
            <span className="text-xs font-bold text-slate-900">4.8</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-600 block mb-1">Value for Money</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[99%]" />
            </div>
            <span className="text-xs font-bold text-slate-900">4.9</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {spot.reviews.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No reviews yet. Be the first to park here and leave a review!
          </p>
        ) : (
          spot.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.authorAvatar}
                    alt={rev.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      {rev.authorName}
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Driver
                      </span>
                    </h5>
                    <p className="text-xs text-slate-400">{rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{rev.comment}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({helpfulCounts[rev.id] || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
