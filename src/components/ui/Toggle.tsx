'use client';

import { cn } from '@/lib/utils';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function Toggle({ enabled, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="text-sm font-medium text-on-surface">{label}</p>}
          {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
        </div>
      )}
      <button
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
          enabled ? 'bg-primary-container' : 'bg-outline-variant'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-on-surface shadow-sm transition-transform duration-200',
            enabled ? 'translate-x-5.5' : 'translate-x-0.5',
            'mt-0.5'
          )}
        />
      </button>
    </div>
  );
}
