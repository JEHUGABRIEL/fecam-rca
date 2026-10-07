import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  // Empêche la fermeture (pendant un enregistrement)
  busy?: boolean;
}

const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

// Fenêtre modale accessible : Échap et clic hors du cadre ferment, le focus reste dans la
// fenêtre (Tab boucle) et revient sur l'élément d'origine à la fermeture.
export function Modal({ open, onClose, title, description, children, footer, size = 'md', busy = false }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    // Focus sur le premier champ, sinon sur la fenêtre
    window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>('input:not([type=hidden]), select, textarea, button[data-autofocus]');
      (first ?? panelRef.current)?.focus();
    }, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, onClose, busy]);

  return createPortal(
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
          className="absolute inset-0 bg-fecam-black/45 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => !busy && onClose()} />
        
          <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          className={`relative flex max-h-[92vh] w-full ${widths[size]} flex-col rounded-t-3xl bg-fecam-paper shadow-[0_40px_80px_-30px_rgba(26,22,18,0.55)] focus:outline-none sm:rounded-3xl`}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          
            <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-6">
              <div>
                <h2 id={titleId} className="font-display text-xl font-bold">{title}</h2>
                {description && <p id={descId} className="mt-1 text-sm text-fecam-black/60">{description}</p>}
              </div>
              <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Fermer"
              className="rounded-full p-2 text-fecam-black/60 transition-colors hover:bg-fecam-black/5 hover:text-fecam-black disabled:opacity-40">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4">{children}</div>
            {footer && <div className="flex flex-wrap items-center justify-end gap-3 border-t border-fecam-black/10 px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      }
    </AnimatePresence>,
    document.body
  );
}
