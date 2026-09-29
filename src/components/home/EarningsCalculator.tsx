'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, Shield, ArrowRight, Sparkles, TrendingUp, Check } from 'lucide-react';

export default function EarningsCalculator() {
  const [hourlyRate, setHourlyRate] = useState(8);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  const weeklyEarnings = hourlyRate * hoursPerDay * daysPerWeek;
  const monthlyEarnings = Math.round(weeklyEarnings * 4.33);
  const yearlyEarnings = monthlyEarnings * 12;

  return (
    <section id="calculator" className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Turn Empty Concrete Into Cash</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              How Much Could Your Driveway Earn?
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              If your driveway or garage stall sits empty while you commute to work or over the weekend, rent it to local commuters. 100% passive income with zero upfront investment.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-200">$1,000,000 Host Liability & Property Protection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-200">Automated payouts directly to your bank account</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm text-slate-200">You retain 100% control over booking rules and schedule</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/dashboard/owner"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:gap-3"
              >
                <span>List Your Space For Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Interactive Calculator Box */}
          <div className="lg:col-span-6 bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Earnings Simulator
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" /> High Demand Area
              </span>
            </div>

            {/* Sliders */}
            <div className="space-y-6 py-6 border-b border-slate-700">
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-slate-300">Target Hourly Rate</span>
                  <span className="text-white text-base font-bold text-emerald-400">${hourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="25"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>$4/hr</span>
                  <span>$15/hr avg</span>
                  <span>$25/hr</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-slate-300">Hours Available Per Day</span>
                  <span className="text-white text-base font-bold">{hoursPerDay} hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>2 hrs</span>
                  <span>8 hrs (Workday)</span>
                  <span>24 hrs (Full-time)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-slate-300">Days Available Per Week</span>
                  <span className="text-white text-base font-bold">{daysPerWeek} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 day</span>
                  <span>5 days (Mon–Fri)</span>
                  <span>7 days (All week)</span>
                </div>
              </div>
            </div>

            {/* Calculated Results Output */}
            <div className="pt-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/90 border border-slate-700/60 p-4 rounded-2xl text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Estimated Monthly
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                  ${monthlyEarnings.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400">Deposited monthly</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-700/60 p-4 rounded-2xl text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Projected Yearly
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  ${yearlyEarnings.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400">Total passive income</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
