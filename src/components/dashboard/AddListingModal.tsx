'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { SpotType, VehicleSize } from '@/types/parking';
import { POPULAR_AMENITIES } from '@/data/mockData';
import { uploadSpotPhoto } from '@/lib/supabase/api';
import {
  X,
  MapPin,
  Car,
  DollarSign,
  Camera,
  Check,
  Zap,
  Shield,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
} from 'lucide-react';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddListingModal({ isOpen, onClose }: AddListingModalProps) {
  const { addListing, isSupabaseConnected, currency } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Mission Bay');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zipCode, setZipCode] = useState('94158');
  const [spotType, setSpotType] = useState<SpotType>('driveway');
  const [pricePerHour, setPricePerHour] = useState(9);
  const [pricePerDay, setPricePerDay] = useState(45);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['lighting', 'paved']);
  const [accessInstructions, setAccessInstructions] = useState('Park on the marked driveway stall. Gate code #3399.');
  const [lengthFt, setLengthFt] = useState(20);
  const [widthFt, setWidthFt] = useState(10);
  const [instantBook, setInstantBook] = useState(true);

  // Sample photo choices
  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
  ];
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([samplePhotoPresets[1], samplePhotoPresets[0]]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const url = await uploadSpotPhoto(file);
      if (url) {
        setSelectedPhotos((prev) => [url, ...prev]);
      } else {
        const localUrl = URL.createObjectURL(file);
        setSelectedPhotos((prev) => [localUrl, ...prev]);
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  if (!isOpen) return null;

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handlePreFillDemo = () => {
    setTitle('Secured Sunny Driveway near Chase Center & Caltrain');
    setDescription('Clean, asphalt paved private driveway in a quiet family neighborhood. 6 min walk to stadium. 24/7 camera monitoring.');
    setAddress('650 4th Street');
    setNeighborhood('Mission Bay');
    setPricePerHour(8);
    setPricePerDay(40);
    setSelectedAmenities(['cctv', 'lighting', 'paved', 'ev_charging']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    addListing({
      title,
      description: description || 'Private secured parking stall with convenient street access.',
      address,
      neighborhood,
      city,
      state,
      zipCode,
      lat: 37.778 + (Math.random() - 0.5) * 0.04,
      lng: -122.41 + (Math.random() - 0.5) * 0.04,
      pricePerHour,
      pricePerDay,
      spotType,
      allowedVehicles: ['compact', 'sedan', 'suv'],
      photos: selectedPhotos.length > 0 ? selectedPhotos : samplePhotoPresets.slice(0, 2),
      amenities: selectedAmenities,
      instantBook,
      isActive: true,
      accessInstructions,
      securityFeatures: ['24/7 Security Camera', 'Motion floodlights'],
      dimensions: {
        lengthFt,
        widthFt,
        heightClearanceFt: spotType === 'garage' ? 7.2 : undefined,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                Step {step} of 3
              </span>
              <button
                type="button"
                onClick={handlePreFillDemo}
                className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto-fill Example
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {step === 1 && 'Basic Space Details & Location'}
              {step === 2 && 'Amenities & Dimensions'}
              {step === 3 && 'Pricing & Access Instructions'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Basic Info & Location */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Listing Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spacious Private Driveway near Metro Station"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Space Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['driveway', 'garage', 'covered', 'lot'] as SpotType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSpotType(t)}
                      className={`p-3 rounded-2xl border text-xs font-bold capitalize transition-all ${
                        spotType === t
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description & Driver Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe entry, lighting, landmarks, or special tips for drivers..."
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Amenities & Dimensions */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Length (Feet)
                  </label>
                  <input
                    type="number"
                    value={lengthFt}
                    onChange={(e) => setLengthFt(Number(e.target.value))}
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Width (Feet)
                  </label>
                  <input
                    type="number"
                    value={widthFt}
                    onChange={(e) => setWidthFt(Number(e.target.value))}
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Features & Amenities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {POPULAR_AMENITIES.map((item) => {
                    const active = selectedAmenities.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleAmenity(item.id)}
                        className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          active
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.name}</span>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center ${
                            active ? 'bg-blue-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {active && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Spot Photos
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Photo</span>
                      </>
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {selectedPhotos.map((p, i) => (
                    <div
                      key={`custom-${i}`}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-600 ring-2 ring-blue-600/30 group"
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setSelectedPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {samplePhotoPresets.filter((p) => !selectedPhotos.includes(p)).map((p, i) => (
                    <div
                      key={`preset-${i}`}
                      onClick={() => setSelectedPhotos((prev) => [...prev, p])}
                      className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 opacity-60 hover:opacity-100 cursor-pointer transition-all"
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white font-bold bg-slate-900/80 px-1.5 py-0.5 rounded">
                          + Add
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing & Access */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hourly Price ({currency})
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-black text-slate-400"></span>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={pricePerHour}
                      onChange={(e) => setPricePerHour(Number(e.target.value))}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">/hr</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Daily Cap ({currency})
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-black text-slate-400"></span>
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={pricePerDay}
                      onChange={(e) => setPricePerDay(Number(e.target.value))}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">/day</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Access Code & Entry Instructions (Sent to Drivers)
                </label>
                <textarea
                  rows={3}
                  value={accessInstructions}
                  onChange={(e) => setAccessInstructions(e.target.value)}
                  placeholder="Gate code, remote clicker, or specific parking bay spot number..."
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                />
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Instant Booking</span>
                  <span className="text-[11px] text-emerald-700">
                    Allow drivers to book without waiting for manual confirmation
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={instantBook}
                  onChange={(e) => setInstantBook(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="py-2.5 px-4 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !title.trim()) {
                    alert('Please enter a listing title.');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30"
              >
                Publish Parking Spot
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
