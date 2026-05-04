'use client';

import { useEffect, useState } from 'react';
import type { List } from '@/types';
import ListCard from '@/components/lists/ListCard';
import CreateListModal from '@/components/lists/CreateListModal';
import Button from '@/components/ui/Button';

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetch('/api/lists')
      .then(r => r.json())
      .then(data => { if (data.success) setLists(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleCreateList(data: { name: string; description: string; isPublic: boolean }) {
    const res = await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      setLists(prev => [result.data, ...prev]);
    }
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">My Lists</h1>
          <p className="text-sm text-on-surface-variant mt-1">Curated collections of your favorite spots across the city.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon="tune" size="sm">Filter</Button>
          <Button variant="secondary" icon="sort" size="sm">Sort</Button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-64 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map(list => (
            <ListCard key={list.id} list={list} />
          ))}

          {/* Create New List Card */}
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-surface-container border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center min-h-[280px] hover:border-primary/50 hover:bg-surface-container-high transition-colors group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-outline-variant flex items-center justify-center mb-4 group-hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" style={{ fontSize: '28px' }}>
                add
              </span>
            </div>
            <h3 className="text-base font-bold text-on-surface">Create New List</h3>
            <p className="text-sm text-on-surface-variant mt-1">Organize a new collection of your favorite local spots.</p>
          </button>
        </div>
      )}

      <CreateListModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreateList} />
    </div>
  );
}
