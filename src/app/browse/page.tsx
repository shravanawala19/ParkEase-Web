'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { SpotType, VehicleSize } from '@/types/parking';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/search/ListingCard';
import ParkingMap from '@/components/search/ParkingMap';
import SearchFilters from '@/components/search/SearchFilters';
import ToastContainer from '@/components/common/Toast';
import AuthModal from '@/components/common/AuthModal';
import {
  MapPin,
  Map,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Car,
  Sparkles,
} from 'lucide-react';

function BrowseContent() {
  const searchParams = useSearchParams();
  const { spots, activeFilterSearch, setActiveFilterSearch } = useApp();

  const initialLocation = searchParams?.get('location') || activeFilterSearch || '';
  const initialType = searchParams?.get('type');

  const [locationInput, setLocationInput] = useState(initialLocation);
  const [selectedSpotType, setSelectedSpotType] = useState<SpotType | 'all'>(
    initialType === 'driveway' ? 'driveway' : 'all'
  );
  const [selectedVehicleSize, setSelectedVehicleSize] = useState<VehicleSize | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialType === 'ev' ? ['ev_charging'] : []
  );
  const [instantBookOnly, setInstantBookOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'distance'>('rating');

  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [hoveredSpotId, setHoveredSpotId] = useState<string | null>(null);
  const [selectedMapSpotId, setSelectedMapSpotId] = useState<string | null>(null);

  useEffect(() => {
    if (initialLocation && !locationInput) {
      setLocationInput(initialLocation);
    }
  }, [initialLocation]);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setLocationInput('');
    setActiveFilterSearch('');
    setSelectedSpotType('all');
    setSelectedVehicleSize('all');
    setMaxPrice(30);
    setSelectedAmenities([]);
    setInstantBookOnly(false);
    setSortBy('rating');
  };

  const filteredSpots = useMemo(() => {
    return spots
      .filter((spot) => {
        if (locationInput.trim()) {
          const query = locationInput.toLowerCase();
          const matchLoc =
            spot.title.toLowerCase().includes(query) ||
            spot.neighborhood.toLowerCase().includes(query) ||
            spot.city.toLowerCase().includes(query) ||
            spot.address.toLowerCase().includes(query);
          if (!matchLoc) return false;
        }

        if (selectedSpotType !== 'all' && spot.spotType !== selectedSpotType) {
          return false;
        }

        if (
          selectedVehicleSize !== 'all' &&
          !spot.allowedVehicles.includes(selectedVehicleSize)
        ) {
          return false;
        }

        if (spot.pricePerHour > maxPrice) {
          return false;
        }

        if (instantBookOnly && !spot.instantBook) {
          return false;
        }

        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenityId) =>
            spot.amenities.includes(amenityId)
          );
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerHour - b.pricePerHour;
        if (sortBy === 'price-desc') return b.pricePerHour - a.pricePerHour;
        if (sortBy === 'distance') return (a.distanceMiles || 99) - (b.distanceMiles || 99);
        return b.rating - a.rating;
      });
  }, [
    spots,
    locationInput,
    selectedSpotType,
    selectedVehicleSize,
    maxPrice,
    instantBookOnly,
    selectedAmenities,
    sortBy,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <ToastContainer />
      <AuthModal />

      {/* Top Search Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:max-w-md">
              <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setActiveFilterSearch(e.target.value);
                }}
                placeholder="Search by neighborhood, street, or city..."
                className="w-full pl-10 pr-4 py-2 text-sm font-medium bg-slate-100/80 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                <strong className="text-slate-900">{filteredSpots.length}</strong> spots found
              </span>

              <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:outline-none cursor-pointer text-slate-800"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="distance">Closest Distance</option>
                </select>
              </div>

              <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Split View"
                >
                  <List className="w-3.5 h-3.5" />
                  <Map className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="List Only"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Map Only"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {mobileFilterOpen && (
            <div className="lg:hidden pt-4 pb-2 border-t border-slate-100 mt-3 animate-in slide-in-from-top-2">
              <SearchFilters
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedSpotType={selectedSpotType}
                setSelectedSpotType={setSelectedSpotType}
                selectedVehicleSize={selectedVehicleSize}
                setSelectedVehicleSize={setSelectedVehicleSize}
                selectedAmenities={selectedAmenities}
                toggleAmenity={toggleAmenity}
                instantBookOnly={instantBookOnly}
                setInstantBookOnly={setInstantBookOnly}
                onReset={handleResetFilters}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-40 space-y-4">
              <SearchFilters
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedSpotType={selectedSpotType}
                setSelectedSpotType={setSelectedSpotType}
                selectedVehicleSize={selectedVehicleSize}
                setSelectedVehicleSize={setSelectedVehicleSize}
                selectedAmenities={selectedAmenities}
                toggleAmenity={toggleAmenity}
                instantBookOnly={instantBookOnly}
                setInstantBookOnly={setInstantBookOnly}
                onReset={handleResetFilters}
              />

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs text-blue-900 leading-relaxed">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-blue-800">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Instant Booking Guarantee
                </span>
                Every reservation locks in your exact parking spot with direct host communication and gate access.
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            {viewMode === 'map' && (
              <div className="h-[750px] w-full sticky top-40">
                <ParkingMap
                  spots={filteredSpots}
                  selectedSpotId={selectedMapSpotId}
                  onSelectSpot={(id) => setSelectedMapSpotId(id)}
                />
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredSpots.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                    <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">No parking spots matched your criteria</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                      Try expanding your price range, clearing specific amenities, or searching for a different neighborhood.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredSpots.map((spot) => (
                    <ListingCard key={spot.id} spot={spot} />
                  ))
                )}
              </div>
            )}

            {viewMode === 'split' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-6 space-y-4 max-h-[820px] overflow-y-auto pr-1">
                  {filteredSpots.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                      <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-slate-800">No spots found</h3>
                      <p className="text-xs text-slate-500 mt-1">Try resetting your filters.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    filteredSpots.map((spot) => (
                      <ListingCard
                        key={spot.id}
                        spot={spot}
                        isSelected={selectedMapSpotId === spot.id || hoveredSpotId === spot.id}
                        onHover={() => setHoveredSpotId(spot.id)}
                        onLeave={() => setHoveredSpotId(null)}
                      />
                    ))
                  )}
                </div>

                <div className="hidden xl:block xl:col-span-6 h-[820px] sticky top-40">
                  <ParkingMap
                    spots={filteredSpots}
                    selectedSpotId={hoveredSpotId || selectedMapSpotId}
                    onSelectSpot={(id) => setSelectedMapSpotId(id)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Loading Parking Spots...</p>
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
