'use client';

import type { Venue } from '@/types';
import { cn, statusLabel, priceLabel, venueInitials } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';

interface VenueCardProps {
  venue: Venue;
  onClick?: () => void;
  onMarkVisited?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddToList?: () => void;
}

export default function VenueCard({
  venue,
  onClick,
  onMarkVisited,
  onEdit,
  onDelete,
  onAddToList,
}: VenueCardProps) {
  const statusVariant = venue.status.toLowerCase().replace('_', '-') as
    | 'to-try'
    | 'visited'
    | 'favorite'
    | 'not-going';

  return (
    <div
      className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden card-hover cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-surface-container-high overflow-hidden">
        {venue.coverImageUrl ? (
          <img
            src={venue.coverImageUrl}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
            <span className="text-3xl font-bold text-outline">{venueInitials(venue.name)}</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={statusVariant} size="sm">
            {statusLabel(venue.status)}
          </Badge>
        </div>

        {/* Google Rating */}
        {venue.googleRating && (
          <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <span className="material-symbols-outlined filled text-amber-accent" style={{ fontSize: '14px' }}>
              star
            </span>
            <span className="text-xs font-bold text-on-surface">{venue.googleRating.toFixed(1)}</span>
          </div>
        )}

        {/* Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToList?.();
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-surface/80 backdrop-blur-sm hover:bg-surface text-on-surface-variant hover:text-primary"
          style={{ right: venue.googleRating ? '60px' : '12px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            bookmark
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-on-surface tracking-tight truncate">{venue.name}</h3>
        <p className="text-sm text-on-surface-variant mt-0.5">
          {venue.type} · {venue.neighborhood}
        </p>

        {/* Location & Price */}
        <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
            {venue.neighborhood}{venue.sector ? ` / ${venue.sector}` : ''}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>payments</span>
            {priceLabel(venue.priceLevel)}
          </span>
        </div>

        {/* Tags */}
        {venue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {venue.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Personal Rating */}
        {venue.personalRating && (
          <div className="mt-3">
            <StarRating rating={venue.personalRating} size="sm" label="My Rating" />
          </div>
        )}

        {/* Quick Actions */}
        {venue.status === 'TO_TRY' && onMarkVisited && (
          <div className="mt-3 flex items-center justify-between">
            <StarRating rating={null} size="sm" showValue={false} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkVisited();
              }}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Mark Visited
            </button>
          </div>
        )}

        {/* Menu */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/50">
          <div className="text-xs text-on-surface-variant">
            {venue.dateVisited
              ? `Visited ${new Date(venue.dateVisited).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
              : venue.createdAt
              ? `Added ${new Date(venue.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
              : ''}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
