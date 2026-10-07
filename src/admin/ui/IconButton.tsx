import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: 'neutral' | 'danger';
  children: React.ReactNode;
}

// Bouton icône avec info-bulle (le libellé sert aussi aux lecteurs d'écran)
export function IconButton({ label, tone = 'neutral', children, className = '', ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`group/tip relative flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
      tone === 'danger' ? 'text-red-700 hover:bg-red-50' : 'text-fecam-black/70 hover:bg-fecam-black/5 hover:text-fecam-black'} ${
      className}`}
      {...props}>
      
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-fecam-black px-2 py-1 text-[11px] font-medium text-fecam-paper opacity-0 transition-[opacity,transform] duration-200 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-visible/tip:translate-y-0 group-focus-visible/tip:opacity-100">
        
        {label}
      </span>
    </button>);

}
