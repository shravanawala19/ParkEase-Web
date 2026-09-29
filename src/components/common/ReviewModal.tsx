'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Star, MessageSquare } from 'lucide-react';

export default function ReviewModal() {
  const { reviewModal, closeReviewModal, addReview } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [cleanliness, setCleanliness] = useState(5);
  const [accessibility, setAccessibility] = useState(5);

  if (!reviewModal.isOpen || !reviewModal.booking) return null;

  const { booking } = reviewModal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(booking.spotId, booking.id, rating, comment);
    closeReviewModal();
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Rate Your Parking Experience</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
              {booking.spotTitle}
            </p>
          </div>
          <button
            onClick={closeReviewModal}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star selector */}
          <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Overall Rating
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        filled
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-slate-300'
                      } transition-colors`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-medium text-amber-600 mt-2">
              {rating === 5 && 'Outstanding - 5 Stars'}
              {rating === 4 && 'Very Good - 4 Stars'}
              {rating === 3 && 'Average - 3 Stars'}
              {rating <= 2 && 'Needs Improvement'}
            </p>
          </div>

          {/* Sub-ratings */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-600">Access & Entry</span>
              <div className="flex gap-1 mt-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAccessibility(num)}
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold ${
                      accessibility >= num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-600">Spot Cleanliness</span>
              <div className="flex gap-1 mt-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCleanliness(num)}
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold ${
                      cleanliness >= num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Review input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Review & Tips for Future Drivers
            </label>
            <div className="relative">
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the gate access? Was the spot easy to locate? Any tips for parking larger vehicles?"
                className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-all resize-none"
              />
              <MessageSquare className="w-4 h-4 text-slate-400 absolute right-3.5 bottom-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeReviewModal}
              className="py-2.5 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
