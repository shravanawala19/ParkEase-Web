import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const spotId = searchParams.get('spotId');
  const startDate = searchParams.get('startDate');
  const startTime = searchParams.get('startTime');
  const endDate = searchParams.get('endDate') || startDate;
  const endTime = searchParams.get('endTime');

  if (!spotId || !startDate || !startTime || !endTime) {
    return NextResponse.json(
      { error: 'Missing required parameters: spotId, startDate, startTime, endTime' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ available: true, message: 'Simulation mode: space available' });
  }

  try {
    const { data: bookings, error } = await (supabase.from('bookings') as any)
      .select('id, start_date, start_time, end_date, end_time')
      .eq('spot_id', spotId)
      .in('status', ['upcoming', 'active']);

    if (error || !bookings) {
      return NextResponse.json({ available: true });
    }

    const reqStart = new Date(`${startDate}T${startTime}`);
    const reqEnd = new Date(`${endDate}T${endTime}`);

    for (const b of bookings) {
      const bStart = new Date(`${b.start_date}T${b.start_time}`);
      const bEnd = new Date(`${b.end_date}T${b.end_time}`);

      if (reqStart < bEnd && reqEnd > bStart) {
        return NextResponse.json({
          available: false,
          conflict: {
            date: b.start_date,
            startTime: b.start_time,
            endTime: b.end_time,
          },
          message: `Spot already booked from ${b.start_time} to ${b.end_time} on ${b.start_date}`,
        });
      }
    }

    return NextResponse.json({ available: true });
  } catch (err: any) {
    console.error('Availability check failed:', err);
    return NextResponse.json({ available: true });
  }
}
