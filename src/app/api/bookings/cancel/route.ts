import { NextResponse } from 'next/server';
import { getStripeServer, isStripeConfigured } from '@/lib/stripe';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing bookingId' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // 1. Update booking status in Supabase
    if (supabase) {
      // First, get the booking to check for stripe_payment_intent
      const { data: booking, error: fetchError } = await (supabase.from('bookings') as any)
        .select('id, status, stripe_payment_intent, total_amount')
        .eq('id', bookingId)
        .single();

      if (fetchError || !booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      if (booking.status === 'cancelled') {
        return NextResponse.json({
          success: true,
          message: 'Booking was already cancelled.',
          refunded: false,
        });
      }

      // Update status to cancelled in DB
      const { error: updateError } = await (supabase.from('bookings') as any)
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Failed to cancel booking in DB:', updateError.message);
      }

      // 2. Attempt Stripe refund if a payment intent exists
      let refunded = false;
      let refundId: string | null = null;

      if (booking.stripe_payment_intent && isStripeConfigured()) {
        const stripe = getStripeServer()!;
        try {
          const refund = await stripe.refunds.create({
            payment_intent: booking.stripe_payment_intent,
          });
          refunded = refund.status === 'succeeded' || refund.status === 'pending';
          refundId = refund.id;
        } catch (refundErr: any) {
          console.error('Stripe refund error:', refundErr.message);
          // Still consider the cancellation successful even if refund fails
        }
      }

      return NextResponse.json({
        success: true,
        bookingId,
        refunded,
        refundId,
        message: refunded
          ? 'Booking cancelled and payment refunded.'
          : 'Booking cancelled. No Stripe payment found to refund.',
      });
    }

    // Simulation mode — no Supabase
    return NextResponse.json({
      success: true,
      bookingId,
      refunded: false,
      message: 'Booking cancelled in simulation mode.',
    });
  } catch (error: any) {
    console.error('Booking cancellation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
