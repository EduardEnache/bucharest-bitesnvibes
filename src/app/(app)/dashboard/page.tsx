'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Venue, Activity } from '@/types';
import VenueCard from '@/components/venue/VenueCard';
import GlobalMap from '@/components/map/GlobalMap';
import ActivityItem from '@/components/activity/ActivityItem';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/venues?limit=50').then(r => r.json()),
      fetch('/api/activity?limit=5').then(r => r.json()),
    ]).then(([venuesRes, activityRes]) => {
      if (venuesRes.success) setVenues(venuesRes.data);
      if (activityRes.success) setActivities(activityRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const topRated = [...venues]
    .sort((a, b) => (b.personalRating || 0) - (a.personalRating || 0) || (b.googleRating || 0) - (a.googleRating || 0))
    .slice(0, 10);

  const recentlyAdded = [...venues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container p-6 md:p-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container via-surface-container to-transparent z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <div className="w-full h-full bg-gradient-to-l from-primary/10 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight leading-tight">
            Discover the Heart of Bucharest.
          </h1>
          <p className="text-base text-on-surface-variant mt-3 leading-relaxed max-w-lg">
            Manage your curated list of the city&apos;s finest venues, from hidden gems to renowned hotspots.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Button variant="primary" icon="add">Add New Venue</Button>
            <Link href="/directory">
              <Button variant="secondary">View Directory</Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid: Map + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 rounded-2xl border border-outline-variant overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-container border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>map</span>
              <h2 className="text-base font-bold text-on-surface">Global Map</h2>
            </div>
            <Link href="/map" className="text-sm text-primary hover:underline">Full Screen</Link>
          </div>
          <GlobalMap venues={venues} height="350px" interactive={false} />
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>schedule</span>
              <h2 className="text-base font-bold text-on-surface">Recent Activity</h2>
            </div>
            <Link href="/activity" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="p-4 space-y-0">
            {activities.length > 0 ? (
              activities.map(a => (
                <div key={a.id} className="flex items-start gap-3 py-3 border-b border-outline-variant/50 last:border-b-0">
                  <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>
                      {a.type === 'VENUE_UPDATED' ? 'edit' : a.type === 'VENUE_RATED' ? 'star' : 'bookmark'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-on-surface font-medium truncate">{a.description}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant py-8 text-center">No activity yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Rated Venues */}
      {topRated.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-on-surface tracking-tight">Top Rated Venues</h2>
            <Link href="/directory?sortBy=rating" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-scroll-x pb-2">
            {topRated.map(venue => (
              <div key={venue.id} className="min-w-[280px] max-w-[320px] shrink-0">
                <VenueCard venue={venue} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-on-surface tracking-tight">Recently Added</h2>
            <Link href="/directory?sortBy=newest" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyAdded.map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-64 rounded-xl" />)}
        </div>
      )}
    </div>
  );
}
