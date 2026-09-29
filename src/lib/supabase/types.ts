export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar: string | null;
          role: string;
          phone: string | null;
          member_since: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          avatar?: string | null;
          role?: string;
          phone?: string | null;
          member_since?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar?: string | null;
          role?: string;
          phone?: string | null;
          member_since?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          host_id: string | null;
          title: string;
          description: string;
          address: string;
          neighborhood: string | null;
          city: string;
          state: string;
          zip_code: string;
          lat: number;
          lng: number;
          price_per_hour: number;
          price_per_day: number | null;
          spot_type: string;
          allowed_vehicles: string[];
          photos: string[];
          amenities: string[];
          rating: number;
          review_count: number;
          instant_book: boolean;
          is_active: boolean;
          access_instructions: string | null;
          security_features: string[];
          length_ft: number;
          width_ft: number;
          height_clearance_ft: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id?: string | null;
          title: string;
          description: string;
          address: string;
          neighborhood?: string | null;
          city: string;
          state: string;
          zip_code: string;
          lat: number;
          lng: number;
          price_per_hour: number;
          price_per_day?: number | null;
          spot_type?: string;
          allowed_vehicles?: string[];
          photos?: string[];
          amenities?: string[];
          rating?: number;
          review_count?: number;
          instant_book?: boolean;
          is_active?: boolean;
          access_instructions?: string | null;
          security_features?: string[];
          length_ft?: number;
          width_ft?: number;
          height_clearance_ft?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          host_id?: string | null;
          title?: string;
          description?: string;
          address?: string;
          neighborhood?: string | null;
          city?: string;
          state?: string;
          zip_code?: string;
          lat?: number;
          lng?: number;
          price_per_hour?: number;
          price_per_day?: number | null;
          spot_type?: string;
          allowed_vehicles?: string[];
          photos?: string[];
          amenities?: string[];
          rating?: number;
          review_count?: number;
          instant_book?: boolean;
          is_active?: boolean;
          access_instructions?: string | null;
          security_features?: string[];
          length_ft?: number;
          width_ft?: number;
          height_clearance_ft?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          spot_id: string;
          renter_id: string | null;
          renter_name: string;
          renter_email: string;
          start_date: string;
          start_time: string;
          end_date: string;
          end_time: string;
          hours: number;
          total_amount: number;
          status: string;
          gate_code: string | null;
          vehicle_plate: string;
          vehicle_model: string;
          stripe_session_id: string | null;
          stripe_payment_intent: string | null;
          has_reviewed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          spot_id: string;
          renter_id?: string | null;
          renter_name: string;
          renter_email: string;
          start_date: string;
          start_time: string;
          end_date: string;
          end_time: string;
          hours: number;
          total_amount: number;
          status?: string;
          gate_code?: string | null;
          vehicle_plate: string;
          vehicle_model: string;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          has_reviewed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          spot_id?: string;
          renter_id?: string | null;
          renter_name?: string;
          renter_email?: string;
          start_date?: string;
          start_time?: string;
          end_date?: string;
          end_time?: string;
          hours?: number;
          total_amount?: number;
          status?: string;
          gate_code?: string | null;
          vehicle_plate?: string;
          vehicle_model?: string;
          stripe_session_id?: string | null;
          stripe_payment_intent?: string | null;
          has_reviewed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          spot_id: string;
          booking_id: string | null;
          user_id: string | null;
          author_name: string;
          author_avatar: string | null;
          rating: number;
          comment: string;
          date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          spot_id: string;
          booking_id?: string | null;
          user_id?: string | null;
          author_name: string;
          author_avatar?: string | null;
          rating: number;
          comment: string;
          date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          spot_id?: string;
          booking_id?: string | null;
          user_id?: string | null;
          author_name?: string;
          author_avatar?: string | null;
          rating?: number;
          comment?: string;
          date?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
