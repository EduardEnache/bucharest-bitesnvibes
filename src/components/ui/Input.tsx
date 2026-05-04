'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-on-surface-variant mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              error && 'border-error focus:border-error focus:ring-error/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
