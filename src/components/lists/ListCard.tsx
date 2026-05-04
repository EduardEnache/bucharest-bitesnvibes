'use client';

import type { List } from '@/types';
import { venueInitials } from '@/lib/utils';

interface ListCardProps {
  list: List;
  onClick?: () => void;
}

export default function ListCard({ list, onClick }: ListCardProps) {
  const venueCount = list._count?.listVenues || list.listVenues?.length || 0;
  const venueImages = list.listVenues?.slice(0, 3).map(lv => lv.venue?.coverImageUrl).filter(Boolean) || [];

  return (
    <div onClick={onClick}
      className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden card-hover cursor-pointer group">
      {/* Image collage */}
      <div className="relative h-40 bg-surface-container-high overflow-hidden">
        {venueImages.length > 0 ? (
          <div className="grid grid-cols-3 h-full gap-px">
            {venueImages.slice(0, 3).map((img, i) => (
              <div key={i} className={`overflow-hidden ${venueImages.length === 1 ? 'col-span-3' : i === 0 && venueImages.length === 2 ? 'col-span-2' : ''}`}>
                <img src={img!} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '48px' }}>photo_library</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-on-surface tracking-tight">{list.name}</h3>
        {list.description && (
          <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{list.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant">
            {venueCount} Venue{venueCount !== 1 ? 's' : ''}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>
            {list.isPublic ? 'language' : 'lock'}
          </span>
        </div>
      </div>
    </div>
  );
}
