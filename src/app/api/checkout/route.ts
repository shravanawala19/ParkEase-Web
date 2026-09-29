import { NextResponse } from 'next/server';
import { getStripeServer, isStripeConfigured, formatAmountForStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      spotId,
      spotTitle,
      spotAddress,
      spotPhoto,
      renterName,
      renterEmail,
      startDate,
      startTime,
      endDate,
      endTime,
      hours,
      totalAmount,
      vehiclePlate,
      vehicleModel,
    } = body;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // If Stripe is not configured or in simulated mode, return fallback response
    if (!isStripeConfigured()) {
      const simulatedGateCode = '#' + Math.floor(1000 + Math.random() * 9000);
      const simulatedBookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

      return NextResponse.json({
        simulated: true,
        bookingId: simulatedBookingId,
        gateCode: simulatedGateCode,
        message: 'Stripe keys not configured. Simulating instant confirmation pass.',
      });
    }

    const stripe = getStripeServer()!;

    // Create real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: renterEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: formatAmountForStripe(totalAmount),
            product_data: {
              name: `ParkEase Reservation: ${spotTitle}`,
              description: `Parking from ${startDate} ${startTime} to ${endDate} ${endTime} (${hours} hrs) - Vehicle Plate: ${vehiclePlate}`,
              images: spotPhoto ? [spotPhoto] : [],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        spotId,
        spotTitle: spotTitle.substring(0, 100),
        spotAddress: spotAddress.substring(0, 100),
        renterName,
        renterEmail,
        startDate,
        startTime,
        endDate,
        endTime,
        hours: String(hours),
        totalAmount: String(totalAmount),
        vehiclePlate,
        vehicleModel,
      },
      success_url: `${appUrl}/booking-confirmation/{CHECKOUT_SESSION_ID}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/${spotId}?cancelled=true`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      simulated: false,
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Stripe Checkout session' },
      { status: 500 }
    );
  }
}
