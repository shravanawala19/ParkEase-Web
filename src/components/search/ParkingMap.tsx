'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ParkingSpot } from '@/types/parking';

import { useApp } from '@/context/AppContext';

interface ParkingMapProps {
  spots: ParkingSpot[];
  selectedSpotId?: string | null;
  onSelectSpot?: (spotId: string) => void;
}

export default function ParkingMap({
  spots,
  selectedSpotId,
  onSelectSpot,
}: ParkingMapProps) {
  const { formatPrice } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default leaflet icons path
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Default center: fallback if geolocation fails
      const defaultCenter: [number, number] = [37.785, -122.41];

      const initializeMap = (center: [number, number]) => {
        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current!, {
            center: center,
            zoom: 13,
            zoomControl: false,
          });

          L.control.zoom({ position: 'topright' }).addTo(map);

          const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_42wc_1_febf881c314dbde8d81a3ea7';
          L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoKey}`, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
          }).addTo(map);

          mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;

        // Clear existing markers
        Object.values(markersRef.current).forEach((m) => m.remove());
        markersRef.current = {};

      // Add custom HTML price badge markers for each spot
      spots.forEach((spot) => {
        const isSelected = selectedSpotId === spot.id;
        const customIcon = L.divIcon({
          className: 'custom-leaflet-pin',
          html: `<div class="custom-price-pin ${isSelected ? 'active' : ''}">
                  ${formatPrice(spot.pricePerHour)}
                 </div>`,
          iconSize: [54, 28],
          iconAnchor: [27, 14],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);

        // Popup template
        const popupContent = document.createElement('div');
        popupContent.className = 'w-64 overflow-hidden rounded-xl bg-white font-sans';
        popupContent.innerHTML = `
          <div class="relative h-28 w-full bg-slate-100">
            <img src="${spot.photos[0]}" alt="${spot.title}" class="w-full h-full object-cover" />
            <span class="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
              ${spot.spotType}
            </span>
            <div class="absolute bottom-2 right-2 bg-blue-600 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow">
              ${formatPrice(spot.pricePerHour)}/hr
            </div>
          </div>
          <div class="p-3">
            <div class="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-1">
              ★ ${spot.rating} <span class="text-slate-400 font-normal">(${spot.reviewCount} reviews)</span>
            </div>
            <h4 class="text-xs font-bold text-slate-900 line-clamp-1 mb-1">${spot.title}</h4>
            <p class="text-[11px] text-slate-500 mb-2 truncate">${spot.address}</p>
            <a href="/listings/${spot.id}" class="block text-center py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors">
              View Spot & Book
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300, minWidth: 240 });

        marker.on('click', () => {
          if (onSelectSpot) onSelectSpot(spot.id);
        });

        markersRef.current[spot.id] = marker;
      });

      // Fit bounds if multiple spots
      if (spots.length > 1) {
        const bounds = L.latLngBounds(spots.map((s) => [s.lat, s.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    };

    if (spots.length > 0) {
      initializeMap([spots[0].lat, spots[0].lng]);
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initializeMap([position.coords.latitude, position.coords.longitude]);
          },
          () => {
            initializeMap(defaultCenter);
          }
        );
      } else {
        initializeMap(defaultCenter);
      }
    }
    });

    return () => {
      isMounted = false;
    };
  }, [spots, selectedSpotId, onSelectSpot]);

  // Center on selected spot
  useEffect(() => {
    if (!selectedSpotId || !mapInstanceRef.current) return;
    const spot = spots.find((s) => s.id === selectedSpotId);
    if (spot) {
      mapInstanceRef.current.panTo([spot.lat, spot.lng], { animate: true, duration: 0.8 });
      const marker = markersRef.current[spot.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedSpotId, spots]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-md text-xs font-semibold text-slate-700 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Interactive Map · {spots.length} Spots Available</span>
      </div>
    </div>
  );
}
