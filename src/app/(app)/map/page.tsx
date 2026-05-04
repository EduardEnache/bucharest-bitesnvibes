'use client';

import { useEffect, useState } from 'react';
import type { Venue } from '@/types';
import GlobalMap from '@/components/map/GlobalMap';
import MapFilters from '@/components/map/MapFilters';
import Input from '@/components/ui/Input';
import { useMap } from '@/hooks/useMap';
import { useDebounce } from '@/hooks/useDebounce';

export default function MapPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    fetch('/api/venues?limit=200')
      .then(r => r.json())
      .then(data => { if (data.success) setVenues(data.data); })
      .catch(console.error);
  }, []);

  const { filteredVenues, filters, toggleStatus, toggleTopRated, setNeighborhood, setSearch, reset } = useMap(venues);

  useEffect(() => { setSearch(debouncedSearch); }, [debouncedSearch, setSearch]);

  return (
    <div className="relative h-[calc(100vh-56px)]">
      {/* Map */}
      <GlobalMap venues={filteredVenues} height="100%" interactive />

      {/* Floating Search */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <Input
          icon="search"
          placeholder="Search venues or neighborhoods..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="bg-surface/95 backdrop-blur-xl shadow-xl"
        />
      </div>

      {/* Filter Toggle (mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-4 right-4 z-10 md:hidden p-3 rounded-xl bg-surface/95 backdrop-blur-xl border border-outline-variant shadow-xl"
      >
        <span className="material-symbols-outlined text-on-surface">tune</span>
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-4 right-4 z-10 hidden md:block">
          <MapFilters
            statuses={filters.statuses}
            onStatusToggle={toggleStatus}
            topRated={filters.topRated}
            onTopRatedToggle={toggleTopRated}
            neighborhood={filters.neighborhood}
            onNeighborhoodChange={setNeighborhood}
            onReset={reset}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Mobile Bottom Sheet Filters */}
      {showFilters && (
        <div className="absolute bottom-0 left-0 right-0 z-10 md:hidden bg-surface border-t border-outline-variant rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto">
          <MapFilters
            statuses={filters.statuses}
            onStatusToggle={toggleStatus}
            topRated={filters.topRated}
            onTopRatedToggle={toggleTopRated}
            neighborhood={filters.neighborhood}
            onNeighborhoodChange={setNeighborhood}
            onReset={reset}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}
    </div>
  );
}
