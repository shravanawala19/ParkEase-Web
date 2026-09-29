'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/common/Toast';
import confetti from 'canvas-confetti';
import { checkSpotAvailability } from '@/lib/supabase/api';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Car,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

function CheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { spots, currentUser, addBooking, showToast, isSupabaseConnected, isStripeConfigured, formatPrice, currency } = useApp();

  const spotId = params?.id as string;
  const spot = spots.find((s) => s.id === spotId) || spots[0];

  const date = searchParams?.get('date') || '2026-09-28';
  const startTime = searchParams?.get('startTime') || '09:00';
  const endTime = searchParams?.get('endTime') || '17:00';
  const hours = parseFloat(searchParams?.get('hours') || '8');
  const totalParam = searchParams?.get('total') || (spot.pricePerHour * hours + 2.5).toFixed(2);
  const totalAmount = parseFloat(totalParam);

  const [driverName, setDriverName] = useState(currentUser.name || 'Alex Mercer');
  const [driverPhone, setDriverPhone] = useState(currentUser.phone || '+1 (555) 382-9012');
  const [vehicleModel, setVehicleModel] = useState('Tesla Model 3 (Midnight Silver)');
  const [vehiclePlate, setVehiclePlate] = useState('7XYZ892');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'card' | 'apple' | 'google'>('stripe');

  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('321');
  const [cardZip, setCardZip] = useState('94105');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityConflict, setAvailabilityConflict] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function verifySlot() {
      setIsCheckingAvailability(true);
      const res = await checkSpotAvailability(spot.id, date, startTime, date, endTime);
      if (active) {
        if (!res.available) {
          setAvailabilityConflict(res.conflictReason || 'Spot already reserved for this time window.');
        } else {
          setAvailabilityConflict(null);
        }
        setIsCheckingAvailability(false);
      }
    }
    verifySlot();
    return () => { active = false; };
  }, [spot.id, date, startTime, endTime]);

  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('08/29');
    setCardCvc('888');
    setCardZip('94105');
  };

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    if (availabilityConflict) {
      showToast('Time Slot Conflict', availabilityConflict, 'error');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'stripe') {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spotId: spot.id,
            spotTitle: spot.title,
            spotAddress: `${spot.address}, ${spot.city}, ${spot.state}`,
            spotPhoto: spot.photos[0],
            renterName: driverName,
            renterEmail: currentUser.email,
            startDate: date,
            startTime,
            endDate: date,
            endTime,
            hours,
            totalAmount,
            vehiclePlate,
            vehicleModel,
          }),
        });

        const data = await res.json();

        if (data.url) {
          window.location.href = data.url;
          return;
        }

        // If in simulation/test mode without live Stripe credentials:
        const newBooking = await addBooking({
          spotId: spot.id,
          spotTitle: spot.title,
          spotAddress: `${spot.address}, ${spot.city}, ${spot.state}`,
          spotPhoto: spot.photos[0],
          renterName: driverName,
          renterEmail: currentUser.email,
          startDate: date,
          startTime,
          endDate: date,
          endTime,
          hours,
          totalAmount,
          vehiclePlate,
          vehicleModel,
        });

        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        router.push(`/booking-confirmation/${newBooking.id}`);
        return;
      }

      // Direct card / apple / google checkout
      const newBooking = await addBooking({
        spotId: spot.id,
        spotTitle: spot.title,
        spotAddress: `${spot.address}, ${spot.city}, ${spot.state}`,
        spotPhoto: spot.photos[0],
        renterName: driverName,
        renterEmail: currentUser.email,
        startDate: date,
        startTime,
        endDate: date,
        endTime,
        hours,
        totalAmount,
        vehiclePlate,
        vehicleModel,
      });

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      router.push(`/booking-confirmation/${newBooking.id}`);
    } catch (err: any) {
      console.error('Booking failed:', err);
      showToast('Booking Failed', err?.message || 'Please try again', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Confirm & Pay Reservation
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your parking details and complete checkout
            </p>
          </div>
        </div>

        {/* Live Availability Status Banner */}
        {isCheckingAvailability && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
            <span>Checking real-time calendar availability in Supabase...</span>
          </div>
        )}

        {availabilityConflict && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-red-900">Spot Unavailable for Selected Window</p>
              <p className="mt-1">{availabilityConflict}</p>
              <button
                type="button"
                onClick={() => router.push('/browse')}
                className="mt-2 text-xs font-bold text-red-700 underline hover:text-red-900"
              >
                Browse other nearby spots &rarr;
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleCompleteBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-base">Vehicle & Driver Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Driver Name
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone (For Gate SMS)
                  </label>
                  <input
                    type="tel"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Make, Model & Color
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Tesla Model Y (White)"
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    License Plate Number
                  </label>
                  <input
                    type="text"
                    required
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    placeholder="e.g. 7XYZ892"
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-mono uppercase"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                * The host uses your license plate to identify your vehicle and prevent unauthorized towing.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Payment Method</h3>
                </div>

                {paymentMethod === 'card' && (
                  <button
                    type="button"
                    onClick={fillTestCard}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fill Test Card</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-black text-sm tracking-tight text-indigo-600">stripe</span>
                  <span>Stripe Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Direct Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'apple'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base font-black"> Pay</span>
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'google'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base font-black">G Pay</span>
                  <span>Google Pay</span>
                </button>
              </div>

              {paymentMethod === 'stripe' ? (
                <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Real-Time Stripe Hosted Checkout</span>
                  </div>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    You will be directed to Stripe's checkout session to complete payment with Card, Apple Pay, or Google Pay. Upon authorization, your parking pass and gate access code will be instantly confirmed.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-indigo-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span>Stripe API Test Mode Ready</span>
                  </div>
                </div>
              ) : paymentMethod === 'card' ? (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        placeholder="94105"
                        className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
                  <p className="text-xs text-slate-600 font-medium">
                    Ready to complete authorization via {paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'} biometric verification.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit encrypted checkout via Stripe simulated gateway.</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the <strong>ParkEase Space Terms</strong>, parking house rules, and acknowledge the <strong>2-hour free cancellation policy</strong>. I confirm my vehicle dimensions fit this spot.
                </span>
              </label>

              <button
                type="submit"
                disabled={isProcessing || !agreeTerms}
                className="w-full mt-5 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Securing Spot & Generating Pass...
                  </span>
                ) : (
                  <>
                    <span>Confirm & Pay {formatPrice(totalAmount)}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl shadow-slate-200/50 sticky top-28 space-y-6">
              <h3 className="font-bold text-slate-900 text-lg pb-3 border-b border-slate-100">
                Reservation Summary
              </h3>

              <div className="flex gap-4">
                <img
                  src={spot.photos[0]}
                  alt={spot.title}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {spot.spotType}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-2 leading-snug">
                    {spot.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">{spot.address}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date:
                  </span>
                  <span className="font-bold text-slate-900">{date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" /> Time Window:
                  </span>
                  <span className="font-bold text-slate-900">
                    {startTime} – {endTime} ({hours} hrs)
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{formatPrice(spot.pricePerHour)} × {hours} hours</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(spot.pricePerHour * hours)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service & Guarantee Protection</span>
                  <span className="font-semibold text-slate-900">{formatPrice(2.50)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Occupancy Taxes</span>
                  <span className="font-semibold text-slate-900">{formatPrice(0.00)}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                  <span className="font-bold text-base">Total Due Now</span>
                  <span className="font-black text-2xl text-blue-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Guaranteed Space Guarantee</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  If any vehicle blocks your space upon arrival, we provide priority replacement or immediate 100% refund.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Preparing Checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
