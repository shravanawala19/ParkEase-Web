import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { isStripeConfigured } from '@/lib/stripe';

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();
  const stripeConfigured = isStripeConfigured();

  let supabaseReachable = false;
  let listingCount = 0;
  let bookingCount = 0;
  let errorMessage: string | null = null;

  if (supabaseConfigured) {
    try {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        const { count: lCount, error: lErr } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true });

        const { count: bCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        if (!lErr) {
          supabaseReachable = true;
          listingCount = lCount || 0;
          bookingCount = bCount || 0;
        } else {
          errorMessage = lErr.message;
        }
      }
    } catch (e: any) {
      errorMessage = e.message;
    }
  }

  return NextResponse.json({
    supabase: {
      configured: supabaseConfigured,
      reachable: supabaseReachable,
      listingCount,
      bookingCount,
      error: errorMessage,
    },
    stripe: {
      configured: stripeConfigured,
    },
    mode: supabaseConfigured && supabaseReachable ? 'live' : 'simulation',
  });
}
