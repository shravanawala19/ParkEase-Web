-- ==============================================================================
-- PARKEASE SUPABASE DEMO SEED DATA
-- Run this in your Supabase SQL Editor AFTER running schema.sql
-- ==============================================================================

-- 1. SEED PROFILES
-- Note: In production, profiles are auto-created when users register via Supabase Auth.
-- These seeded mock profiles provide hosts and renters for sample spots.

INSERT INTO public.profiles (id, name, email, avatar, role, phone, member_since)
VALUES
    ('00000000-0000-0000-0000-000000000001'::uuid, 'Marcus Vance', 'marcus.vance@example.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'host', '+1 (555) 791-4401', 'March 2023'),
    ('00000000-0000-0000-0000-000000000002'::uuid, 'Sarah Jenkins', 'sarah.jenkins@example.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 'host', '+1 (555) 420-1982', 'January 2024'),
    ('00000000-0000-0000-0000-000000000003'::uuid, 'Skyline Logistics', 'contact@skylineparking.com', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', 'host', '+1 (555) 880-9921', 'November 2022'),
    ('00000000-0000-0000-0000-000000000004'::uuid, 'Alexander Ross', 'alexander.ross@example.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 'host', '+1 (555) 234-9018', 'February 2023'),
    ('00000000-0000-0000-0000-000000000005'::uuid, 'Oliver & Mia Thorne', 'thorne.rentals@example.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'host', '+1 (555) 671-8820', 'May 2024'),
    ('00000000-0000-0000-0000-000000000006'::uuid, 'Alex Mercer', 'alex.mercer@example.com', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80', 'renter', '+1 (555) 382-9012', 'April 2024')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email;

-- 2. SEED LISTINGS (6 Detailed San Francisco Spots)
INSERT INTO public.listings (
    id, host_id, title, description, address, neighborhood, city, state, zip_code,
    lat, lng, price_per_hour, price_per_day, spot_type, allowed_vehicles,
    photos, amenities, rating, review_count, instant_book, is_active,
    access_instructions, security_features, length_ft, width_ft, height_clearance_ft
) VALUES
(
    'spot-1',
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Private Downtown Covered Garage Spot - Near Financial District',
    'Secured indoor parking stall in a boutique residential building. Located only 2 blocks from the Central Metro Station and Financial Center. Ideal for daily commuters, business meetings, or weekend event goers. Height clearance 7''2". Equipped with keyless digital app entry.',
    '450 Market St, Bay Area',
    'Financial District',
    'San Francisco',
    'CA',
    '94105',
    37.7915,
    -122.401,
    12.00,
    65.00,
    'garage',
    ARRAY['compact', 'sedan', 'suv']::TEXT[],
    ARRAY[
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80'
    ]::TEXT[],
    ARRAY['ev_charging', 'cctv', 'covered', '24_7', 'lighting']::TEXT[],
    4.94,
    48,
    TRUE,
    TRUE,
    'Enter through the gate on Fremont St. Tap the QR gate pass or dial code #4521 on the keypad.',
    ARRAY['Surveillance cameras 24/7', 'On-site building concierge', 'Automated gated barrier']::TEXT[],
    19.0,
    9.5,
    7.2
),
(
    'spot-2',
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Spacious Residential Driveway with EV Charger near Transit Hub',
    'Quiet, wide residential driveway located in a safe neighborhood 5 minutes walk from the light rail station. Zero street parking hassle. Equipped with a ChargePoint Level 2 EV charger (J1772 connector) free to use during your stay!',
    '812 Mission Creek Way',
    'Mission Bay',
    'San Francisco',
    'CA',
    '94158',
    37.7725,
    -122.392,
    7.00,
    38.00,
    'driveway',
    ARRAY['compact', 'sedan', 'suv', 'van']::TEXT[],
    ARRAY[
        'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=800&q=80'
    ]::TEXT[],
    ARRAY['ev_charging', 'lighting', 'paved', 'oversized', 'cctv']::TEXT[],
    4.98,
    32,
    TRUE,
    TRUE,
    'Park on the right side of the dual driveway. Plug in your vehicle with the wallbox on the fence.',
    ARRAY['Ring Doorbell overlooking driveway', 'Motion sensor floodlights']::TEXT[],
    22.0,
    11.0,
    NULL
),
(
    'spot-3',
    '00000000-0000-0000-0000-000000000003'::uuid,
    'Secured Airport Long-Term Covered Parking with Shuttle Nearby',
    'Gated and secure open-air & covered parking compound only 7 minutes from airport terminals. Continuous security patrol and high-perimeter fencing. Cost is a fraction of on-airport long-term parking.',
    '1200 Airport Blvd',
    'South Airport Corridor',
    'San Francisco',
    'CA',
    '94080',
    37.6213,
    -122.379,
    5.00,
    28.00,
    'lot',
    ARRAY['compact', 'sedan', 'suv', 'van']::TEXT[],
    ARRAY[
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
    ]::TEXT[],
    ARRAY['cctv', 'gated', 'lighting', '24_7', 'oversized']::TEXT[],
    4.86,
    119,
    TRUE,
    TRUE,
    'Scan your barcode on the entry kiosk. Park in any space marked with a Green ParkEase placard.',
    ARRAY['Perimeter fence with electronic gate', '24-hour guard on duty', 'High-definition cameras']::TEXT[],
    20.0,
    10.0,
    NULL
),
(
    'spot-4',
    '00000000-0000-0000-0000-000000000004'::uuid,
    'Gated Luxury Condo Parking Stall - Union Square & Theater District',
    'Premier subterranean parking stall under a luxury residential tower. Climate controlled, exceptionally safe, and steps away from Union Square shopping, world-class theaters, and premier dining spots.',
    '220 Post St',
    'Union Square',
    'San Francisco',
    'CA',
    '94108',
    37.7885,
    -122.406,
    15.00,
    80.00,
    'garage',
    ARRAY['compact', 'sedan', 'suv']::TEXT[],
    ARRAY[
        'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
    ]::TEXT[],
    ARRAY['covered', 'cctv', 'gated', 'lighting', '24_7']::TEXT[],
    4.97,
    64,
    TRUE,
    TRUE,
    'Drive up to the basement ramp on Sutter St. Concierge will verify your ParkEase reservation pass.',
    ARRAY['Uniformed 24/7 security guard', 'Biometric & fob entry', 'Video monitoring']::TEXT[],
    19.5,
    9.8,
    7.5
),
(
    'spot-5',
    '00000000-0000-0000-0000-000000000005'::uuid,
    'Marina District Waterfront Driveway - Near Golden Gate Bridge & Crissy Field',
    'Perfect spot for beach lovers, tourists visiting the Golden Gate Promenade, and local weekenders. Wide paved single car driveway on a charming tree-lined avenue.',
    '3210 Marina Blvd',
    'Marina District',
    'San Francisco',
    'CA',
    '94123',
    37.8042,
    -122.441,
    9.00,
    48.00,
    'driveway',
    ARRAY['compact', 'sedan', 'suv']::TEXT[],
    ARRAY[
        'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=800&q=80'
    ]::TEXT[],
    ARRAY['lighting', 'paved', 'cctv']::TEXT[],
    4.89,
    27,
    FALSE,
    TRUE,
    'Pull straight into the left parking pad next to the hedge. Leave enough clearance for sidewalk pedestrians.',
    ARRAY['Quiet residential street', 'Ring camera with spotlight']::TEXT[],
    18.0,
    9.0,
    NULL
),
(
    'spot-6',
    '00000000-0000-0000-0000-000000000001'::uuid,
    'SoMa Tech District Covered Bay - Fast EV Charger + 24/7 Gate',
    'Underground allocated parking stall in the heart of SoMa. Adjacent to tech offices, Moscone Center, and modern cafes. High speed Level 2 Tesla Destination Charger installed (adapters for J1772 available).',
    '680 Folsom St',
    'South of Market',
    'San Francisco',
    'CA',
    '94107',
    37.784,
    -122.398,
    11.00,
    58.00,
    'covered',
    ARRAY['compact', 'sedan', 'suv']::TEXT[],
    ARRAY[
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80'
    ]::TEXT[],
    ARRAY['ev_charging', 'covered', 'cctv', 'gated', '24_7', 'lighting']::TEXT[],
    4.96,
    41,
    TRUE,
    TRUE,
    'Gate opens automatically via ParkEase Bluetooth pass or dial pad code 9087.',
    ARRAY['Gated access', '24/7 security recording']::TEXT[],
    20.0,
    9.5,
    7.0
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price_per_hour = EXCLUDED.price_per_hour;

-- 3. SEED REVIEWS
INSERT INTO public.reviews (id, spot_id, author_name, author_avatar, rating, comment, date)
VALUES
    ('rev-1', 'spot-1', 'David Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', 5, 'Super easy access! The digital gate code worked instantly. The spot is wide enough for my Tesla Model Y and having Level 2 charging was a huge plus.', 'September 14, 2026'),
    ('rev-2', 'spot-1', 'Elena Rostova', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', 5, 'Lifesaver for my conference downtown. Commercial garages were charging $35 for 2 hours, this was convenient, secure, and half the price.', 'August 28, 2026'),
    ('rev-3', 'spot-1', 'Kevin Miller', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', 4, 'Great spot, well lit and very clean. Tight turn on the ramp if you have a larger truck, but standard sedans and compacts fit with ease.', 'August 12, 2026'),
    ('rev-4', 'spot-2', 'Michael Chang', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', 5, 'Sarah is an amazing host! The driveway was clean and ready. Charged my car fully while I was at a game at the arena nearby.', 'September 20, 2026'),
    ('rev-5', 'spot-3', 'Jessica Adams', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', 5, 'Left my SUV here for an 8-day trip to Mexico. Returned at 1 AM, shuttle dropped me right off, car was completely safe.', 'September 10, 2026'),
    ('rev-6', 'spot-4', 'Claire Redfield', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', 5, 'Incredible location for Broadway SF shows. Saved so much time and peace of mind knowing my car was inside an attended garage.', 'September 18, 2026')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED SAMPLE BOOKINGS
INSERT INTO public.bookings (
    id, spot_id, renter_id, renter_name, renter_email,
    start_date, start_time, end_date, end_time, hours, total_amount,
    status, gate_code, vehicle_plate, vehicle_model, has_reviewed
) VALUES
(
    'BK-94821',
    'spot-1',
    '00000000-0000-0000-0000-000000000006'::uuid,
    'Alex Mercer',
    'alex.mercer@example.com',
    '2026-09-28',
    '09:00:00',
    '2026-09-28',
    '15:00:00',
    6.0,
    74.50,
    'upcoming',
    '#4521',
    '7XYZ892',
    'Tesla Model 3 (Midnight Silver)',
    FALSE
),
(
    'BK-83104',
    'spot-2',
    '00000000-0000-0000-0000-000000000006'::uuid,
    'Alex Mercer',
    'alex.mercer@example.com',
    '2026-09-22',
    '10:00:00',
    '2026-09-22',
    '14:00:00',
    4.0,
    30.50,
    'completed',
    'RIGHT-PAD-3',
    '7XYZ892',
    'Tesla Model 3 (Midnight Silver)',
    TRUE
),
(
    'BK-71952',
    'spot-4',
    '00000000-0000-0000-0000-000000000006'::uuid,
    'Alex Mercer',
    'alex.mercer@example.com',
    '2026-09-15',
    '18:00:00',
    '2026-09-15',
    '23:00:00',
    5.0,
    77.50,
    'completed',
    'VALET-CONDO-44',
    '7XYZ892',
    'Tesla Model 3 (Midnight Silver)',
    FALSE
)
ON CONFLICT (id) DO NOTHING;
