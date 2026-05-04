'use client';

import type { Venue } from '@/types';
import { venueInitials } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface VenueMapPopupProps {
  venue: Venue;
  onClose: () => void;
}

export default function VenueMapPopup({ venue, onClose }: VenueMapPopupProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}&destination_place_id=${venue.googlePlaceId || ''}`;

  return (
    <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-2xl w-72 animate-fade-in">
      {/* Image */}
      <div className="relative h-28 bg-surface-container-high">
        {venue.coverImageUrl ? (
          <img src={venue.coverImageUrl} alt={venue.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-outline">{venueInitials(venue.name)}</span>
          </div>
        )}
        {venue.googleRating && (
          <div className="absolute top-2 right-2 bg-surface/80 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined filled text-amber-accent" style={{ fontSize: '12px' }}>star</span>
            <span className="text-xs font-bold text-on-surface">{venue.googleRating.toFixed(1)}</span>
          </div>
        )}
        <button onClick={onClose} className="absolute top-2 left-2 p-1 rounded-md bg-surface/80 text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
        </button>
        <button className="absolute bottom-2 right-2 p-1.5 rounded-md bg-surface/80 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bookmark</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-on-surface truncate">{venue.name}</h3>
        <p className="text-xs text-on-surface-variant mt-0.5">{venue.type} · {venue.neighborhood}</p>

        <div className="flex items-center justify-between mt-3">
          {venue.openingHours && typeof venue.openingHours === 'object' && 'openNow' in venue.openingHours ? (
            <span className={`text-xs flex items-center gap-1 ${venue.openingHours.openNow ? 'text-tertiary' : 'text-error'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
              {venue.openingHours.openNow ? 'Open now' : 'Closed'}
            </span>
          ) : <span />}
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container text-white text-xs font-medium hover:bg-primary-container/90 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>directions</span>
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}
