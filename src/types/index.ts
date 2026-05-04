// ─── Venue Types ────────────────────────────────────────────

export type VenueStatus = 'TO_TRY' | 'VISITED' | 'NOT_GOING' | 'FAVORITE';

export type ActivityType =
  | 'VENUE_ADDED'
  | 'VENUE_UPDATED'
  | 'VENUE_RATED'
  | 'VENUE_VISITED'
  | 'VENUE_FAVORITED'
  | 'LIST_CREATED'
  | 'LIST_VENUE_ADDED';

export interface Venue {
  id: string;
  name: string;
  coverImageUrl: string | null;
  type: string;
  tags: string[];
  priceLevel: number;
  status: VenueStatus;
  neighborhood: string;
  sector: string | null;
  address: string | null;
  googlePlaceId: string | null;
  lat: number;
  lng: number;
  dateVisited: string | null;
  personalRating: number | null;
  notes: string | null;
  openingHours: Record<string, unknown> | null;
  phoneNumber: string | null;
  website: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  googlePriceLevel: number | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VenueCreateInput {
  name: string;
  coverImageUrl?: string | null;
  type: string;
  tags?: string[];
  priceLevel: number;
  status?: VenueStatus;
  neighborhood: string;
  sector?: string | null;
  address?: string | null;
  googlePlaceId?: string | null;
  lat: number;
  lng: number;
  dateVisited?: string | null;
  personalRating?: number | null;
  notes?: string | null;
  openingHours?: Record<string, unknown> | null;
  phoneNumber?: string | null;
  website?: string | null;
  googleRating?: number | null;
  googleReviewCount?: number | null;
  googlePriceLevel?: number | null;
}

export interface VenueUpdateInput extends Partial<VenueCreateInput> {}

export interface VenueFilters {
  status?: VenueStatus;
  type?: string;
  neighborhood?: string;
  sector?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

// ─── List Types ─────────────────────────────────────────────

export interface List {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  listVenues?: ListVenue[];
  _count?: { listVenues: number };
}

export interface ListVenue {
  id: string;
  listId: string;
  venueId: string;
  addedAt: string;
  venue?: Venue;
}

export interface ListCreateInput {
  name: string;
  description?: string | null;
  isPublic?: boolean;
}

// ─── Activity Types ─────────────────────────────────────────

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  metadata: Record<string, unknown> | null;
  venueId: string | null;
  listId: string | null;
  createdAt: string;
  venue?: Venue | null;
  list?: List | null;
}

// ─── API Response Types ─────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  total?: number;
  page?: number;
  limit?: number;
}

// ─── Google Places Types ────────────────────────────────────

export interface PlaceAutocompleteResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
  rating: number | null;
  reviewCount: number | null;
  priceLevel: number | null;
  openingHours: Record<string, unknown> | null;
  photoUrl: string | null;
  phoneNumber: string | null;
  website: string | null;
  types: string[];
  venueType: string;
}

// ─── Map Types ──────────────────────────────────────────────

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapFiltersState {
  statuses: VenueStatus[];
  search: string;
  neighborhood: string;
  topRated: boolean;
}

// ─── Neighborhood Types ─────────────────────────────────────

export interface Neighborhood {
  name: string;
  sector: string;
}

// ─── User Preferences ──────────────────────────────────────

export interface UserPreferences {
  id: string;
  mapProvider: string;
  defaultSector: string;
  highContrast: boolean;
  displayName: string | null;
  avatarUrl: string | null;
}

// ─── Venue Type Options ─────────────────────────────────────

export const VENUE_TYPES = [
  'Coffee',
  'Burger',
  'Asian',
  'Romanian',
  'Bar',
  'Bakery',
  'Nightclub',
  'Brunch',
  'Pizza',
  'Other',
] as const;

export const VENUE_TAG_SUGGESTIONS = [
  'Cocktails',
  'Views',
  'Live Music',
  'Outdoor',
  'WiFi',
  'Reservations',
  'Vegan',
  'Pet Friendly',
  'Late Night',
  'Specialty Coffee',
  'Pastries',
  'Traditional',
  'Historic',
  'Beer',
  'Rooftop',
  'Botanical',
  'Craft Cocktails',
  'Nightlife',
] as const;
