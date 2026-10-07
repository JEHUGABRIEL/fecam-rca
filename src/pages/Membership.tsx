import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { FormField } from '../components/FormField';
import { FormStatus } from '../components/FormStatus';
import { PageHeader } from '../components/PageHeader';
import { Reveal, RevealGroup, revealItem } from '../components/Reveal';
import { artistGenres } from '../data/artists';
import { membershipPlans } from '../data/federation';
import { useSubmit } from '../hooks/useSubmit';
import { Honeypot } from '../components/Honeypot';

export function Membership() {
  const [plan, setPlan] = useState(membershipPlans[0].name);
  const { state, message, submit, reset } = useSubmit('membership_requests');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    submit(e, {
      plan,
      name: formData.get('adh-nom'),
      genre: formData.get('adh-genre'),
      phone: formData.get('adh-tel'),
      email: formData.get('adh-email') || null,
      city: formData.get('adh-ville'),
      presentation: formData.get('adh-presentation') || null
    });
  };

  const choose = (name: string) => {
    setPlan(name);
    document.getElementById('formulaire-adhesion')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHeader kicker="Rejoignez la famille" title="Devenir membre" description="Rejoindre la FECAM, c’est être représenté, accompagné dans ses droits, diffusé et invité sur les scènes de la fédération." />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <p className="font-serif text-lg italic text-fecam-clay">Trois formules</p>
          <h2 className="mt-1 font-poster text-5xl uppercase leading-[0.95] lg:text-6xl">Formules d’adhésion</h2>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3">
          {membershipPlans.map((p) => {
            const selected = plan === p.name;
            return (
              <motion.div
                key={p.id}
                variants={revealItem}
                className={`flex flex-col rounded-3xl p-8 transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                selected ? 'bg-fecam-black text-fecam-paper shadow-[0_30px_60px_-30px_rgba(26,22,18,0.5)] lg:-translate-y-2' : 'bg-fecam-sand hover:-translate-y-1'}`
                }>
                
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className={`mt-1 text-sm ${selected ? 'text-fecam-paper/60' : 'text-fecam-black/60'}`}>{p.audience}</p>
                <p className="mt-6 font-poster text-4xl">{p.price}</p>
                <ul className={`mt-6 space-y-3 border-t pt-6 ${selected ? 'border-fecam-paper/15' : 'border-fecam-black/10'}`}>
                  {p.features.map((f) =>
                  <li key={f} className="flex gap-3 text-sm">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-fecam-orange" strokeWidth={3} />
                      {f}
                    </li>
                  )}
                </ul>
                <div className="mt-auto pt-8">
                  <button
                    type="button"
                    onClick={() => choose(p.name)}
                    className={`btn w-full ${selected ? 'bg-fecam-orange text-white' : 'bg-fecam-black text-fecam-paper hover:bg-fecam-orange'}`}>
                    
                    {selected ? 'Formule choisie' : 'Choisir cette formule'}
                  </button>
                </div>
              </motion.div>);

          })}
        </RevealGroup>
      </section>

      <section id="formulaire-adhesion" className="scroll-mt-24 border-t border-fecam-black/10 bg-fecam-sand/60">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-8 lg:py-28">
          <Reveal>
            <h2 className="font-poster text-5xl uppercase leading-[0.95] lg:text-6xl">Demande d’adhésion</h2>
            <p className="mt-5 leading-relaxed text-fecam-black/65">
              Remplissez le formulaire : le secrétariat vous contacte sous 7 jours pour finaliser l’adhésion et le règlement de la cotisation
              (espèces au siège ou mobile money).
            </p>
            <ol className="mt-8 space-y-5">
              {['Envoi du formulaire', 'Entretien avec le secrétariat', 'Règlement de la cotisation', 'Remise de la carte de membre'].map((step, i) =>
              <li key={step} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-fecam-black/15 font-poster text-lg">{i + 1}</span>
                  <span className="font-medium">{step}</span>
                </li>
              )}
            </ol>
          </Reveal>

          {state === 'success' ?
          <FormStatus title="Demande envoyée" message={`Merci ! Votre demande (${plan}) a bien été reçue. Le secrétariat vous contactera prochainement.`} onReset={reset} resetLabel="Faire une nouvelle demande" /> :

          <form onSubmit={handleSubmit} className="relative rounded-3xl bg-fecam-paper p-6 shadow-[0_30px_60px_-40px_rgba(26,22,18,0.35)] lg:p-10">
              <Honeypot />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField id="formule" label="Formule" options={membershipPlans.map((p) => p.name)} value={plan} onChange={setPlan} />
                </div>
                <FormField id="adh-nom" label="Nom ou nom de scène" required />
                <FormField id="adh-genre" label="Genre musical" options={artistGenres} />
                <FormField id="adh-tel" label="Téléphone" type="tel" required placeholder="+236 …" />
                <FormField id="adh-email" label="E-mail" type="email" />
                <div className="sm:col-span-2">
                  <FormField id="adh-ville" label="Ville" required />
                </div>
                <div className="sm:col-span-2">
                  <FormField id="adh-presentation" label="Présentez-vous en quelques lignes" multiline />
                </div>
              </div>
              <button
              type="submit"
              disabled={state === 'submitting'}
              className="btn-dark mt-8 w-full disabled:opacity-70 sm:w-auto">
              
                {state === 'submitting' && <Loader2Icon className="h-4 w-4 animate-spin" />}
                {state === 'submitting' ? 'Envoi…' : 'Envoyer ma demande'}
              </button>
              {state === 'error' &&
              <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{message}</p>
              }
            </form>
          }
        </div>
      </section>
    </>);

}