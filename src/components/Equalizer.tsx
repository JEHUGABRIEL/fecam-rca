interface EqualizerProps {
  active: boolean;
  className?: string;
}

const delays = ['0s', '0.3s', '0.15s', '0.45s', '0.2s'];

// Barres d'égaliseur : animées quand la radio joue, figées sinon.
export function Equalizer({ active, className = 'h-4' }: EqualizerProps) {
  return (
    <span className={`inline-flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {delays.map((delay, i) =>
      <span
        key={i}
        className={`h-full w-[3px] origin-bottom bg-current ${active ? 'animate-equalizer motion-reduce:animate-none' : ''}`}
        style={{ animationDelay: delay, transform: active ? undefined : `scaleY(${[0.4, 0.7, 0.5, 0.9, 0.3][i]})` }} />

      )}
    </span>);

}
