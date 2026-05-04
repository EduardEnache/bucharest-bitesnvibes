'use client';

import { useState, useEffect } from 'react';
import type { VenueCreateInput, VenueUpdateInput, Venue, PlaceAutocompleteResult } from '@/types';
import { VENUE_TYPES, VENUE_TAG_SUGGESTIONS } from '@/types';
import { BUCHAREST_NEIGHBORHOODS, getNeighborhoodsBySector } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { useDebounce } from '@/hooks/useDebounce';

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue?: Venue | null;
  onSave: (data: VenueCreateInput | VenueUpdateInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function VenueModal({ isOpen, onClose, venue, onSave, onDelete }: VenueModalProps) {
  const isEdit = !!venue;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceAutocompleteResult[]>([]);
  const [synced, setSynced] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [form, setForm] = useState<VenueCreateInput>({
    name: '', type: 'Coffee', tags: [], priceLevel: 2, status: 'TO_TRY',
    neighborhood: '', sector: null, address: null, googlePlaceId: null,
    lat: 44.4268, lng: 26.1025, personalRating: null, dateVisited: null,
    notes: null, coverImageUrl: null, phoneNumber: null, website: null,
    googleRating: null, googleReviewCount: null, googlePriceLevel: null, openingHours: null,
  });

  useEffect(() => {
    if (venue) {
      setForm({
        name: venue.name, type: venue.type, tags: venue.tags, priceLevel: venue.priceLevel,
        status: venue.status, neighborhood: venue.neighborhood, sector: venue.sector,
        address: venue.address, googlePlaceId: venue.googlePlaceId, lat: venue.lat, lng: venue.lng,
        personalRating: venue.personalRating, dateVisited: venue.dateVisited?.split('T')[0] || null,
        notes: venue.notes, coverImageUrl: venue.coverImageUrl, phoneNumber: venue.phoneNumber,
        website: venue.website, googleRating: venue.googleRating, googleReviewCount: venue.googleReviewCount,
        googlePriceLevel: venue.googlePriceLevel, openingHours: venue.openingHours,
      });
    }
  }, [venue]);

  // Autocomplete search
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 3) { setSuggestions([]); return; }
    if (debouncedSearch.startsWith('http')) {
      handleUrlResolve(debouncedSearch);
      return;
    }
    fetch(`/api/places?input=${encodeURIComponent(debouncedSearch)}`)
      .then(r => r.json())
      .then(data => { if (data.success) setSuggestions(data.data || []); })
      .catch(() => setSuggestions([]));
  }, [debouncedSearch]);

  async function handleUrlResolve(url: string) {
    try {
      const res = await fetch(`/api/places?action=resolve&url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.success && data.data?.placeId) await fillFromPlace(data.data.placeId);
    } catch { /* ignore */ }
  }

  async function fillFromPlace(placeId: string) {
    try {
      const res = await fetch(`/api/places?action=details&placeId=${placeId}`);
      const data = await res.json();
      if (data.success && data.data) {
        const p = data.data;
        const matched = BUCHAREST_NEIGHBORHOODS.find(n => p.address?.toLowerCase().includes(n.name.toLowerCase()));
        setForm(prev => ({
          ...prev, name: p.name || prev.name, address: p.address, lat: p.lat, lng: p.lng,
          googlePlaceId: p.placeId, googleRating: p.rating, googleReviewCount: p.reviewCount,
          googlePriceLevel: p.priceLevel, priceLevel: p.priceLevel || prev.priceLevel,
          coverImageUrl: p.photoUrl, openingHours: p.openingHours, phoneNumber: p.phoneNumber,
          website: p.website, type: p.venueType || prev.type,
          neighborhood: matched?.name || prev.neighborhood, sector: matched?.sector || prev.sector,
        }));
        setSynced(true); setSuggestions([]);
      }
    } catch { /* ignore */ }
  }

  function updateForm(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function toggleTag(tag: string) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) ? prev.tags.filter(t => t !== tag) : [...(prev.tags || []), tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try { await onSave(form); onClose(); } finally { setLoading(false); }
  }

  const neighborhoodsBySector = getNeighborhoodsBySector();
  const neighborhoodOptions = Object.entries(neighborhoodsBySector).flatMap(([sector, hoods]) =>
    hoods.map(h => ({ value: h.name, label: `${h.name} (${sector})` }))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Venue' : 'Add New Venue'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Search / URL */}
        <div>
          <Input
            label="Search or paste Google Maps URL"
            icon="search"
            placeholder="Search venue name or paste Google Maps URL..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {synced && (
            <Badge variant="success" size="sm" icon="check_circle" className="mt-2">
              Synced from Google Maps
            </Badge>
          )}
          {suggestions.length > 0 && (
            <div className="mt-1 bg-surface-container-high border border-outline-variant rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {suggestions.map(s => (
                <button key={s.placeId} type="button"
                  className="w-full text-left px-4 py-3 hover:bg-surface-container-highest transition-colors border-b border-outline-variant/50 last:border-b-0"
                  onClick={() => fillFromPlace(s.placeId)}>
                  <p className="text-sm font-medium text-on-surface">{s.mainText}</p>
                  <p className="text-xs text-on-surface-variant">{s.secondaryText}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Name */}
        <Input label="Name" required value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Venue name" />

        {/* Cover Image URL */}
        <div>
          <Input label="Cover Image URL" value={form.coverImageUrl || ''} onChange={e => updateForm('coverImageUrl', e.target.value || null)} placeholder="https://..." />
          {form.coverImageUrl && (
            <div className="mt-2 rounded-lg overflow-hidden h-24 bg-surface-container-high">
              <img src={form.coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Type & Status row */}
        <div className="grid grid-cols-2 gap-4">
          <Select label="Type" value={form.type} onChange={e => updateForm('type', e.target.value)}
            options={VENUE_TYPES.map(t => ({ value: t, label: t }))} />
          <Select label="Status" value={form.status || 'TO_TRY'} onChange={e => updateForm('status', e.target.value)}
            options={[
              { value: 'TO_TRY', label: 'To Try' }, { value: 'VISITED', label: 'Visited' },
              { value: 'FAVORITE', label: 'Favorite' }, { value: 'NOT_GOING', label: 'Not Going' },
            ]} />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {VENUE_TAG_SUGGESTIONS.map(tag => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  form.tags?.includes(tag)
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-outline'
                }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Price Level */}
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Price Level</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(level => (
              <button key={level} type="button" onClick={() => updateForm('priceLevel', level)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  form.priceLevel === level
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-outline'
                }`}>
                {'$'.repeat(level)}
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhood */}
        <Select label="Neighborhood" value={form.neighborhood} onChange={e => {
          const n = BUCHAREST_NEIGHBORHOODS.find(n => n.name === e.target.value);
          updateForm('neighborhood', e.target.value);
          if (n) updateForm('sector', n.sector);
        }} options={neighborhoodOptions} placeholder="Select neighborhood" />

        {/* Address */}
        <Input label="Address" value={form.address || ''} onChange={e => updateForm('address', e.target.value || null)} placeholder="Street address" />

        {/* Rating & Date (conditional) */}
        {(form.status === 'VISITED' || form.status === 'FAVORITE') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Personal Rating</label>
              <StarRating rating={form.personalRating ?? null} editable onChange={r => updateForm('personalRating', r)} size="lg" showValue={false} />
            </div>
            <Input label="Date Visited" type="date" value={form.dateVisited?.split('T')[0] || ''} onChange={e => updateForm('dateVisited', e.target.value || null)} />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Notes</label>
          <textarea value={form.notes || ''} onChange={e => updateForm('notes', e.target.value || null)}
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-y"
            placeholder="Your personal notes about this venue..." />
        </div>

        {/* Read-only fields */}
        {form.googlePlaceId && (
          <div className="text-xs text-on-surface-variant space-y-1 bg-surface-container-high p-3 rounded-xl">
            <p>Place ID: {form.googlePlaceId}</p>
            <p>Coordinates: {form.lat.toFixed(6)}, {form.lng.toFixed(6)}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
          {isEdit && onDelete ? (
            <Button type="button" variant="danger" onClick={onDelete}>Delete Venue</Button>
          ) : <div />}
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading || !form.name}>
              {loading ? 'Saving...' : 'Save Venue'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
