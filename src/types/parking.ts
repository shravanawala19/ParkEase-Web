export type SpotType = 'driveway' | 'garage' | 'lot' | 'covered' | 'street';

export type VehicleSize = 'compact' | 'sedan' | 'suv' | 'van';

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  responseRate: string;
  responseTime: string;
  isSuperhost: boolean;
  totalListings: number;
}

export interface ParkingSpot {
  id: string;
  title: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  pricePerHour: number;
  pricePerDay?: number;
  spotType: SpotType;
  allowedVehicles: VehicleSize[];
  photos: string[];
  amenities: string[];
  host: Host;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  distanceMiles?: number;
  instantBook: boolean;
  isActive: boolean;
  accessInstructions: string;
  securityFeatures: string[];
  dimensions: {
    lengthFt: number;
    widthFt: number;
    heightClearanceFt?: number;
  };
}

export interface Booking {
  id: string;
  spotId: string;
  spotTitle: string;
  spotAddress: string;
  spotPhoto: string;
  renterName: string;
  renterEmail: string;
  startDate: string; // ISO or YYYY-MM-DD
  startTime: string; // e.g. "09:00"
  endDate: string;
  endTime: string; // e.g. "17:00"
  hours: number;
  totalAmount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  gateCode: string;
  vehiclePlate: string;
  vehicleModel: string;
  createdAt: string;
  hasReviewed?: boolean;
}

export interface SearchFilterState {
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  minPrice: number;
  maxPrice: number;
  spotTypes: SpotType[];
  vehicleSize: VehicleSize | 'all';
  amenities: string[];
  instantBookOnly: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'distance';
}
