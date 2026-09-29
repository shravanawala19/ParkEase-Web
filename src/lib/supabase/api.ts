import { getSupabaseBrowserClient } from './client';
import { ParkingSpot, Booking, Review, SpotType, VehicleSize } from '@/types/parking';
import { INITIAL_PARKING_SPOTS, INITIAL_BOOKINGS } from '@/data/mockData';

// Helper to map DB listing row to ParkingSpot TypeScript interface
export function mapDbListingToSpot(row: any, reviews: Review[] = []): ParkingSpot {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    address: row.address,
    neighborhood: row.neighborhood || '',
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    lat: Number(row.lat),
    lng: Number(row.lng),
    pricePerHour: Number(row.price_per_hour),
    pricePerDay: row.price_per_day ? Number(row.price_per_day) : undefined,
    spotType: (row.spot_type as SpotType) || 'driveway',
    allowedVehicles: (row.allowed_vehicles as VehicleSize[]) || ['compact', 'sedan', 'suv'],
    photos: Array.isArray(row.photos) && row.photos.length > 0 ? row.photos : [
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    host: row.profiles ? {
      id: row.profiles.id,
      name: row.profiles.name || 'Verified Host',
      avatar: row.profiles.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      joinedDate: row.profiles.member_since || 'January 2024',
      responseRate: '99%',
      responseTime: 'within 10 mins',
      isSuperhost: true,
      totalListings: 1,
    } : {
      id: row.host_id || 'host-1',
      name: 'Host User',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'March 2024',
      responseRate: '100%',
      responseTime: 'within 5 mins',
      isSuperhost: true,
      totalListings: 1,
    },
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count || reviews.length),
    reviews,
    distanceMiles: 0.8,
    instantBook: Boolean(row.instant_book),
    isActive: Boolean(row.is_active),
    accessInstructions: row.access_instructions || 'Access instructions will be provided in your confirmation pass.',
    securityFeatures: Array.isArray(row.security_features) ? row.security_features : ['Surveillance camera'],
    dimensions: {
      lengthFt: Number(row.length_ft || 20),
      widthFt: Number(row.width_ft || 10),
      heightClearanceFt: row.height_clearance_ft ? Number(row.height_clearance_ft) : undefined,
    },
  };
}

// Map DB booking row to Booking interface
export function mapDbBookingToBooking(row: any): Booking {
  return {
    id: row.id,
    spotId: row.spot_id,
    spotTitle: row.listings?.title || 'Parking Space Reservation',
    spotAddress: row.listings ? `${row.listings.address}, ${row.listings.city}` : 'San Francisco, CA',
    spotPhoto: row.listings?.photos?.[0] || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    renterName: row.renter_name,
    renterEmail: row.renter_email,
    startDate: String(row.start_date),
    startTime: String(row.start_time).substring(0, 5),
    endDate: String(row.end_date),
    endTime: String(row.end_time).substring(0, 5),
    hours: Number(row.hours),
    totalAmount: Number(row.total_amount),
    status: (row.status as any) || 'upcoming',
    gateCode: row.gate_code || '#PASS',
    vehiclePlate: row.vehicle_plate,
    vehicleModel: row.vehicle_model,
    createdAt: row.created_at,
    hasReviewed: Boolean(row.has_reviewed),
  };
}

// 1. Fetch Listings from Supabase
export async function fetchLiveListings(): Promise<ParkingSpot[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return INITIAL_PARKING_SPOTS;

  try {
    const { data: listings, error } = await (supabase.from('listings') as any)
      .select('*, profiles(*)')
      .order('created_at', { ascending: false });

    if (error || !listings || listings.length === 0) {
      console.warn('Could not fetch listings from Supabase, using mock fallback:', error?.message);
      return INITIAL_PARKING_SPOTS;
    }

    // Fetch reviews for these listings
    const { data: reviewsData } = await (supabase.from('reviews') as any)
      .select('*')
      .order('created_at', { ascending: false });

    const reviewsBySpot: Record<string, Review[]> = {};
    if (reviewsData) {
      for (const rev of reviewsData as any[]) {
        if (!reviewsBySpot[rev.spot_id]) reviewsBySpot[rev.spot_id] = [];
        reviewsBySpot[rev.spot_id].push({
          id: rev.id,
          authorName: rev.author_name,
          authorAvatar: rev.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          rating: Number(rev.rating),
          comment: rev.comment,
          date: rev.date || 'Recent',
        });
      }
    }

    return (listings as any[]).map((l: any) => mapDbListingToSpot(l, reviewsBySpot[l.id] || []));
  } catch (err) {
    console.error('Error fetching Supabase listings:', err);
    return INITIAL_PARKING_SPOTS;
  }
}

// 2. Fetch User Bookings from Supabase
export async function fetchLiveBookings(email?: string): Promise<Booking[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return INITIAL_BOOKINGS;

  try {
    let query: any = (supabase.from('bookings') as any)
      .select('*, listings(title, address, city, photos)')
      .order('created_at', { ascending: false });

    if (email) {
      query = query.eq('renter_email', email);
    }

    const { data: bookings, error } = await query;
    if (error || !bookings) {
      console.warn('Could not fetch bookings from Supabase, using fallback:', error?.message);
      return INITIAL_BOOKINGS;
    }

    return (bookings as any[]).map(mapDbBookingToBooking);
  } catch (err) {
    console.error('Error fetching Supabase bookings:', err);
    return INITIAL_BOOKINGS;
  }
}

