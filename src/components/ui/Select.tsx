'use client';

import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-on-surface-variant mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface appearance-none cursor-pointer transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='%23a1a1aa'%3E%3Cpath d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 12px center',
            backgroundRepeat: 'no-repeat',
            paddingRight: '40px',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-on-surface-variant">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-container">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
