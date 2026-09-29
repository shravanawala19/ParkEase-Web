'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does parking access work upon arrival?',
      a: 'Once your booking is confirmed, your digital pass will display full directions and self-entry instructions (such as a remote gate PIN, garage barcode scanner pass, or specific driveway spot instructions). You can access your pass on your smartphone anytime.',
    },
    {
      q: 'What if someone is parked in my reserved spot?',
      a: 'ParkEase offers a 100% Guaranteed Space Guarantee. If any spot is blocked or unavailable when you arrive, our 24/7 dispatch will immediately reassign you to an adjacent priority stall or reimburse 100% of your booking plus a credit towards alternative parking.',
    },
    {
      q: 'Can I cancel my reservation and get a refund?',
      a: 'Yes! Most bookings have free cancellation up to 2 hours before the reservation start time. You can cancel with a single tap in your Renter Dashboard.',
    },
    {
      q: 'How do homeowners and space hosts get paid?',
      a: 'Host earnings are calculated automatically and transferred directly to your bank account via Stripe Connect. You can choose weekly or monthly payouts and track all revenue in your Host Dashboard.',
    },
    {
      q: 'Is my property protected if I host a spot?',
      a: 'Yes, every booking made on ParkEase is covered by our comprehensive $1,000,000 Host Liability and Property Damage Protection policy at no extra charge to the host.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Everything you need to know about renting and hosting parking with ParkEase.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