// 3. Insert Booking into Supabase
export async function insertLiveBooking(
  booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'gateCode'>,
  userId?: string
): Promise<Booking> {
  const randomGate = '#' + Math.floor(1000 + Math.random() * 9000);
  const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

  const localBooking: Booking = {
    ...booking,
    id: bookingId,
    createdAt: new Date().toISOString(),
    status: 'upcoming',
    gateCode: randomGate,
    hasReviewed: false,
  };

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return localBooking;

  try {
    const { data, error } = await (supabase.from('bookings') as any)
      .insert({
        id: bookingId,
        spot_id: booking.spotId,
        renter_id: userId || null,
        renter_name: booking.renterName,
        renter_email: booking.renterEmail,
        start_date: booking.startDate,
        start_time: booking.startTime.length === 5 ? `${booking.startTime}:00` : booking.startTime,
        end_date: booking.endDate,
        end_time: booking.endTime.length === 5 ? `${booking.endTime}:00` : booking.endTime,
        hours: booking.hours,
        total_amount: booking.totalAmount,
        status: 'upcoming',
        gate_code: randomGate,
        vehicle_plate: booking.vehiclePlate,
        vehicle_model: booking.vehicleModel,
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase booking insert error, continuing with local booking:', error.message);
      return localBooking;
    }

    return localBooking;
  } catch (err) {
    console.error('Error writing booking to Supabase:', err);
    return localBooking;
  }
}

// 4. Cancel Booking in Supabase
export async function cancelLiveBooking(bookingId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return true;

  try {
    const { error } = await (supabase.from('bookings') as any)
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      console.warn('Supabase booking cancellation error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error cancelling booking:', err);
    return false;
  }
}

// 5. Submit Review to Supabase
export async function submitLiveReview(
  spotId: string,
  bookingId: string,
  authorName: string,
  authorAvatar: string,
  rating: number,
  comment: string,
  userId?: string
): Promise<Review> {
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    authorName,
    authorAvatar,
    rating,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    comment,
  };

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return newReview;

  try {
    const { error } = await (supabase.from('reviews') as any).insert({
      id: newReview.id,
      spot_id: spotId,
      booking_id: bookingId || null,
      user_id: userId || null,
      author_name: authorName,
      author_avatar: authorAvatar,
      rating,
      comment,
      date: newReview.date,
    });

    if (error) {
      console.warn('Error saving review to Supabase:', error.message);
    }
    return newReview;
  } catch (err) {
    console.error('Error writing review to Supabase:', err);
    return newReview;
  }
}

// 6. Insert Listing to Supabase
export async function insertLiveListing(
  spotData: Omit<ParkingSpot, 'id' | 'rating' | 'reviewCount' | 'reviews' | 'host'>,
  hostId?: string
): Promise<ParkingSpot> {
  const spotId = `spot-${Date.now()}`;
  const localSpot: ParkingSpot = {
    ...spotData,
    id: spotId,
    rating: 5.0,
    reviewCount: 0,
    reviews: [],
    host: {
      id: hostId || 'host-1',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'March 2023',
      responseRate: '100%',
      responseTime: 'within 5 mins',
      isSuperhost: true,
      totalListings: 1,
    },
  };

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return localSpot;

  try {
    const { error } = await (supabase.from('listings') as any).insert({
      id: spotId,
      host_id: hostId || null,
      title: spotData.title,
      description: spotData.description,
      address: spotData.address,
      neighborhood: spotData.neighborhood,
      city: spotData.city,
      state: spotData.state,
      zip_code: spotData.zipCode,
      lat: spotData.lat,
      lng: spotData.lng,
      price_per_hour: spotData.pricePerHour,
      price_per_day: spotData.pricePerDay || null,
      spot_type: spotData.spotType,
      allowed_vehicles: spotData.allowedVehicles,
      photos: spotData.photos,
      amenities: spotData.amenities,
      rating: 5.0,
      review_count: 0,
      instant_book: spotData.instantBook,
      is_active: true,
      access_instructions: spotData.accessInstructions,
      security_features: spotData.securityFeatures,
      length_ft: spotData.dimensions.lengthFt,
      width_ft: spotData.dimensions.widthFt,
      height_clearance_ft: spotData.dimensions.heightClearanceFt || null,
    });

    if (error) {
      console.warn('Error saving listing to Supabase:', error.message);
    }
    return localSpot;
  } catch (err) {
    console.error('Error inserting listing to Supabase:', err);
    return localSpot;
  }
}

// 7. Upload Photo to Supabase Storage Bucket ('spot-photos')
export async function uploadSpotPhoto(file: File): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('spot-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading to spot-photos bucket:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('spot-photos').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Failed to upload image:', err);
    return null;
  }
}

// 8. Availability Check Helper
export async function checkSpotAvailability(
  spotId: string,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): Promise<{ available: boolean; conflictReason?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { available: true };
  }

  try {
    const { data, error } = await (supabase.from('bookings') as any)
      .select('id, start_date, start_time, end_date, end_time, status')
      .eq('spot_id', spotId)
      .in('status', ['upcoming', 'active']);

    if (error || !data) {
      return { available: true };
    }

    // Check overlaps
    const reqStart = new Date(`${startDate}T${startTime}`);
    const reqEnd = new Date(`${endDate}T${endTime}`);

    for (const b of data) {
      const bStart = new Date(`${b.start_date}T${b.start_time}`);
      const bEnd = new Date(`${b.end_date}T${b.end_time}`);

      if (reqStart < bEnd && reqEnd > bStart) {
        return {
          available: false,
          conflictReason: `This spot is already reserved from ${b.start_time?.substring(0, 5)} to ${b.end_time?.substring(0, 5)} on ${b.start_date}.`,
        };
      }
    }

    return { available: true };
  } catch (err) {
    console.error('Availability check error:', err);
    return { available: true };
  }
}
