import { AudioLinesIcon, PlayIcon, YoutubeIcon } from 'lucide-react';
import { Release } from '../types/content';
import { formatShortDate } from '../utils/date';

// Carte d'une sortie : pochette, titre, artiste, liens d'écoute
export function ReleaseCard({ release }: {release: Release;}) {
  const listen = release.youtubeUrl ?? release.spotifyUrl ?? undefined;

  return (
    <article className="group w-[70%] shrink-0 snap-start sm:w-60 lg:w-[17rem]">
      <a
        href={listen}
        target="_blank"
        rel="noreferrer"
        className="relative block overflow-hidden rounded-2xl bg-fecam-sand"
        aria-label={`Écouter ${release.title} de ${release.artist} (nouvel onglet)`}>
        
        {release.cover ?
        <img src={release.cover} alt="" className="img-zoom aspect-square w-full object-cover" /> :

        <div className="flex aspect-square w-full items-center justify-center font-poster text-6xl text-fecam-black/20">♪</div>
        }
        {/* Bouton lecture qui apparaît au survol */}
        <span className="absolute inset-0 flex items-center justify-center bg-fecam-black/0 transition-colors duration-500 group-hover:bg-fecam-black/35">
          <span className="flex h-14 w-14 translate-y-3 items-center justify-center rounded-full bg-fecam-orange text-white opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
            <PlayIcon className="h-6 w-6 translate-x-0.5" fill="currentColor" />
          </span>
        </span>
      </a>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-fecam-clay">{formatShortDate(release.releaseDate)}</p>
      <h3 className="mt-1 truncate font-display text-lg font-bold">{release.title}</h3>
      <p className="truncate text-sm text-fecam-black/60">{release.artist}</p>
      <div className="mt-3 flex gap-2">
        {release.youtubeUrl &&
        <a
          href={release.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-fecam-black/[0.12] px-3 py-1.5 text-xs font-medium transition-colors duration-300 hover:border-fecam-black hover:bg-fecam-black hover:text-fecam-paper">
          
            <YoutubeIcon className="h-3.5 w-3.5" /> YouTube
          </a>
        }
        {release.spotifyUrl &&
        <a
          href={release.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-fecam-black/[0.12] px-3 py-1.5 text-xs font-medium transition-colors duration-300 hover:border-fecam-black hover:bg-fecam-black hover:text-fecam-paper">
          
            <AudioLinesIcon className="h-3.5 w-3.5" /> Spotify
          </a>
        }
      </div>
    </article>);

}
