'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { useState } from 'react';

const navItems = [
  { href: '/directory', icon: 'menu_book', label: 'Directory' },
  { href: '/map', icon: 'map', label: 'Global Map' },
  { href: '/lists', icon: 'bookmark', label: 'My Lists' },
  { href: '/activity', icon: 'schedule', label: 'Activity' },
  { href: '/settings', icon: 'settings', label: 'Settings' },
];

interface SidebarProps {
  onAddVenue: () => void;
}

export default function Sidebar({ onAddVenue }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen bg-surface border-r border-outline-variant fixed left-0 top-0 z-40 transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn('px-4 pt-5 pb-2', collapsed && 'px-2')}>
        <Link href="/dashboard" className="block">
          {collapsed ? (
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                restaurant
              </span>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-black text-primary tracking-tight">București Bites</h1>
              <p className="text-xs text-on-surface-variant mt-0.5">Venue Management</p>
            </>
          )}
        </Link>
      </div>

      {/* Add Venue Button */}
      <div className={cn('px-3 py-3', collapsed && 'px-2')}>
        {collapsed ? (
          <button
            onClick={onAddVenue}
            className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center hover:bg-primary-container/90 transition-colors mx-auto"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          </button>
        ) : (
          <Button onClick={onAddVenue} variant="primary" fullWidth icon="add">
            Add New Venue
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative',
                isActive
                  ? 'text-primary bg-primary/5'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high',
                collapsed && 'justify-center px-0'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-outline-variant px-2 py-2 space-y-0.5">
        <button
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high w-full transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>help_outline</span>
          {!collapsed && <span>Help</span>}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/auth' })}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high w-full transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* User Info */}
      {session?.user && (
        <div className={cn('border-t border-outline-variant px-3 py-3', collapsed && 'px-2')}>
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-8 h-8 rounded-full shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">
                  {session.user.name?.[0] || session.user.email?.[0] || '?'}
                </span>
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">
                  {session.user.name || 'User'}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {session.user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center hover:bg-surface-container-highest transition-colors z-50"
      >
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '14px' }}>
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>
    </aside>
  );
}
