'use client';

import { useState, useEffect } from 'react';
import type { Venue, VenueStatus, VenueCreateInput, VenueUpdateInput } from '@/types';
import { VENUE_TYPES } from '@/types';
import VenueCard from '@/components/venue/VenueCard';
import VenueCardHero from '@/components/venue/VenueCardHero';
import VenueModal from '@/components/venue/VenueModal';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { createVenue, updateVenue, deleteVenue } from '@/hooks/useVenues';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'All Venues' },
  { value: 'TO_TRY', label: 'To Try' },
  { value: 'VISITED', label: 'Visited' },
  { value: 'FAVORITE', label: 'Favorites' },
  { value: 'NOT_GOING', label: 'Not Going' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Added' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'priceAsc', label: 'Price Low→High' },
  { value: 'priceDesc', label: 'Price High→Low' },
  { value: 'name', label: 'Name A→Z' },
  { value: 'visited', label: 'Recently Visited' },
];

export default function DirectoryPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editVenue, setEditVenue] = useState<Venue | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('type', typeFilter);
    if (debouncedSearch) params.set('search', debouncedSearch);
    params.set('sortBy', sortBy);
    params.set('page', page.toString());
    params.set('limit', '12');

    fetch(`/api/venues?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setVenues(prev => page === 1 ? data.data : [...prev, ...data.data]);
          setTotal(data.total || 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [statusFilter, typeFilter, debouncedSearch, sortBy, page]);

  function resetPage() { setPage(1); setVenues([]); }

  async function handleSave(data: VenueCreateInput | VenueUpdateInput) {
    if (editVenue) {
      await updateVenue(editVenue.id, data);
    } else {
      await createVenue(data as VenueCreateInput);
    }
    resetPage();
    setPage(1);
  }

  async function handleDelete() {
    if (editVenue) {
      await deleteVenue(editVenue.id);
      setEditVenue(null);
      setModalOpen(false);
      resetPage();
      setPage(1);
    }
  }

  async function handleMarkVisited(venue: Venue) {
    await updateVenue(venue.id, { status: 'VISITED' });
    resetPage();
    setPage(1);
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-on-surface tracking-tight">Directory Explorer</h1>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input icon="search" placeholder="Search venues..." value={search} onChange={e => { setSearch(e.target.value); resetPage(); }} />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-3">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => { setStatusFilter(f.value); resetPage(); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              statusFilter === f.value
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-outline'
            }`}>
            {f.value === 'TO_TRY' && statusFilter === f.value && <span className="w-2 h-2 rounded-full bg-amber-accent inline-block mr-1.5" />}
            {f.label}
          </button>
        ))}
        <div className="w-px h-6 bg-outline-variant shrink-0 mx-1" />
        {VENUE_TYPES.slice(0, 5).map(t => (
          <button key={t} onClick={() => { setTypeFilter(typeFilter === t ? '' : t); resetPage(); }}
            className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              typeFilter === t
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-outline'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Active filters + Sort */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {statusFilter && (
            <Badge variant="outline" size="sm" onRemove={() => { setStatusFilter(''); resetPage(); }}>
              {STATUS_FILTERS.find(f => f.value === statusFilter)?.label}
            </Badge>
          )}
          {typeFilter && (
            <Badge variant="outline" size="sm" onRemove={() => { setTypeFilter(''); resetPage(); }}>
              {typeFilter}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-on-surface-variant">Sort by:</span>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); resetPage(); }}
            className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Venue Grid */}
      {loading && venues.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-72 rounded-xl" />)}
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-outline text-5xl mb-3 block">search_off</span>
          <p className="text-on-surface-variant">No venues found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((venue, i) => (
              i === 0 && !statusFilter ? (
                <VenueCardHero key={venue.id} venue={venue} onClick={() => { setEditVenue(venue); setModalOpen(true); }} />
              ) : (
                <VenueCard key={venue.id} venue={venue}
                  onClick={() => { setEditVenue(venue); setModalOpen(true); }}
                  onEdit={() => { setEditVenue(venue); setModalOpen(true); }}
                  onDelete={async () => { await deleteVenue(venue.id); resetPage(); setPage(1); }}
                  onMarkVisited={venue.status === 'TO_TRY' ? () => handleMarkVisited(venue) : undefined}
                />
              )
            ))}
          </div>

          {/* Load More */}
          {venues.length < total && (
            <div className="flex justify-center mt-8">
              <Button variant="secondary" icon="expand_more" onClick={() => setPage(p => p + 1)}>
                Load More Venues
              </Button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      <VenueModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditVenue(null); }}
        venue={editVenue}
        onSave={handleSave}
        onDelete={editVenue ? handleDelete : undefined}
      />
    </div>
  );
}
