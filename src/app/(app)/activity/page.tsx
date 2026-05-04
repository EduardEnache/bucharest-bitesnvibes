'use client';

import { useEffect, useState } from 'react';
import type { Activity } from '@/types';
import ActivityItem from '@/components/activity/ActivityItem';
import Button from '@/components/ui/Button';

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/activity?page=${page}&limit=10`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setActivities(prev => page === 1 ? data.data : [...prev, ...data.data]);
          setTotal(data.total || 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-on-surface tracking-tight">Activity Feed</h1>
        <p className="text-sm text-on-surface-variant mt-1">A timeline of your venue tracking actions and notes.</p>
      </div>
      {loading && activities.length === 0 ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-outline text-5xl mb-3 block">history</span>
          <p className="text-on-surface-variant">No activity yet</p>
        </div>
      ) : (
        <div className="relative">
          {activities.map(a => <ActivityItem key={a.id} activity={a} />)}
        </div>
      )}
      {activities.length < total && (
        <div className="flex justify-center mt-8">
          <Button variant="secondary" icon="expand_more" onClick={() => setPage(p => p + 1)}>Load More Activity</Button>
        </div>
      )}
    </div>
  );
}
