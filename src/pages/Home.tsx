import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { EventRow } from '../components/EventRow';
import { HighlightsCarousel } from '../components/HighlightsCarousel';
import { HomeHero } from '../components/HomeHero';
import { Marquee } from '../components/Marquee';
import { MemberCta } from '../components/MemberCta';
import { PresidentMessage } from '../components/PresidentMessage';
import { ReleaseCard } from '../components/ReleaseCard';
import { Reveal, RevealGroup, revealItem } from '../components/Reveal';
import { ScrollCarousel } from '../components/ScrollCarousel';
import { SectionHeading } from '../components/SectionHeading';
import { missions, partners } from '../data/federation';
import { useArtists, useEvents, useNews, useRadioShows, useReleases } from '../hooks/data';
import { useNow } from '../hooks/useNow';
import { formatShortDate, isPastDate } from '../utils/date';
import { formatShowTime, getShowsForDay, isShowLive } from '../utils/radio';

export function Home() {
  const now = useNow();
  const { data: events } = useEvents();
  const { data: news } = useNews();
  const { data: artists } = useArtists();
  const { data: radioShows } = useRadioShows();
  const { data: releases } = useReleases();
  const latestReleases = [...releases].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 10);
  const todayShows = getShowsForDay(radioShows, now.getDay());
  const upcoming = events.filter((e) => !isPastDate(e.endDate ?? e.date)).sort((a, b) => a.date.localeCompare(b.date));
  // Temps forts : les grands rendez-vous à venir ; à défaut, les prochains événements
  const majors = upcoming.filter((e) => ['Festival', 'Concours', 'Concert'].includes(e.category));
  const highlights = (majors.length > 0 ? majors : upcoming).slice(0, 5);
  const agenda = upcoming.slice(0, 4);
  const liveIndex = Math.max(todayShows.findIndex((show) => isShowLive(show, now)), 0);
  // À la une : choisis dans l'admin ; à défaut, les premiers artistes avec photo
  const withPhoto = artists.filter((a) => a.image);
  const featured = withPhoto.filter((a) => a.featured);
  const featuredArtists = (featured.length > 0 ? featured : withPhoto).slice(0, 4);
  const [leadNews, ...otherNews] = news;

  return (
    <>
      <HomeHero />

      {/* Prochains temps forts */}
      {highlights.length > 0 &&
      <Reveal as="section" className="mx-auto max-w-7xl px-5 pt-20 lg:px-8 lg:pt-28">
          <HighlightsCarousel events={highlights} />
        </Reveal>
      }

      {/* Agenda */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <SectionHeading kicker="Ce qui se joue bientôt" title="À l’agenda" linkTo="/evenements" linkLabel="Tous les événements" />
        <RevealGroup className="mt-12 border-t border-fecam-black/10">
          {agenda.map((event) =>
          <motion.div key={event.id} variants={revealItem}>
              <EventRow event={event} />
            </motion.div>
          )}
        </RevealGroup>
      </section>

      {/* Dernières sorties */}
      {latestReleases.length > 0 &&
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
          <SectionHeading kicker="Fraîchement sorties" title="Dernières sorties" description="Les nouveaux titres des artistes de la fédération, à écouter sur YouTube ou Spotify." />
          <Reveal className="mt-12">
            <ScrollCarousel label="Dernières sorties musicales">
              {latestReleases.map((release) =>
            <ReleaseCard key={release.id} release={release} />
            )}
            </ScrollCarousel>
          </Reveal>
        </section>
      }

      {/* Radio : la journée à l'antenne */}
      <section className="border-y border-fecam-black/10 bg-fecam-sand/60">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <SectionHeading kicker="Aujourd’hui sur" title="Radio FECAM" linkTo="/radio" linkLabel="Grille complète" />
          <Reveal className="mt-12">
            <ScrollCarousel label="Programmes du jour sur Radio FECAM" startIndex={liveIndex} autoplayMs={4000}>
              {todayShows.map((show) => {
                const live = isShowLive(show, now);
                return (
                  <article
                    key={show.id}
                    className={`w-[72%] shrink-0 snap-start rounded-2xl p-6 transition-colors duration-300 sm:w-64 ${
                    live ? 'bg-fecam-black text-fecam-paper' : 'bg-fecam-paper hover:bg-white'}`
                    }>
                    
                    <p className="flex items-center justify-between">
                      <span className="font-poster text-3xl">{formatShowTime(show.start)}</span>
                      {live &&
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-fecam-orange">
                          <span className="h-1.5 w-1.5 rounded-full bg-fecam-orange" /> En direct
                        </span>
                      }
                    </p>
                    <p className="mt-8 font-display text-lg font-bold leading-tight">{show.title}</p>
                    <p className={`mt-1 text-sm ${live ? 'text-fecam-paper/60' : 'text-fecam-black/55'}`}>{show.host}</p>
                    <p className={`mt-4 line-clamp-2 text-sm ${live ? 'text-fecam-paper/70' : 'text-fecam-black/60'}`}>{show.description}</p>
                  </article>);

              })}
            </ScrollCarousel>
          </Reveal>
        </div>
      </section>

      {/* Missions */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="font-serif text-lg italic text-fecam-clay">Depuis 2014</p>
            <h2 className="mt-1 font-poster text-5xl uppercase leading-[0.95] lg:text-6xl">
              Une fédération
              <br />
              au service
              <br />
              <span className="text-fecam-blue">des musiciens</span>
            </h2>
            <p className="mt-6 max-w-sm text-lg text-fecam-black/65">
              Artistes, groupes, associations et techniciens : la FECAM défend celles et ceux qui font la musique du pays.
            </p>
            <Link to="/a-propos" className="link-draw mt-8">
              Découvrir la fédération <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
          <RevealGroup as="ol">
            {missions.map((m, i) =>
            <motion.li
              key={m.title}
              variants={revealItem}
              className="grid grid-cols-[4rem_1fr] gap-6 border-t border-fecam-black/10 py-8 last:border-b lg:grid-cols-[5rem_1fr]">

                <span className="font-poster text-4xl text-fecam-orange lg:text-5xl">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold">{m.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-fecam-black/65">{m.text}</p>
                </div>
              </motion.li>
            )}
          </RevealGroup>
        </div>
      </section>

      {/* Artistes à la une */}
      {featuredArtists.length > 0 &&
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
          <SectionHeading kicker="Ils portent nos couleurs" title="Artistes à la une" linkTo="/adhesion" linkLabel="Vous êtes artiste ?" />
          <RevealGroup className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {featuredArtists.map((artist) =>
          <motion.article key={artist.id} variants={revealItem} className="group">
                <div className="overflow-hidden rounded-2xl bg-fecam-sand">
                  <img src={artist.image} alt={artist.name} className="img-zoom aspect-[4/5] w-full object-cover" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-fecam-clay">{artist.genre}</p>
                <h3 className="mt-1 font-display text-xl font-bold">{artist.name}</h3>
                <p className="mt-1 text-sm text-fecam-black/55">{artist.city}</p>
              </motion.article>
          )}
          </RevealGroup>
        </section>
      }

      <PresidentMessage />

      {/* Actualités */}
      {leadNews &&
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <SectionHeading kicker="La scène bouge" title="Actualités" linkTo="/actualites" linkLabel="Toutes les actualités" />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <Link to="/actualites" className="group block">
                <div className="overflow-hidden rounded-2xl">
                  <img src={leadNews.image} alt="" className="img-zoom aspect-[16/10] w-full object-cover" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-fecam-clay">
                  {leadNews.category} · {formatShortDate(leadNews.date)}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold leading-tight transition-colors duration-300 group-hover:text-fecam-clay lg:text-4xl">
                  {leadNews.title}
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-fecam-black/65">{leadNews.excerpt}</p>
              </Link>
            </Reveal>
            <RevealGroup as="ul" className="border-t border-fecam-black/10">
              {otherNews.slice(0, 3).map((item) =>
            <motion.li key={item.id} variants={revealItem} className="border-b border-fecam-black/10">
                  <Link to="/actualites" className="group grid grid-cols-[6.5rem_1fr] items-center gap-5 py-5">
                    <div className="overflow-hidden rounded-xl">
                      <img src={item.image} alt="" className="img-zoom aspect-square w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fecam-clay">
                        {item.category} · {formatShortDate(item.date)}
                      </p>
                      <h3 className="mt-1.5 font-display text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-fecam-clay">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </motion.li>
            )}
            </RevealGroup>
          </div>
        </section>
      }

      {/* Partenaires */}
      <section className="border-t border-fecam-black/10 py-14" aria-label="Partenaires">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-fecam-black/45">Avec le soutien de</p>
        <Marquee items={partners} />
      </section>

      <MemberCta />
    </>);

}
