'use client';

import type { VenueStatus } from '@/types';

interface VenueMapPinProps {
  status: VenueStatus;
  selected?: boolean;
}

export default function VenueMapPin({ status, selected }: VenueMapPinProps) {
  const colors: Record<string, string> = {
    TO_TRY: '#f59e0b',
    VISITED: '#a78bfa',
    FAVORITE: '#34d399',
    NOT_GOING: '#52525b',
  };

  const color = colors[status] || '#52525b';

  return (
    <div className={`relative cursor-pointer transition-transform ${selected ? 'scale-125 z-10' : 'hover:scale-110'}`}>
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.16 24.84 0 16 0Z" fill={color} />
        <circle cx="16" cy="16" r="6" fill="#09090b" />
      </svg>
    </div>
  );
}
