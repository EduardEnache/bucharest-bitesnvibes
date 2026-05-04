'use client';

import type { Venue } from '@/types';
import { statusLabel, priceLabel, venueInitials } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';

interface VenueCardHeroProps {
  venue: Venue;
  onClick?: () => void;
}

export default function VenueCardHero({ venue, onClick }: VenueCardHeroProps) {
  const statusVariant = venue.status.toLowerCase().replace('_', '-') as 'to-try' | 'visited' | 'favorite' | 'not-going';

  return (
    <div
      className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden card-hover cursor-pointer group md:col-span-2 md:row-span-2"
      onClick={onClick}
    >
      <div className="md:flex h-full">
        <div className="relative md:w-1/2 aspect-[16/10] md:aspect-auto bg-surface-container-high overflow-hidden">
          {venue.coverImageUrl ? (
            <img src={venue.coverImageUrl} alt={venue.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-highest min-h-[200px]">
              <span className="text-5xl font-bold text-outline">{venueInitials(venue.name)}</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant={statusVariant}>{statusLabel(venue.status)}</Badge>
          </div>
          {venue.googleRating && (
            <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined filled text-amber-accent" style={{ fontSize: '16px' }}>star</span>
              <span className="text-sm font-bold text-on-surface">{venue.googleRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black text-on-surface tracking-tight">{venue.name}</h3>
            <p className="text-base text-on-surface-variant mt-1">{venue.type}</p>
            <div className="flex items-center gap-3 mt-3 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                {venue.neighborhood} / {venue.sector}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>payments</span>
                {priceLabel(venue.priceLevel)}
              </span>
            </div>
            {venue.notes && <p className="text-sm text-on-surface-variant mt-4 line-clamp-3">{venue.notes}</p>}
            {venue.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {venue.tags.map((tag) => (<Badge key={tag} variant="outline" size="sm">{tag}</Badge>))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/50">
            {venue.personalRating ? (
              <StarRating rating={venue.personalRating} size="md" label="My Rating" />
            ) : (
              <span className="text-sm text-on-surface-variant">Not rated yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
