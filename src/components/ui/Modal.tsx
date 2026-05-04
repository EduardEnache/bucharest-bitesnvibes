'use client';

import { cn } from '@/lib/utils';
import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  fullScreenMobile?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  fullScreenMobile = true,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed z-50 bg-surface border border-outline-variant overflow-hidden',
              fullScreenMobile
                ? 'inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:max-h-[90vh]'
                : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl max-h-[90vh]',
              `w-full ${maxWidth}`
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
                <h2 className="text-lg font-bold text-on-surface tracking-tight">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus-ring"
                  aria-label="Close modal"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
