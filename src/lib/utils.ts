import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Neighborhood } from '@/types';

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to relative time (e.g. "2 hours ago") */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Format date to display string */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Get price label from price level */
export function priceLabel(level: number): string {
  return '$'.repeat(Math.max(1, Math.min(4, level)));
}

/** Get status display label */
export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    TO_TRY: 'To Try',
    VISITED: 'Visited',
    FAVORITE: 'Favorite',
    NOT_GOING: 'Not Going',
  };
  return labels[status] || status;
}

/** Get status color class */
export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    TO_TRY: 'bg-amber-accent text-black',
    VISITED: 'bg-primary text-on-primary',
    FAVORITE: 'bg-tertiary text-black',
    NOT_GOING: 'bg-outline text-on-surface',
  };
  return colors[status] || 'bg-outline text-on-surface';
}

/** Get status dot color for indicators */
export function statusDotColor(status: string): string {
  const colors: Record<string, string> = {
    TO_TRY: 'bg-amber-accent',
    VISITED: 'bg-primary',
    FAVORITE: 'bg-tertiary',
    NOT_GOING: 'bg-outline',
  };
  return colors[status] || 'bg-outline';
}

/** Get venue initials for placeholder images */
export function venueInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/** Get activity icon name (Material Symbols) */
export function activityIcon(type: string): string {
  const icons: Record<string, string> = {
    VENUE_ADDED: 'add_circle',
    VENUE_UPDATED: 'edit_note',
    VENUE_RATED: 'star',
    VENUE_VISITED: 'check_circle',
    VENUE_FAVORITED: 'favorite',
    LIST_CREATED: 'bookmark_add',
    LIST_VENUE_ADDED: 'playlist_add',
  };
  return icons[type] || 'info';
}

/** Bucharest neighborhoods organized by sector */
export const BUCHAREST_NEIGHBORHOODS: Neighborhood[] = [
  // Sector 1
  { name: 'Aviatorilor', sector: 'Sector 1' },
  { name: 'Dorobanți', sector: 'Sector 1' },
  { name: 'Floreasca', sector: 'Sector 1' },
  { name: 'Herăstrău', sector: 'Sector 1' },
  { name: 'Victoriei', sector: 'Sector 1' },
  { name: 'Băneasa', sector: 'Sector 1' },
  { name: 'Pipera', sector: 'Sector 1' },
  // Sector 2
  { name: 'Colentina', sector: 'Sector 2' },
  { name: 'Iancului', sector: 'Sector 2' },
  { name: 'Tei', sector: 'Sector 2' },
  { name: 'Pantelimon', sector: 'Sector 2' },
  // Sector 3
  { name: 'Centrul Vechi', sector: 'Sector 3' },
  { name: 'Lipscani', sector: 'Sector 3' },
  { name: 'Unirii', sector: 'Sector 3' },
  { name: 'Titan', sector: 'Sector 3' },
  { name: 'Vitan', sector: 'Sector 3' },
  // Sector 4
  { name: 'Berceni', sector: 'Sector 4' },
  { name: 'Tineretului', sector: 'Sector 4' },
  { name: 'Văcărești', sector: 'Sector 4' },
  // Sector 5
  { name: '13 Septembrie', sector: 'Sector 5' },
  { name: 'Rahova', sector: 'Sector 5' },
  { name: 'Ferentari', sector: 'Sector 5' },
  // Sector 6
  { name: 'Cotroceni', sector: 'Sector 6' },
  { name: 'Drumul Taberei', sector: 'Sector 6' },
  { name: 'Militari', sector: 'Sector 6' },
  { name: 'Crângași', sector: 'Sector 6' },
  { name: 'Grozăvești', sector: 'Sector 6' },
  // Cross-sector / Landmarks
  { name: 'Universitate', sector: 'Sector 1' },
  { name: 'Piața Romană', sector: 'Sector 1' },
  { name: 'Piața Unirii', sector: 'Sector 3' },
];

/** Get neighborhoods grouped by sector */
export function getNeighborhoodsBySector(): Record<string, Neighborhood[]> {
  const grouped: Record<string, Neighborhood[]> = {};
  BUCHAREST_NEIGHBORHOODS.forEach((n) => {
    if (!grouped[n.sector]) grouped[n.sector] = [];
    grouped[n.sector].push(n);
  });
  return grouped;
}

/** Match an address string to a neighborhood */
export function matchNeighborhood(address: string): Neighborhood | null {
  const lower = address.toLowerCase();
  for (const n of BUCHAREST_NEIGHBORHOODS) {
    if (lower.includes(n.name.toLowerCase())) {
      return n;
    }
  }
  return null;
}

/** Dark style for Google Maps */
export const GOOGLE_MAPS_DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#09090b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#09090b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#52525b' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#27272a' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#52525b' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#121215' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#52525b' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#0c1a0c' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#18181b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#27272a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e1e22' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#27272a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#121215' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c0c18' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3b3b5c' }] },
];

/** Bucharest city center coordinates */
export const BUCHAREST_CENTER = { lat: 44.4268, lng: 26.1025 };
export const BUCHAREST_DEFAULT_ZOOM = 13;
