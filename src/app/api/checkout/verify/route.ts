import { NextResponse } from 'next/server';
import { getStripeServer, isStripeConfigured } from '@/lib/stripe';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing session_id parameter' },
      { status: 400 }
    );
  }

  // If Stripe is not configured, return a simulated success
  if (!isStripeConfigured()) {
    return NextResponse.json({
      verified: true,
      simulated: true,
      paymentStatus: 'paid',
      message: 'Simulation mode: payment assumed successful.',
    });
  }

  const stripe = getStripeServer()!;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paymentStatus = session.payment_status; // 'paid' | 'unpaid' | 'no_payment_required'
    const metadata = session.metadata || {};

    // Attempt to find the corresponding booking in Supabase
    let bookingId: string | null = null;
    let gateCode: string | null = null;

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data: booking } = await (supabase.from('bookings') as any)
        .select('id, gate_code, status')
        .eq('stripe_session_id', sessionId)
        .single();

      if (booking) {
        bookingId = booking.id;
        gateCode = booking.gate_code;
      }
    }

    return NextResponse.json({
      verified: paymentStatus === 'paid',
      simulated: false,
      paymentStatus,
      sessionId: session.id,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      bookingId,
      gateCode,
      metadata: {
        spotId: metadata.spotId,
        spotTitle: metadata.spotTitle,
        renterName: metadata.renterName,
        startDate: metadata.startDate,
        startTime: metadata.startTime,
        endDate: metadata.endDate,
        endTime: metadata.endTime,
        hours: metadata.hours,
        vehiclePlate: metadata.vehiclePlate,
      },
    });
  } catch (error: any) {
    console.error('Stripe session verification error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify Stripe session', verified: false },
      { status: 500 }
    );
  }
}
