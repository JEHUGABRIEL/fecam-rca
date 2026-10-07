import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2Icon, RadioIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { FormField } from '../components/FormField';
import { FormStatus } from '../components/FormStatus';
import { Equalizer } from '../components/Equalizer';
import { easeOut, MaskedLines, Reveal } from '../components/Reveal';
import { RadioPlayButton } from '../components/RadioPlayButton';
import { useRadio } from '../contexts/RadioContext';
import { radioDays } from '../data/radioSchedule';
import { images, site } from '../data/site';
import { useRadioShows } from '../hooks/data';
import { useSubmit } from '../hooks/useSubmit';
import { Honeypot } from '../components/Honeypot';
import { MemberCta } from '../components/MemberCta';
import { useNow } from '../hooks/useNow';
import { formatShowTime, getCurrentShow, getNextShow, getShowsForDay, isShowLive } from '../utils/radio';

export function Radio() {
  const { status, volume, muted, setVolume, toggleMute } = useRadio();
  const { data: radioShows } = useRadioShows();
  const now = useNow();
  const [day, setDay] = useState(now.getDay());
  const current = getCurrentShow(radioShows, now);
  const next = getNextShow(radioShows, now);
  const dayShows = getShowsForDay(radioShows, day);
  const { state, message, submit, reset } = useSubmit('dedications');

  const handleDedication = (e: React.FormEvent<HTMLFormElement>) => {
    const f = new FormData(e.currentTarget);
    submit(e, { name: f.get('dedicace-nom'), city: f.get('dedicace-ville'), song: f.get('dedicace-titre'), message: f.get('dedicace-message') });
  };

  const statusLabel =
  status === 'playing' ? 'Vous écoutez le direct' : status === 'loading' ? 'Connexion au direct…' : status === 'error' ? 'Flux momentanément indisponible' : 'Appuyez pour écouter';

  return (
    <>
      <section className="grain bg-fecam-black text-fecam-paper">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-24">
          <div>
            <p className="flex items-center gap-3 font-serif text-xl italic text-fecam-orange">
              <Equalizer active={status === 'playing'} className="h-4" /> En direct · {site.radioFrequency}
            </p>
            <h1 className="mt-4 font-poster text-6xl uppercase leading-[0.95] lg:text-8xl">
              <MaskedLines lines={['Radio FECAM']} delay={0.05} />
            </h1>
            <p className="mt-5 max-w-lg text-lg text-fecam-paper/70">La radio de la musique centrafricaine : artistes d’ici, interviews, directs de nos événements.</p>

            <div className="mt-10 flex items-center gap-6 rounded-3xl bg-fecam-paper/[0.06] p-5 lg:p-6">
              <RadioPlayButton size="lg" tone="orange" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-fecam-paper/60" aria-live="polite">{statusLabel}</p>
                <p className="mt-1 font-display text-2xl font-bold">{current?.title ?? 'Programmation musicale'}</p>
                {current &&
                <p className="text-fecam-paper/60">
                    {current.host} · {formatShowTime(current.start)} – {formatShowTime(current.end)}
                  </p>
                }
              </div>
            </div>

            <div className="mt-8 flex max-w-xs items-center gap-3">
              <button type="button" onClick={toggleMute} aria-label={muted ? 'Réactiver le son' : 'Couper le son'} className="rounded-full p-2 transition-colors duration-300 hover:bg-fecam-paper/10">
                {muted || volume === 0 ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
              </button>
              <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume" className="flex-1" />
            </div>

            {next &&
            <p className="mt-8 border-t border-fecam-paper/10 pt-5 text-fecam-paper/60">
                À suivre, {formatShowTime(next.start)} : <span className="font-medium text-fecam-paper">{next.title}</span> avec {next.host}
              </p>
            }
          </div>
          <motion.div
            className="overflow-hidden rounded-3xl"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.3, delay: 0.15, ease: easeOut }}>
            
            <motion.img
              src={images.radio}
              alt="Studio de Radio FECAM"
              className="aspect-[4/3] w-full object-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, delay: 0.15, ease: easeOut }} />
            
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Reveal>
              <p className="font-serif text-lg italic text-fecam-clay">Toute la semaine</p>
              <h2 className="mt-1 font-poster text-5xl uppercase leading-[0.95] lg:text-6xl">Grille des programmes</h2>
            </Reveal>
            <div role="tablist" aria-label="Jour" className="mt-10 flex gap-1 overflow-x-auto border-b border-fecam-black/10">
              {radioDays.map((d) =>
              <button
                key={d.day}
                role="tab"
                aria-selected={day === d.day}
                aria-label={d.label}
                onClick={() => setDay(d.day)}
                className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                day === d.day ? 'text-fecam-black' : 'text-fecam-black/50 hover:text-fecam-black'}`
                }>
                
                  {/* Soulignement qui glisse d'un jour à l'autre */}
                  {day === d.day &&
                  <motion.span layoutId="day-underline" className="absolute inset-x-2 -bottom-px h-0.5 bg-fecam-black" transition={{ duration: 0.5, ease: easeOut }} />
                  }
                  {d.short}
                  {d.day === now.getDay() && <span className="ml-1 font-medium">(auj.)</span>}
                </button>
              )}
            </div>
            <AnimatePresence mode="wait">
            <motion.ol
              key={day}
              className="divide-y divide-fecam-black/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOut }}>
              {dayShows.map((show) => {
                const live = day === now.getDay() && isShowLive(show, now);
                return (
                  <li key={show.id} className={`grid grid-cols-[5.5rem_1fr] gap-4 py-6 sm:grid-cols-[7rem_1fr] ${live ? '-mx-5 rounded-2xl border-0 bg-fecam-sand px-5' : ''}`}>
                    <p className="font-poster text-2xl">
                      {formatShowTime(show.start)}
                      <span className="block font-sans text-sm font-normal text-fecam-black/50">→ {formatShowTime(show.end)}</span>
                    </p>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-xl font-bold">{show.title}</h3>
                        {live &&
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-fecam-orange">
                            <span className="h-1.5 w-1.5 rounded-full bg-fecam-orange" /> En direct
                          </span>
                        }
                      </div>
                      <p className="text-sm font-medium text-fecam-black/70">{show.host}</p>
                      <p className="mt-1 text-sm text-fecam-black/55">{show.description}</p>
                    </div>
                  </li>);

              })}
            </motion.ol>
            </AnimatePresence>
          </div>

          <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
            {state === 'success' ?
            <FormStatus title="Dédicace envoyée" message="Restez à l’écoute : elle passera dans Nuits Centrafricaines ou Dimanche en famille." onReset={reset} resetLabel="Envoyer une autre dédicace" /> :

            <form onSubmit={handleDedication} className="relative rounded-3xl bg-fecam-sand p-6 lg:p-8">
                <Honeypot />
                <h2 className="font-display text-2xl font-bold">Envoyer une dédicace</h2>
                <p className="mt-1 text-sm text-fecam-black/60">Saluez vos proches ou demandez un titre à l’antenne.</p>
                <div className="mt-6 space-y-4">
                  <FormField id="dedicace-nom" label="Votre prénom" required />
                  <FormField id="dedicace-ville" label="Ville ou quartier" />
                  <FormField id="dedicace-titre" label="Titre souhaité" placeholder="Artiste – titre" />
                  <FormField id="dedicace-message" label="Votre message" multiline required />
                </div>
                <button
                type="submit"
                disabled={state === 'submitting'}
                className="btn-dark mt-6 w-full disabled:opacity-70">
                
                  {state === 'submitting' && <Loader2Icon className="h-4 w-4 animate-spin" />}
                  {state === 'submitting' ? 'Envoi…' : 'Envoyer'}
                </button>
                {state === 'error' && <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{message}</p>}
              </form>
            }
            <div className="rounded-3xl border border-fecam-black/10 p-6 lg:p-8">
              <RadioIcon className="h-6 w-6 text-fecam-orange" />
              <h2 className="mt-3 font-display text-xl font-bold">Artistes : faites-vous diffuser</h2>
              <p className="mt-2 text-fecam-black/60">Les membres de la FECAM peuvent proposer leurs titres à la programmation. Envoyez vos morceaux à {site.email}.</p>
            </div>
          </aside>
        </div>
      </section>

      <MemberCta />
    </>);

}