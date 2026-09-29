# 🚀 ParkEase Supabase & Backend Setup Guide

This guide explains how to connect your real Supabase database and Stripe payments to ParkEase in just 3 quick steps.

---

## ⚡ Step 1: Create Free Supabase Project

1. Go to [database.new](https://database.new) and sign in / sign up (100% free tier).
2. Click **New project**, choose a name (e.g. `ParkEase`), set a database password, and select your preferred region.
3. Wait ~60 seconds for the project to provision.

---

## 📜 Step 2: Run Schema & Seed SQL

1. In your Supabase dashboard, click the **SQL Editor** tab (icon `<_` on left sidebar).
2. Click **New Query**.
3. Copy the entire contents of `supabase/schema.sql` and click **Run**.
   - This creates the `profiles`, `listings`, `bookings`, `reviews` tables, RLS security policies, triggers, and creates the `spot-photos` public storage bucket.
4. Click **New Query** again, copy the contents of `supabase/seed.sql` and click **Run**.
   - This immediately populates the database with 6 detailed San Francisco parking spaces, host profiles, ratings, and sample bookings.

---

## 🔑 Step 3: Configure Environment Variables

1. In Supabase, go to **Project Settings** (gear icon) -> **API**.
2. Copy:
   - **Project URL**
   - **Project API Keys** -> `anon` `public` key
3. In your Stripe dashboard ([dashboard.stripe.com](https://dashboard.stripe.com)):
   - Toggle **Test mode** on
   - Go to **Developers** -> **API keys**
   - Copy **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`)
4. Create or edit `.env.local` in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... # Optional (for admin seed API)

# Stripe Payments Configuration (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Optional (for live webhook confirmation)

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🛡️ Built-in Graceful Fallback Mode

ParkEase has an automatic fallback layer:
- If keys are not yet configured in `.env.local`, the application runs in **Simulated Demo Mode** using local state and high-fidelity mock data.
- As soon as valid Supabase and Stripe keys are added to `.env.local`, ParkEase seamlessly switches to live database queries, Supabase authentication, photo storage, and Stripe Checkout!
