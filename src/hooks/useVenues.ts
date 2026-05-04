'use client';

import useSWR from 'swr';
import type { Venue, VenueFilters, ApiResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function buildQueryString(filters: VenueFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.type) params.set('type', filters.type);
  if (filters.neighborhood) params.set('neighborhood', filters.neighborhood);
  if (filters.sector) params.set('sector', filters.sector);
  if (filters.search) params.set('search', filters.search);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  return params.toString();
}

export function useVenues(filters: VenueFilters = {}) {
  const query = buildQueryString(filters);
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Venue[]>>(
    `/api/venues?${query}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    venues: data?.data || [],
    isLoading,
    error: error || (data && !data.success ? data.error : null),
    mutate,
  };
}

export function useVenue(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Venue>>(
    id ? `/api/venues/${id}` : null,
    fetcher
  );

  return {
    venue: data?.data || null,
    isLoading,
    error,
    mutate,
  };
}

export async function createVenue(data: Partial<Venue>): Promise<ApiResponse<Venue>> {
  const res = await fetch('/api/venues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateVenue(id: string, data: Partial<Venue>): Promise<ApiResponse<Venue>> {
  const res = await fetch(`/api/venues/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteVenue(id: string): Promise<ApiResponse> {
  const res = await fetch(`/api/venues/${id}`, { method: 'DELETE' });
  return res.json();
}
