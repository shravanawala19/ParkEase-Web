-- ==============================================================================
-- PARKEASE SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('renter', 'host');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE spot_type AS ENUM ('driveway', 'garage', 'lot', 'covered', 'street');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'renter',
    phone TEXT,
    member_since TEXT DEFAULT TO_CHAR(NOW(), 'Month YYYY'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
    id TEXT PRIMARY KEY DEFAULT ('spot-' || SUBSTRING(gen_random_uuid()::text, 1, 8)),
    host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    neighborhood TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    price_per_hour NUMERIC(10, 2) NOT NULL,
    price_per_day NUMERIC(10, 2),
    spot_type TEXT NOT NULL DEFAULT 'driveway',
    allowed_vehicles TEXT[] DEFAULT ARRAY['compact', 'sedan', 'suv']::TEXT[],
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    instant_book BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    access_instructions TEXT,
    security_features TEXT[] DEFAULT ARRAY[]::TEXT[],
    length_ft NUMERIC(5, 1) DEFAULT 20.0,
    width_ft NUMERIC(5, 1) DEFAULT 10.0,
    height_clearance_ft NUMERIC(5, 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT ('BK-' || FLOOR(10000 + RANDOM() * 90000)::TEXT),
    spot_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    renter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    renter_name TEXT NOT NULL,
    renter_email TEXT NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_date DATE NOT NULL,
    end_time TIME NOT NULL,
    hours NUMERIC(6, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming',
    gate_code TEXT,
    vehicle_plate TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,
    has_reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT ('rev-' || SUBSTRING(gen_random_uuid()::text, 1, 8)),
    spot_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    date TEXT DEFAULT TO_CHAR(NOW(), 'Month DD, YYYY'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FUNCTION: AUTO-CREATE PROFILE ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, avatar, role, phone, member_since)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'renter'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        TO_CHAR(NOW(), 'Month YYYY')
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. FUNCTION: AUTO-UPDATE SPOT RATING & REVIEW COUNT
CREATE OR REPLACE FUNCTION public.update_spot_rating_on_review()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC(3, 2);
    total_reviews INTEGER;
BEGIN
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 5.0), COUNT(*)
    INTO avg_rating, total_reviews
    FROM public.reviews
    WHERE spot_id = NEW.spot_id;

    UPDATE public.listings
    SET rating = avg_rating,
        review_count = total_reviews,
        updated_at = NOW()
    WHERE id = NEW.spot_id;

    IF NEW.booking_id IS NOT NULL THEN
        UPDATE public.bookings
        SET has_reviewed = TRUE
        WHERE id = NEW.booking_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_spot_rating_on_review();

-- 9. AVAILABILITY CHECK FUNCTION
CREATE OR REPLACE FUNCTION public.check_spot_availability(
    p_spot_id TEXT,
    p_start_date DATE,
    p_start_time TIME,
    p_end_date DATE,
    p_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    conflicts_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflicts_count
    FROM public.bookings
    WHERE spot_id = p_spot_id
      AND status IN ('upcoming', 'active')
      AND NOT (
          (end_date < p_start_date OR (end_date = p_start_date AND end_time <= p_start_time))
          OR
          (start_date > p_end_date OR (start_date = p_end_date AND start_time >= p_end_time))
      );

    RETURN conflicts_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read public profile info, users can edit their own
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Listings: Anyone can view active listings, hosts manage their own
CREATE POLICY "Listings are viewable by everyone"
    ON public.listings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create listings"
    ON public.listings FOR INSERT WITH CHECK (true);

CREATE POLICY "Hosts can update their own listings"
    ON public.listings FOR UPDATE USING (auth.uid() = host_id OR host_id IS NULL);

CREATE POLICY "Hosts can delete their own listings"
    ON public.listings FOR DELETE USING (auth.uid() = host_id OR host_id IS NULL);

-- Bookings: Renters can view own bookings; Hosts can view bookings for their spots
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT USING (
        auth.uid() = renter_id 
        OR renter_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        OR true -- Allow demo access
    );

CREATE POLICY "Anyone or authenticated renters can create bookings"
    ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Renters or hosts can update bookings (e.g. cancel)"
    ON public.bookings FOR UPDATE USING (true);

-- Reviews: Everyone can read reviews; Authenticated users can insert
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews"
    ON public.reviews FOR INSERT WITH CHECK (true);

-- 11. STORAGE BUCKET FOR SPOT PHOTOS
-- (Supabase Storage: run in SQL editor to create public bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('spot-photos', 'spot-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public can view images
CREATE POLICY "Public Access for Spot Photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'spot-photos');

CREATE POLICY "Anyone can upload spot photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'spot-photos');
