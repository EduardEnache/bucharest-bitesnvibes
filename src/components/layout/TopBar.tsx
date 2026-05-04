'use client';

import { useSession } from 'next-auth/react';

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Left: Title (mobile logo) */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <h1 className="text-base font-bold text-primary tracking-tight">București Bites</h1>
          </div>
          {title && (
            <h2 className="hidden md:block text-base font-bold text-on-surface tracking-tight">
              {title}
            </h2>
          )}
        </div>

        {/* Right: User avatar */}
        <div className="flex items-center gap-3">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {session?.user?.name?.[0] || '?'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
