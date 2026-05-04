'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import VenueModal from '@/components/venue/VenueModal';
import { createVenue } from '@/hooks/useVenues';
import type { VenueCreateInput, VenueUpdateInput } from '@/types';

function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [venueModalOpen, setVenueModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) return null;

  async function handleSaveVenue(data: VenueCreateInput | VenueUpdateInput) {
    await createVenue(data as VenueCreateInput);
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onAddVenue={() => setVenueModalOpen(true)} />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav />
      <VenueModal
        isOpen={venueModalOpen}
        onClose={() => setVenueModalOpen(false)}
        onSave={handleSaveVenue}
      />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  );
}
