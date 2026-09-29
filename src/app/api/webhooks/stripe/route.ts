import { NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const stripe = getStripeServer();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe) {
    return NextResponse.json({ message: 'Stripe not configured on server' }, { status: 200 });
  }

  const signature = req.headers.get('stripe-signature');
  let event: any;

  try {
    const rawBody = await req.text();

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      event = JSON.parse(rawBody);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};

    const supabase = getSupabaseServerClient();
    if (supabase && metadata.spotId) {
      const gateCode = '#' + Math.floor(1000 + Math.random() * 9000);
      const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

      try {
        await (supabase.from('bookings') as any).insert({
          id: bookingId,
          spot_id: metadata.spotId,
          renter_name: metadata.renterName || 'Renter',
          renter_email: metadata.renterEmail || session.customer_email || 'guest@example.com',
          start_date: metadata.startDate,
          start_time: metadata.startTime,
          end_date: metadata.endDate,
          end_time: metadata.endTime,
          hours: Number(metadata.hours || 1),
          total_amount: Number(metadata.totalAmount || (session.amount_total ? session.amount_total / 100 : 0)),
          status: 'upcoming',
          gate_code: gateCode,
          vehicle_plate: metadata.vehiclePlate || 'TEMP-PLATE',
          vehicle_model: metadata.vehicleModel || 'Registered Vehicle',
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent ? String(session.payment_intent) : null,
        });

        console.log(`Booking confirmed & saved in Supabase: ${bookingId}`);
      } catch (dbErr) {
        console.error('Failed to record Stripe booking in Supabase:', dbErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
