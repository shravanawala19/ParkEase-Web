'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ParkingSpot } from '@/types/parking';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  Zap,
  Info,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface BookingWidgetProps {
  spot: ParkingSpot;
}

export default function BookingWidget({ spot }: BookingWidgetProps) {
  const router = useRouter();
  const { formatPrice, currency } = useApp();

  const [date, setDate] = useState('2026-09-28');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [vehicle, setVehicle] = useState('sedan');

  // Calculate hours duration
  const startHour = parseInt(startTime.split(':')[0], 10) + parseInt(startTime.split(':')[1], 10) / 60;
  const endHour = parseInt(endTime.split(':')[0], 10) + parseInt(endTime.split(':')[1], 10) / 60;
  let durationHours = endHour - startHour;
  if (durationHours <= 0) durationHours = 8; // fallback for overnight / full day

  const basePrice = Math.round(durationHours * spot.pricePerHour * 10) / 10;
  const serviceFee = 2.5;
  const totalAmount = (basePrice + serviceFee).toFixed(2);

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/checkout/${spot.id}?date=${date}&startTime=${startTime}&endTime=${endTime}&hours=${durationHours}&total=${totalAmount}&vehicle=${vehicle}`
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl shadow-slate-200/60 sticky top-28">
      {/* Header Rate Display */}
      <div className="flex items-baseline justify-between pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{formatPrice(spot.pricePerHour)}</span>
            <span className="text-sm font-semibold text-slate-500">/ hour</span>
          </div>
          {spot.pricePerDay && (
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              {formatPrice(spot.pricePerDay)}/day maximum
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
            <span>★ {spot.rating}</span>
            <span className="text-slate-400 font-normal">({spot.reviewCount})</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Guaranteed Space</span>
        </div>
      </div>

      {/* Booking Form Inputs */}
      <form onSubmit={handleProceedToCheckout} className="mt-5 space-y-3.5">
        {/* Date Selector */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Parking Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
          />
        </div>

        {/* Time Selector */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div>
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Check-In
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
            />
          </div>
          <div className="border-l border-slate-200 pl-2">
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Check-Out
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Car className="w-3.5 h-3.5 text-slate-600" />
            Vehicle Type
          </label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="sedan">Standard Sedan (Honda, Toyota, BMW)</option>
            <option value="compact">Compact / Hatchback</option>
            <option value="suv">SUV / Crossover (Model Y, RAV4)</option>
            <option value="van">Van / Light Truck</option>
          </select>
        </div>

        {/* Price Breakdown */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>
              {formatPrice(spot.pricePerHour)} × {durationHours} hours
            </span>
            <span className="font-semibold text-slate-900">{formatPrice(basePrice)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="flex items-center gap-1">
              ParkEase Service & Guarantee Fee
              <Info className="w-3 h-3 text-slate-400" />
            </span>
            <span className="font-semibold text-slate-900">{formatPrice(serviceFee)}</span>
          </div>

          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total ({currency})</span>
            <span className="text-lg text-blue-600">{formatPrice(parseFloat(totalAmount))}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
        >
          <span>Reserve & Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Guarantee & Cancellation */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Free cancellation up to 2 hours before start</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Guaranteed parking stall or full instant refund</span>
        </div>
      </div>
    </div>
  );
}
