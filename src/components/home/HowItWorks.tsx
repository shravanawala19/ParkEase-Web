'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, CreditCard, KeyRound, PlusCircle, CalendarCheck, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const [tab, setTab] = useState<'renter' | 'host'>('renter');

  const renterSteps = [
    {
      step: '01',
      title: 'Find Your Ideal Spot',
      description: 'Search by neighborhood, venue, or address. Filter by EV charging, covered spaces, security cameras, or vehicle size.',
      icon: Search,
      color: 'blue',
    },
    {
      step: '02',
      title: 'Instant Reservation & Pass',
      description: 'Choose your exact hours and pay securely with Stripe or Apple Pay. Receive a digital barcode or gate access pin immediately.',
      icon: CreditCard,
      color: 'indigo',
    },
    {
      step: '03',
      title: 'Drive In, Park & Relax',
      description: 'Follow turn-by-turn directions directly to the driveway or garage stall. Your space is 100% reserved and guaranteed.',
      icon: KeyRound,
      color: 'emerald',
    },
  ];

  const hostSteps = [
    {
      step: '01',
      title: 'List Your Empty Space',
      description: 'Snap a few photos of your driveway, garage, or lot. Add dimensions, access instructions, and optional EV charging details.',
      icon: PlusCircle,
      color: 'indigo',
    },
    {
      step: '02',
      title: 'Set Your Schedule & Price',
      description: 'Rent during business hours while you are at work, on weekends, or 24/7. You set the hourly and daily pricing with smart recommendations.',
      icon: CalendarCheck,
      color: 'blue',
    },
    {
      step: '03',
      title: 'Collect Hands-Free Payouts',
      description: 'Drivers self-check in using your automated access instructions. Earnings are deposited directly to your bank account with $1M coverage.',
      icon: Wallet,
      color: 'emerald',
    },
  ];

  const steps = tab === 'renter' ? renterSteps : hostSteps;

  return (
    <section className="py-20 bg-slate-50/70 border-y border-slate-200/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
            How ParkEase Works
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Whether you need a parking stall today or have an unused driveway to monetize, we make it effortless.
          </p>

          {/* Role selector tab */}
          <div className="inline-flex bg-slate-200/70 p-1.5 rounded-2xl mt-8">
            <button
              onClick={() => setTab('renter')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === 'renter'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🚗 For Drivers
            </button>
            <button
              onClick={() => setTab('host')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === 'host'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏠 For Space Owners
            </button>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg shadow-slate-100/80 hover:-translate-y-1 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                    {item.step}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                      item.color === 'blue'
                        ? 'bg-blue-600 shadow-blue-500/30'
                        : item.color === 'indigo'
                        ? 'bg-indigo-600 shadow-indigo-500/30'
                        : 'bg-emerald-600 shadow-emerald-500/30'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2.5">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" />
                  <span>Verified & Protected</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          {tab === 'renter' ? (
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 transition-all hover:gap-3"
            >
              <span>Explore Available Spots Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard/owner"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 transition-all hover:gap-3"
            >
              <span>Start Hosting Your Space</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
