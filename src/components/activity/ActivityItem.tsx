'use client';

import type { Activity } from '@/types';
import { formatRelativeTime, activityIcon } from '@/lib/utils';

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-5 top-10 bottom-0 w-px bg-outline-variant last:hidden" />

      {/* Icon */}
      <div className="relative z-10 w-10 h-10 rounded-full border-2 border-primary/30 bg-surface flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>
          {activityIcon(activity.type)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 bg-surface-container border border-outline-variant rounded-xl p-4 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-on-surface">
            <span dangerouslySetInnerHTML={{
              __html: activity.description.replace(
                /(".*?"|'.*?')/g,
                '<strong class="text-on-surface font-semibold">$1</strong>'
              )
            }} />
          </p>
          <span className="text-xs text-on-surface-variant whitespace-nowrap flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>

        {/* Metadata preview */}
        {activity.metadata && typeof activity.metadata === 'object' && (
          <div className="mt-2">
            {activity.type === 'VENUE_RATED' && 'rating' in activity.metadata && (
              <div className="flex items-center gap-1 text-amber-accent">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`material-symbols-outlined ${i < (activity.metadata as { rating: number }).rating ? 'filled' : ''}`}
                    style={{ fontSize: '16px' }}>star</span>
                ))}
                <span className="text-sm font-medium ml-1">{(activity.metadata as { rating: number }).rating}.0</span>
              </div>
            )}
            {activity.type === 'VENUE_UPDATED' && 'field' in activity.metadata && (
              <div className="mt-1 bg-surface-container-high rounded-lg p-2.5 text-xs text-on-surface-variant font-mono">
                + Updated {(activity.metadata as { field: string }).field}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
