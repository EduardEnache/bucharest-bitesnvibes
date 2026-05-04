'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/directory', icon: 'menu_book', label: 'Directory' },
  { href: '/map', icon: 'map', label: 'Map' },
  { href: '/dashboard', icon: 'dashboard', label: 'Home' },
  { href: '/lists', icon: 'bookmark', label: 'Lists' },
  { href: '/activity', icon: 'schedule', label: 'Activity' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors',
                isActive ? 'text-primary' : 'text-on-surface-variant'
              )}
            >
              <span
                className={cn('material-symbols-outlined', isActive && 'filled')}
                style={{ fontSize: '24px' }}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
