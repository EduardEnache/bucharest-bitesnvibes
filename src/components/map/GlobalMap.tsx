'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { Venue } from '@/types';
import { BUCHAREST_CENTER, BUCHAREST_DEFAULT_ZOOM, GOOGLE_MAPS_DARK_STYLE } from '@/lib/utils';
import VenueMapPopup from '@/components/venue/VenueMapPopup';

interface GlobalMapProps {
  venues: Venue[];
  height?: string;
  interactive?: boolean;
  onVenueClick?: (venue: Venue) => void;
}

const PIN_COLORS: Record<string, string> = {
  TO_TRY: '#f59e0b',
  VISITED: '#a78bfa',
  FAVORITE: '#34d399',
  NOT_GOING: '#52525b',
};

export default function GlobalMap({ venues, height = '100%', interactive = true, onVenueClick }: GlobalMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const initMap = useCallback(async () => {
    if (!apiKey || !mapRef.current) {
      setError('Map unavailable — Add your Google Maps API key in .env to enable maps');
      return;
    }
    try {
      const loader = new Loader({ apiKey, version: 'weekly', libraries: ['marker'] });
      const google = await loader.load();
      const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
      
      mapInstance.current = new Map(mapRef.current, {
        center: BUCHAREST_CENTER,
        zoom: BUCHAREST_DEFAULT_ZOOM,
        styles: GOOGLE_MAPS_DARK_STYLE,
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: interactive ? 'auto' : 'none',
        backgroundColor: '#09090b',
      });
      setMapReady(true);
    } catch (err) {
      console.error('Map init error:', err);
      setError('Failed to load Google Maps');
    }
  }, [apiKey, interactive]);

  useEffect(() => { initMap(); }, [initMap]);

  // Update markers
  useEffect(() => {
    if (!mapReady || !mapInstance.current) return;
    // Clear old markers
    markersRef.current.forEach(m => m.map = null);
    markersRef.current = [];

    venues.forEach(venue => {
      const color = PIN_COLORS[venue.status] || '#52525b';
      const pinEl = document.createElement('div');
      pinEl.innerHTML = `<svg width="28" height="36" viewBox="0 0 32 40" fill="none"><path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${color}"/><circle cx="16" cy="16" r="5" fill="#09090b"/></svg>`;
      pinEl.style.cursor = 'pointer';

      try {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance.current!,
          position: { lat: venue.lat, lng: venue.lng },
          content: pinEl,
          title: venue.name,
        });

        marker.addListener('click', () => {
          setSelectedVenue(venue);
          onVenueClick?.(venue);
        });

        markersRef.current.push(marker);
      } catch {
        // Fallback to regular marker if AdvancedMarkerElement not available
        const marker = new google.maps.Marker({
          map: mapInstance.current!,
          position: { lat: venue.lat, lng: venue.lng },
          title: venue.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#09090b',
            strokeWeight: 2,
            scale: 8,
          },
        });
        marker.addListener('click', () => {
          setSelectedVenue(venue);
          onVenueClick?.(venue);
        });
      }
    });
  }, [venues, mapReady, onVenueClick]);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-surface-container border border-outline-variant rounded-xl" style={{ height }}>
        <div className="text-center p-8">
          <span className="material-symbols-outlined text-outline text-5xl mb-3 block">map</span>
          <p className="text-sm text-on-surface-variant">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container rounded-xl">
          <div className="skeleton w-full h-full" />
        </div>
      )}
      {selectedVenue && (
        <div className="absolute top-4 left-4 z-10">
          <VenueMapPopup venue={selectedVenue} onClose={() => setSelectedVenue(null)} />
        </div>
      )}
    </div>
  );
}
