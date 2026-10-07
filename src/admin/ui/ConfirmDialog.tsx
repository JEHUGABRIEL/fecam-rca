import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangleIcon, LogOutIcon } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: 'danger' | 'neutral';
  icon?: 'warning' | 'logout';
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

// Confirmation en modale, utilisable partout dans le back-office :
//   const confirm = useConfirm();  if (await confirm({ title, message })) { … }
export function ConfirmProvider({ children }: {children: React.ReactNode;}) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(ok: boolean) => void>();

  const confirm = useCallback<Confirm>((opts) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = (ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = undefined;
    setOptions(null);
  };

  const danger = (options?.tone ?? 'danger') === 'danger';
  const Icon = options?.icon === 'logout' ? LogOutIcon : AlertTriangleIcon;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={Boolean(options)}
        onClose={() => settle(false)}
        title={options?.title ?? ''}
        size="sm"
        footer={
        <>
            <button type="button" onClick={() => settle(false)} className="btn-ghost !py-2.5" data-autofocus>
              Annuler
            </button>
            <button
            type="button"
            onClick={() => settle(true)}
            className={`btn !py-2.5 ${danger ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-fecam-black text-fecam-paper hover:bg-fecam-orange'}`}>
            
              {options?.confirmLabel ?? 'Confirmer'}
            </button>
          </>
        }>
        
        <div className="flex gap-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-red-50 text-red-700' : 'bg-fecam-sand text-fecam-black'}`}>
            <Icon className="h-5 w-5" />
          </span>
          <p className="pt-2 text-sm leading-relaxed text-fecam-black/70">{options?.message}</p>
        </div>
      </Modal>
    </ConfirmContext.Provider>);

}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm doit être utilisé dans ConfirmProvider');
  return ctx;
}
