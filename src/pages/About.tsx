import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { ScrollCarousel } from '../components/ScrollCarousel';
import { MemberCta } from '../components/MemberCta';
import { Reveal, RevealGroup, revealItem } from '../components/Reveal';
import { board, missions } from '../data/federation';
import { images } from '../data/site';

const initials = (name: string) =>
name.split(' ').filter((w) => w.length > 2).slice(-2).map((w) => w[0]).join('');

// Carte d'un membre du bureau : photo arrondie, nom et fonction posés sur un dégradé
function BoardCard({ name, role, image }: {name: string;role: string;image?: string;}) {
  const [failed, setFailed] = useState(false);
  const hasPhoto = Boolean(image) && !failed;

  return (
    <article className="group relative w-[72%] shrink-0 snap-start overflow-hidden rounded-3xl bg-fecam-sand sm:w-64 lg:w-[17.5rem]">
      <div className="aspect-[3/4] w-full">
        {hasPhoto ?
        <img src={image} alt={name} onError={() => setFailed(true)} className="img-zoom h-full w-full object-cover" /> :

        <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
            <span className="font-poster text-8xl text-fecam-black/15">{initials(name)}</span>
          </div>
        }
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 p-5 ${
        hasPhoto ? 'bg-gradient-to-t from-fecam-black/85 via-fecam-black/40 to-transparent pt-16 text-fecam-paper' : 'text-fecam-black'}`
        }>
        
        <h3 className="font-display text-lg font-bold leading-tight">{name}</h3>
        <p className={`mt-1 text-sm leading-snug ${hasPhoto ? 'text-fecam-paper/75' : 'text-fecam-black/60'}`}>{role}</p>
      </div>
    </article>);

}

export function About() {
  return (
    <>
      <PageHeader
        kicker="Depuis 2014"
        title="La fédération"
        description="La FECAM est l’organisation qui représente et accompagne les acteurs de la musique en République centrafricaine." />


      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
        <Reveal>
          <p className="font-serif text-lg italic text-fecam-clay">Qui sommes-nous</p>
          <h2 className="mt-1 font-poster text-5xl uppercase leading-[0.95] lg:text-6xl">
            Une voix commune
            <br />
            <span className="text-fecam-blue">pour les musiciens</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-fecam-black/75">
            Fondée à Bangui en 2014, la Fédération Centrafricaine de Musique regroupe aujourd’hui des artistes, des groupes, des
            associations culturelles et des structures professionnelles de toutes les régions du pays.
          </p>
          <p className="mt-4 leading-relaxed text-fecam-black/60">
            Elle dialogue avec les pouvoirs publics, organise des événements, forme les jeunes talents et veille au respect des droits
            des créateurs. Depuis 2026, elle dispose de sa propre radio pour diffuser la musique d’ici.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="group overflow-hidden rounded-3xl">
          <img src={images.traditional} alt="Musiciens traditionnels jouant du balafon" className="img-zoom aspect-[4/3] w-full object-cover" />
        </Reveal>
      </section>

      {/* Missions */}
      <section className="border-y border-fecam-black/10 bg-fecam-sand/60">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <Reveal>
            <p className="font-serif text-lg italic text-fecam-clay">Ce que nous faisons</p>
            <h2 className="mt-1 font-poster text-5xl uppercase leading-[0.95] lg:text-6xl">Nos missions</h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            {missions.map((m, i) =>
            <motion.div key={m.title} variants={revealItem} className="border-t border-fecam-black/10 py-6">
                <span className="font-poster text-4xl text-fecam-orange">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-2xl font-bold">{m.title}</h3>
                <p className="mt-2 leading-relaxed text-fecam-black/60">{m.text}</p>
              </motion.div>
            )}
          </RevealGroup>
        </div>
      </section>

      {/* Bureau */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <p className="font-serif text-lg italic text-fecam-clay">Ils la dirigent</p>
          <h2 className="mt-1 font-poster text-5xl uppercase leading-[0.95] lg:text-6xl">Le bureau exécutif</h2>
        </Reveal>
        <Reveal className="mt-12">
          <ScrollCarousel label="Membres du bureau exécutif" autoplayMs={3500}>
            {board.map((b) =>
            <BoardCard key={b.name} {...b} />
            )}
          </ScrollCarousel>
        </Reveal>
      </section>

      <MemberCta />
    </>);

}
