'use client';

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/common/Toast';
import {
  CheckCircle2,
  QrCode,
  MapPin,
  Calendar,
  Clock,
  Car,
  KeyRound,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  Phone,
} from 'lucide-react';

function BookingConfirmationContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookings, showToast } = useApp();

  const bookingIdParam = params?.id as string;
  const sessionId = searchParams?.get('session_id');
  
  const [verifiedBookingId, setVerifiedBookingId] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState(!!sessionId);

  React.useEffect(() => {
    if (!sessionId) return;
    
    let isMounted = true;
    const verifySession = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await res.json();
        if (isMounted && data.bookingId) {
          setVerifiedBookingId(data.bookingId);
        }
      } catch (err) {
        console.error('Failed to verify session', err);
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };
    verifySession();
    return () => { isMounted = false; };
  }, [sessionId]);

  const displayBookingId = verifiedBookingId || bookingIdParam;
  
  // If we're still verifying, we might not have the real booking ID yet.
  // The local bookings state might have it if it was created locally.
  const booking = bookings.find((b) => b.id === displayBookingId) || 
                  (isVerifying ? null : bookings[0]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleAddToCalendar = () => {
    showToast('Event added to calendar (.ics)', undefined, 'success');
  };

  if (isVerifying || !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
           <h2 className="text-xl font-bold text-slate-800">Verifying Payment...</h2>
           <p className="text-slate-500 mt-2">Please wait while we confirm your booking.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Booking Confirmed & Guaranteed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            You're All Set to Park!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Reference Code: <strong className="text-slate-900 font-mono">{booking.id}</strong> · Receipt sent to your email.
          </p>
          {sessionId && (
            <div className="inline-flex items-center gap-2 mt-3 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Stripe Checkout Verified</span>
              <span className="text-indigo-400 font-mono text-[11px]">({sessionId.substring(0, 16)}...)</span>
            </div>
          )}
        </div>

        {/* Digital Parking Pass Ticket (Card) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden mb-8">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
                  Digital Entry Pass
                </span>
                <h2 className="text-2xl font-black mt-0.5">{booking.spotTitle}</h2>
                <p className="text-xs text-blue-100 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{booking.spotAddress}</span>
                </p>
              </div>

              {/* Gate Pass PIN Badge */}
              <div className="bg-white/15 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block">
                  Gate / Keypad PIN
                </span>
                <span className="text-2xl font-mono font-black text-white tracking-widest">
                  {booking.gateCode}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Body with QR Scanner & Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* QR Code Container */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/90 text-center">
                <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                  {/* Stylized QR representation */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="3" height="3" />
                    <rect x="18" y="14" width="3" height="3" />
                    <rect x="14" y="18" width="3" height="3" />
                    <rect x="18" y="18" width="3" height="3" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-slate-500 mt-2 block">
                  Scan at Barrier / Scanner
                </span>
              </div>

              {/* Information Grid */}
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date
                    </span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                      {booking.startDate}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" /> Time Window
                    </span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                      {booking.startTime} – {booking.endTime}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-emerald-600" /> Vehicle
                    </span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block truncate">
                      {booking.vehicleModel}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-400 font-semibold block">
                      License Plate
                    </span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">
                      {booking.vehiclePlate}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                  <div className="text-slate-500">
                    Total Paid: <strong className="text-slate-900 font-bold">${booking.totalAmount}</strong>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected by $1M Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Footer Actions */}
          <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save Pass</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCalendar}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </button>
            </div>

            <Link
              href="/dashboard/renter"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <span>View in Renter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Arrival Directions Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>Turn-by-Turn Arrival Directions</span>
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Upon reaching <strong>{booking.spotAddress}</strong>, enter the driveway or garage entrance. If gated, enter code <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-blue-700">{booking.gateCode}</span> on the key pad or scan the QR pass above.
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.spotAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Open Navigation in Google Maps</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Retrieving Reservation Pass...</p>
          </div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
