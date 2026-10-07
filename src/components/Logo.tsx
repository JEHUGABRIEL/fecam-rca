interface LogoProps {
  className?: string;
  // 'light' sur fond papier, 'dark' sur fond encre
  tone?: 'light' | 'dark';
  // Masque le bloc « Fédération centrafricaine de musique »
  compact?: boolean;
}

// Logo retouché : on garde l'idée de l'original (le M dont la jambe droite devient une note),
// redessinée en capitales d'affiche ; la clé de sol et le micro sont retirés pour la lisibilité.
export function Logo({ className = '', tone = 'light', compact = false }: LogoProps) {
  const ink = tone === 'light' ? 'text-fecam-blue' : 'text-fecam-paper';

  return (
    <span className={`inline-flex items-center gap-[0.6em] leading-none ${className}`} role="img" aria-label="FECAM — Fédération Centrafricaine de Musique">
      <svg viewBox="0 0 272 92" className={`h-[2.3em] w-auto overflow-visible ${ink}`} aria-hidden="true">
        <text x="0" y="88" fontFamily="Anton, Impact, sans-serif" fontSize="100" textLength="188" lengthAdjust="spacing" fill="currentColor">
          FECA
        </text>
        <g transform="translate(196 0) scale(1.1)">
          {/* Jambe gauche + diagonale descendante du M */}
          <path d="M0 80 V0 H19 L35 44 V66 L16 22 V80 Z" fill="currentColor" />
          {/* Diagonale montante + hampe : la note orange */}
          <path d="M35 44 L50 0 H67 V68 H51 V24 L35 66 Z" className="fill-fecam-orange" />
          <ellipse cx="50" cy="71" rx="17" ry="11.5" transform="rotate(-22 50 71)" className="fill-fecam-orange" />
        </g>
      </svg>
      {!compact &&
      <span
        className={`flex flex-col gap-[0.25em] border-l-2 border-fecam-orange pl-[0.6em] text-[0.56em] font-bold uppercase leading-none tracking-[0.16em] ${
        tone === 'light' ? 'text-fecam-black' : 'text-fecam-paper/85'}`
        }
        aria-hidden="true">
          <span>Fédération</span>
          <span>centrafricaine</span>
          <span className="text-fecam-orange">de musique</span>
        </span>
      }
    </span>);

}
