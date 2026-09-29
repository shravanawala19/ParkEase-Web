'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Clock, Car, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function HeroSearch() {
  const router = useRouter();
  const { setActiveFilterSearch, setSearchLocation } = useApp();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('2026-09-28');
  const [timeIn, setTimeIn] = useState('09:00');
  const [timeOut, setTimeOut] = useState('17:00');
  const [vehicle, setVehicle] = useState('sedan');
  const [isLocating, setIsLocating] = useState(false);

  const getCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
            const data = await res.json();
            if (data && data.display_name) {
              const address = data.display_name;
              setLocation(address);
              setActiveFilterSearch(address);
              if (setSearchLocation) {
                setSearchLocation({ lat: latitude, lng: longitude, address, countryCode: data.address?.country_code || 'us' });
              }
            } else {
              setLocation(`${latitude}, ${longitude}`);
            }
          } catch (error) {
            console.error('Error fetching location from Google Maps API:', error);
            setLocation(`${latitude}, ${longitude}`);
          }
          setIsLocating(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilterSearch(location);
    router.push(`/browse?location=${encodeURIComponent(location)}&vehicle=${vehicle}`);
  };

  return (
    <div className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background ambient glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-purple-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Save up to 60% compared to commercial garages</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Guaranteed Parking,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Zero Circling.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Rent private driveways, residential garage stalls, and reserved lots from verified locals. Book by the hour or day with instant gate codes.
          </p>
        </div>

        {/* Floating Search Console */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-200/90 p-4 sm:p-5 transition-all">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Destination Input */}
              <div className="md:col-span-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Where do you need parking?
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street, neighborhood, or venue"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Date & Time In */}
              <div className="md:col-span-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              {/* Time In & Out */}
              <div className="md:col-span-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-400 focus-within:border-blue-600 focus-within:bg-white transition-all">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Hours (In – Out)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="time"
                    value={timeIn}
                    onChange={(e) => setTimeIn(e.target.value)}
                    className="w-1/2 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                  <span className="text-slate-400 font-bold">→</span>
                  <input
                    type="time"
                    value={timeOut}
                    onChange={(e) => setTimeOut(e.target.value)}
                    className="w-1/2 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[52px] rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Spots</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestions & Vehicle Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLocating}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {isLocating ? 'Locating...' : 'Use Current Location'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Car className="w-3.5 h-3.5" /> Vehicle:
                </span>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="bg-slate-100 text-slate-700 font-medium rounded-lg px-2 py-1 focus:outline-none border-none cursor-pointer"
                >
                  <option value="compact">Compact / Sedan</option>
                  <option value="suv">SUV / Crossover</option>
                  <option value="van">Van / Large Truck</option>
                  <option value="ev">Electric Vehicle (EV)</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              50k+
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Drivers Parked</p>
              <p className="text-[11px] text-slate-500">Across 120+ cities</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              4.9★
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Average Rating</p>
              <p className="text-[11px] text-slate-500">Over 18,000 reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              $2.4M
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Paid to Hosts</p>
              <p className="text-[11px] text-slate-500">Passive income earned</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-slate-200/60 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              100%
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Guaranteed Spot</p>
              <p className="text-[11px] text-slate-500">Or full instant refund</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
