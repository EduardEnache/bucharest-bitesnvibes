'use client';

import type { VenueStatus } from '@/types';
import { getNeighborhoodsBySector } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface MapFiltersProps {
  statuses: VenueStatus[];
  onStatusToggle: (status: VenueStatus) => void;
  topRated: boolean;
  onTopRatedToggle: () => void;
  neighborhood: string;
  onNeighborhoodChange: (n: string) => void;
  onReset: () => void;
  onClose?: () => void;
}

const STATUS_OPTIONS: { value: VenueStatus; label: string; color: string }[] = [
  { value: 'VISITED', label: 'Visited Places', color: 'bg-primary' },
  { value: 'TO_TRY', label: 'To Try (Saved)', color: 'bg-amber-accent' },
  { value: 'FAVORITE', label: 'Favorites', color: 'bg-tertiary' },
  { value: 'NOT_GOING', label: 'Not Going', color: 'bg-outline' },
];

export default function MapFilters({ statuses, onStatusToggle, topRated, onTopRatedToggle, neighborhood, onNeighborhoodChange, onReset, onClose }: MapFiltersProps) {
  const neighborhoodsBySector = getNeighborhoodsBySector();

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-5 w-72">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>tune</span>
          <h3 className="text-base font-bold text-on-surface">Map Filters</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        )}
      </div>

      {/* Status */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Status</h4>
        <div className="space-y-2">
          {STATUS_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={statuses.includes(opt.value)}
                onChange={() => onStatusToggle(opt.value)}
                className="sr-only peer" />
              <div className="w-5 h-5 rounded border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary/10 flex items-center justify-center transition-colors">
                {statuses.includes(opt.value) && (
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>check</span>
                )}
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
              <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2">
          <button onClick={onTopRatedToggle}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              topRated ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-outline'
            }`}>
            Top Rated (4.5+)
          </button>
        </div>
      </div>

      {/* Neighborhoods */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Neighborhoods</h4>
        <select value={neighborhood} onChange={e => onNeighborhoodChange(e.target.value)}
          className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary">
          <option value="">All Neighborhoods</option>
          {Object.entries(neighborhoodsBySector).map(([sector, hoods]) => (
            <optgroup key={sector} label={sector}>
              {hoods.map(h => (<option key={h.name} value={h.name}>{h.name}</option>))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Reset */}
      <Button variant="secondary" fullWidth onClick={onReset}>Reset Filters</Button>
    </div>
  );
}
