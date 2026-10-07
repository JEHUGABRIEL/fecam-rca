import { RotateCwIcon } from 'lucide-react';

// Message affiché quand le contenu n'a pas pu être chargé (API injoignable)
export function LoadError({ onRetry, what = 'le contenu' }: {onRetry: () => void;what?: string;}) {
  return (
    <div className="py-20 text-center" role="alert">
      <p className="font-display text-xl font-bold">Impossible de charger {what}</p>
      <p className="mt-1 text-fecam-black/60">Vérifiez votre connexion, puis réessayez.</p>
      <button type="button" onClick={onRetry} className="btn-ghost mt-6">
        <RotateCwIcon className="h-4 w-4" /> Réessayer
      </button>
    </div>);

}
