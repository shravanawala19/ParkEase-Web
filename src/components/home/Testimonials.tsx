import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Daily Commuter & Financial Analyst',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
      comment: 'Parking downtown used to cost me $35/day and constant anxiety about break-ins. With ParkEase, I park in Marcus’s covered residential stall for $12/hr right by my building. It has changed my mornings completely.',
      rating: 5,
      type: 'Driver',
    },
    {
      name: 'Carlos Mendez',
      role: 'Driveway Host in Mission Bay',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
      comment: 'I live 4 blocks from the arena. During game nights and concerts, my empty 2-car driveway brings in over $500 every single week. Guests are polite and the app handles all gates and payments automatically.',
      rating: 5,
      type: 'Host',
    },
    {
      name: 'Rachel Kim',
      role: 'Tesla Model Y Owner',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
      comment: 'Finding an available public EV charger in the city during peak hours is a nightmare. Booking a private driveway with an integrated Level 2 wallbox is brilliant. I get a guaranteed spot AND a full battery.',
      rating: 5,
      type: 'Driver',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-100/70 px-3 py-1 rounded-full">
            Real Community Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
            Loved By Drivers & Space Hosts
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            See how ParkEase simplifies urban parking and creates reliable passive income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      item.type === 'Host'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    Verified {item.type}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    {item.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </h4>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
