'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'to-try' | 'visited' | 'favorite' | 'not-going' | 'outline' | 'success';
  size?: 'sm' | 'md';
  className?: string;
  icon?: string;
  onRemove?: () => void;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  icon,
  onRemove,
}: BadgeProps) {
  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant border border-outline-variant',
    'to-try': 'bg-amber-accent text-black',
    visited: 'bg-primary text-on-primary',
    favorite: 'bg-tertiary text-black',
    'not-going': 'bg-outline text-on-surface',
    outline: 'bg-transparent text-on-surface-variant border border-outline-variant',
    success: 'bg-tertiary/10 text-tertiary border border-tertiary/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
          {icon}
        </span>
      )}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:text-on-surface transition-colors"
          aria-label="Remove"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            close
          </span>
        </button>
      )}
    </span>
  );
}
