'use client';

import React from 'react';
import { SpotType, VehicleSize } from '@/types/parking';
import { POPULAR_AMENITIES } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { SlidersHorizontal, RotateCcw, Zap, Shield, Check } from 'lucide-react';

interface SearchFiltersProps {
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  selectedSpotType: SpotType | 'all';
  setSelectedSpotType: (val: SpotType | 'all') => void;
  selectedVehicleSize: VehicleSize | 'all';
  setSelectedVehicleSize: (val: VehicleSize | 'all') => void;
  selectedAmenities: string[];
  toggleAmenity: (id: string) => void;
  instantBookOnly: boolean;
  setInstantBookOnly: (val: boolean) => void;
  onReset: () => void;
}

export default function SearchFilters({
  maxPrice,
  setMaxPrice,
  selectedSpotType,
  setSelectedSpotType,
  selectedVehicleSize,
  setSelectedVehicleSize,
  selectedAmenities,
  toggleAmenity,
  instantBookOnly,
  setInstantBookOnly,
  onReset,
}: SearchFiltersProps) {
  const { formatPrice } = useApp();
  const spotTypes: { id: SpotType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'driveway', label: 'Driveway' },
    { id: 'garage', label: 'Garage' },
    { id: 'covered', label: 'Covered' },
    { id: 'lot', label: 'Secure Lot' },
  ];

  const vehicleSizes: { id: VehicleSize | 'all'; label: string }[] = [
    { id: 'all', label: 'Any Vehicle' },
    { id: 'compact', label: 'Compact' },
    { id: 'sedan', label: 'Sedan' },
    { id: 'suv', label: 'SUV / Truck' },
    { id: 'van', label: 'Van / Large' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Spot Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Parking Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {spotTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedSpotType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSpotType === t.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Max Hourly Rate
          </label>
          <span className="text-sm font-extrabold text-blue-600">{formatPrice(maxPrice)}/hr</span>
        </div>
        <input
          type="range"
          min="5"
          max="35"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>{formatPrice(5)}</span>
          <span>{formatPrice(20)}</span>
          <span>{formatPrice(35)}+</span>
        </div>
      </div>

      {/* Vehicle Size */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Vehicle Size
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {vehicleSizes.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVehicleSize(v.id)}
              className={`py-1.5 px-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                selectedVehicleSize === v.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Amenities & Features
        </label>
        <div className="space-y-2">
          {POPULAR_AMENITIES.slice(0, 5).map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity.id);
            return (
              <label
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-blue-600"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>{amenity.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Instant Book Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Instant Book Only</span>
            <span className="text-[11px] text-slate-400">Lock in spot without host review</span>
          </div>
          <input
            type="checkbox"
            checked={instantBookOnly}
            onChange={(e) => setInstantBookOnly(e.target.checked)}
            className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
