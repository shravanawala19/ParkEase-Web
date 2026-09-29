'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ParkingSpot, Booking, Review, VehicleSize, SpotType } from '@/types/parking';
import { INITIAL_PARKING_SPOTS, INITIAL_BOOKINGS } from '@/data/mockData';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  fetchLiveListings,
  fetchLiveBookings,
  insertLiveBooking,
  cancelLiveBooking,
  submitLiveReview,
  insertLiveListing,
} from '@/lib/supabase/api';

export type UserRole = 'renter' | 'host';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  phone: string;
  memberSince: string;
}

interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  spots: ParkingSpot[];
  bookings: Booking[];
  wishlist: string[];
  toggleWishlist: (spotId: string) => void;
  isWishlisted: (spotId: string) => boolean;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'gateCode'>) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  addReview: (spotId: string, bookingId: string, rating: number, comment: string) => Promise<void>;
  addListing: (newSpot: Omit<ParkingSpot, 'id' | 'rating' | 'reviewCount' | 'reviews' | 'host'>) => Promise<ParkingSpot>;
  toggleSpotStatus: (spotId: string) => Promise<void>;
  updateSpotPrice: (spotId: string, newPrice: number) => Promise<void>;
  authModal: { isOpen: boolean; mode: 'login' | 'signup' };
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  reviewModal: { isOpen: boolean; booking: Booking | null };
  openReviewModal: (booking: Booking) => void;
  closeReviewModal: () => void;
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  activeFilterSearch: string;
  setActiveFilterSearch: (val: string) => void;
  // Part 2 Backend additions
  backendMode: 'live' | 'simulation';
  isSupabaseConnected: boolean;
  isStripeConfigured: boolean;
  isLoadingData: boolean;
  refreshData: () => Promise<void>;
  signInWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  searchLocation: { lat: number; lng: number; address: string; countryCode: string } | null;
  setSearchLocation: (loc: { lat: number; lng: number; address: string; countryCode: string } | null) => void;
  currency: string;
  formatPrice: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_RENTER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000006',
  name: 'Alex Mercer',
  email: 'alex.mercer@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  role: 'renter',
  phone: '+1 (555) 382-9012',
  memberSince: 'April 2024',
};

