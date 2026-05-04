'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, icon, children, ...props }, ref) => {
    const variants = {
      primary:
        'bg-primary-container text-white hover:bg-primary-container/90 active:bg-primary-container/80',
      secondary:
        'bg-transparent text-on-surface border border-outline-variant hover:bg-surface-container-high active:bg-surface-container-highest',
      ghost:
        'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high',
      danger:
        'bg-error/10 text-error border border-error/20 hover:bg-error/20 active:bg-error/30',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-150 focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="material-symbols-outlined" style={{ fontSize: size === 'sm' ? '18px' : '20px' }}>
            {icon}
          </span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
