'use client';

import { useState, useCallback } from 'react';
import type { Venue, VenueStatus, MapFiltersState } from '@/types';

const defaultFilters: MapFiltersState = {
  statuses: ['TO_TRY', 'VISITED', 'FAVORITE'],
  search: '',
  neighborhood: '',
  topRated: false,
};

export function useMap(venues: Venue[]) {
  const [filters, setFilters] = useState<MapFiltersState>(defaultFilters);

  const filteredVenues = venues.filter(v => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(v.status)) return false;
    if (filters.search && !v.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.neighborhood && v.neighborhood !== filters.neighborhood) return false;
    if (filters.topRated && (!v.googleRating || v.googleRating < 4.5)) return false;
    return true;
  });

  const toggleStatus = useCallback((status: VenueStatus) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status],
    }));
  }, []);

  const toggleTopRated = useCallback(() => {
    setFilters(prev => ({ ...prev, topRated: !prev.topRated }));
  }, []);

  const setNeighborhood = useCallback((neighborhood: string) => {
    setFilters(prev => ({ ...prev, neighborhood }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const reset = useCallback(() => setFilters(defaultFilters), []);

  return { filteredVenues, filters, toggleStatus, toggleTopRated, setNeighborhood, setSearch, reset };
}