const DEMO_HOST: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Marcus Vance',
  email: 'marcus.vance@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  role: 'host',
  phone: '+1 (555) 791-4401',
  memberSince: 'March 2023',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>('renter');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_RENTER);
  const [spots, setSpots] = useState<ParkingSpot[]>(INITIAL_PARKING_SPOTS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [wishlist, setWishlist] = useState<string[]>(['spot-1', 'spot-4']);
  const [activeFilterSearch, setActiveFilterSearch] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number; address: string; countryCode: string } | null>(null);
  
  const getCurrencyCode = (countryCode: string) => {
    const code = countryCode?.toLowerCase() || 'us';
    const map: Record<string, string> = {
      us: 'USD', gb: 'GBP', in: 'INR', ca: 'CAD', au: 'AUD', jp: 'JPY',
      de: 'EUR', fr: 'EUR', it: 'EUR', es: 'EUR', nl: 'EUR',
    };
    return map[code] || 'USD';
  };
  
  const currency = searchLocation ? getCurrencyCode(searchLocation.countryCode) : 'USD';
  
  const formatPrice = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }, [currency]);

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login',
  });

  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; booking: Booking | null }>({
    isOpen: false,
    booking: null,
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load initial live listings and bookings
  const loadInitialData = useCallback(async () => {
    setIsLoadingData(true);
    const configured = isSupabaseConfigured();
    setIsSupabaseConnected(configured);

    if (configured) {
      try {
        const [liveSpots, liveBookings] = await Promise.all([
          fetchLiveListings(),
          fetchLiveBookings(currentUser.email || undefined),
        ]);
        if (liveSpots && liveSpots.length > 0) setSpots(liveSpots);
        if (liveBookings && liveBookings.length > 0) setBookings(liveBookings);
      } catch (e) {
        console.warn('Falling back to local mock data:', e);
      }
    }
    setIsLoadingData(false);
  }, [currentUser.email]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Generate dynamic spots when search location changes
  useEffect(() => {
    if (searchLocation) {
      import('@/data/mockData').then(({ generateDynamicSpots }) => {
        const newSpots = generateDynamicSpots(searchLocation.lat, searchLocation.lng, searchLocation.address);
        setSpots(newSpots);
      });
    }
  }, [searchLocation]);

  // Supabase Auth listener
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncProfile(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await syncProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(DEMO_RENTER);
        setUserRoleState('renter');
      }
    });

    async function syncProfile(user: any) {
      if (!supabase) return;
      try {
        const { data: profile } = await (supabase.from('profiles') as any)
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const mappedRole: UserRole = profile.role === 'host' ? 'host' : 'renter';
          setCurrentUser({
            id: profile.id,
            name: profile.name || user.email?.split('@')[0] || 'User',
            email: profile.email || user.email || '',
            avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
            role: mappedRole,
            phone: profile.phone || '',
            memberSince: profile.member_since || 'Recent',
          });
          setUserRoleState(mappedRole);
        }
      } catch (err) {
        console.error('Failed to sync user profile:', err);
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load wishlist & saved role from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('parkease_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedRole = localStorage.getItem('parkease_role') as UserRole;
      if (savedRole) {
        setUserRoleState(savedRole);
        setCurrentUser(savedRole === 'host' ? DEMO_HOST : DEMO_RENTER);
      }
    } catch {}
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    setCurrentUser(role === 'host' ? DEMO_HOST : DEMO_RENTER);
    try {
      localStorage.setItem('parkease_role', role);
    } catch {}
    showToast(`Switched to ${role === 'host' ? 'Host Mode' : 'Renter Mode'}`, undefined, 'info');
  };

  const toggleWishlist = (spotId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(spotId);
      const updated = exists ? prev.filter((id) => id !== spotId) : [...prev, spotId];
      try {
        localStorage.setItem('parkease_wishlist', JSON.stringify(updated));
      } catch {}
      showToast(exists ? 'Removed from saved spots' : 'Saved to favorites ❤️', undefined, 'info');
      return updated;
    });
  };

  const isWishlisted = (spotId: string) => wishlist.includes(spotId);

  // Add Booking (Live Supabase + Local)
  const addBooking = async (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'gateCode'>
  ): Promise<Booking> => {
    const newBooking = await insertLiveBooking(bookingData, currentUser.id);
    setBookings((prev) => [newBooking, ...prev]);
    showToast('Reservation Confirmed! 🎉', `Booking ${newBooking.id} is locked in with code ${newBooking.gateCode}`, 'success');
    return newBooking;
  };

  // Cancel Booking — uses server API for Stripe refund, then falls back to direct Supabase update
  const cancelBooking = async (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (data.refunded) {
        showToast('Booking Cancelled & Refunded', 'Your Stripe payment has been refunded.', 'success');
      } else {
        showToast('Booking Cancelled', 'Your reservation was cancelled.', 'info');
      }
    } catch {
      // Fallback to direct Supabase cancel
      await cancelLiveBooking(bookingId);
      showToast('Booking Cancelled', 'Your reservation was cancelled.', 'info');
    }
  };

  // Add Review (Live Supabase + Local)
  const addReview = async (spotId: string, bookingId: string, rating: number, comment: string) => {
    const newReview = await submitLiveReview(
      spotId,
      bookingId,
      currentUser.name,
      currentUser.avatar,
      rating,
      comment,
      currentUser.id
    );

    setSpots((prev) =>
      prev.map((spot) => {
        if (spot.id !== spotId) return spot;
        const newReviews = [newReview, ...spot.reviews];
        const newCount = spot.reviewCount + 1;
        const newRating = Number(
          (spot.reviews.reduce((acc, r) => acc + r.rating, rating) / newCount).toFixed(2)
        );
        return {
          ...spot,
          reviews: newReviews,
          reviewCount: newCount,
          rating: newRating,
        };
      })
    );

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, hasReviewed: true } : b))
    );

    showToast('Review Submitted!', 'Thank you for your feedback.', 'success');
  };

  // Add Listing (Live Supabase + Local)
  const addListing = async (
    newSpotData: Omit<ParkingSpot, 'id' | 'rating' | 'reviewCount' | 'reviews' | 'host'>
  ): Promise<ParkingSpot> => {
    const newSpot = await insertLiveListing(newSpotData, currentUser.id);
    setSpots((prev) => [newSpot, ...prev]);
    showToast('Parking Spot Published!', 'Your listing is now live in the database.', 'success');
    return newSpot;
  };

  const toggleSpotStatus = async (spotId: string) => {
    setSpots((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, isActive: !s.isActive } : s))
    );
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const current = spots.find((s) => s.id === spotId);
      await (supabase.from('listings') as any)
        .update({ is_active: !current?.isActive })
        .eq('id', spotId);
    }
    showToast('Listing Status Updated', undefined, 'info');
  };

  const updateSpotPrice = async (spotId: string, newPrice: number) => {
    setSpots((prev) =>
      prev.map((s) =>
        s.id === spotId
          ? { ...s, pricePerHour: newPrice, pricePerDay: newPrice * 5 }
          : s
      )
    );
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await (supabase.from('listings') as any)
        .update({ price_per_hour: newPrice, price_per_day: newPrice * 5 })
        .eq('id', spotId);
    }
    showToast('Hourly Rate Updated', `New price: $${newPrice}/hr`, 'success');
  };

  // Real Supabase Auth Methods
  const signInWithSupabase = async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      // Simulation mode
      setUserRoleState('renter');
      setCurrentUser({
        ...DEMO_RENTER,
        email,
        name: email.split('@')[0],
      });
      showToast('Signed in (Simulation Mode)', undefined, 'success');
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showToast('Login Failed', error.message, 'error');
        return { success: false, error: error.message };
      }

      showToast('Welcome back!', `Signed in as ${data.user?.email}`, 'success');
      return { success: true };
    } catch (e: any) {
      showToast('Login Error', e.message, 'error');
      return { success: false, error: e.message };
    }
  };

  const signUpWithSupabase = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      // Simulation mode
      setUserRoleState(role);
      setCurrentUser({
        id: `usr-${Date.now()}`,
        name,
        email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        role,
        phone: '',
        memberSince: 'Today',
      });
      showToast('Account Created (Simulation Mode)', `Welcome ${name}!`, 'success');
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        showToast('Registration Failed', error.message, 'error');
        return { success: false, error: error.message };
      }

      showToast('Account Created! 🎉', 'Check your email to verify or continue browsing.', 'success');
      return { success: true };
    } catch (e: any) {
      showToast('Sign up Error', e.message, 'error');
      return { success: false, error: e.message };
    }
  };

  const signOutUser = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(DEMO_RENTER);
    setUserRoleState('renter');
    showToast('Signed Out', 'You have been safely signed out.', 'info');
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const openReviewModal = (booking: Booking) => {
    setReviewModal({ isOpen: true, booking });
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, booking: null });
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
        spots,
        bookings,
        wishlist,
        toggleWishlist,
        isWishlisted,
        addBooking,
        cancelBooking,
        addReview,
        addListing,
        toggleSpotStatus,
        updateSpotPrice,
        authModal,
        openAuthModal,
        closeAuthModal,
        reviewModal,
        openReviewModal,
        closeReviewModal,
        toasts,
        showToast,
        removeToast,
        activeFilterSearch,
        setActiveFilterSearch,
        backendMode: isSupabaseConnected ? 'live' : 'simulation',
        isSupabaseConnected,
        isStripeConfigured: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        isLoadingData,
        refreshData: loadInitialData,
        signInWithSupabase,
        signUpWithSupabase,
        signOutUser,
        searchLocation,
        setSearchLocation,
        currency,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
