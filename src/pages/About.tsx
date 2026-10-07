import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { MemberCta } from '../components/MemberCta';
import { Reveal, RevealGroup, revealItem } from '../components/Reveal';
import { board, missions } from '../data/federation';
import { images } from '../data/site';

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
        <RevealGroup as="ul" className="mt-12 grid border-t border-fecam-black/10 sm:grid-cols-2 sm:gap-x-12">
          {board.map((b) =>
          <motion.li key={b.name} variants={revealItem} className="flex items-center gap-5 border-b border-fecam-black/10 py-6">
              <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fecam-sand font-display text-lg font-bold text-fecam-black"
              aria-hidden="true">

                {b.name.split(' ').filter((w) => w.length > 2).slice(-2).map((w) => w[0]).join('')}
              </span>
              <div>
                <p className="font-display text-lg font-bold">{b.name}</p>
                <p className="text-sm text-fecam-black/55">{b.role}</p>
              </div>
            </motion.li>
          )}
        </RevealGroup>
      </section>

      <MemberCta />
    </>);

}
