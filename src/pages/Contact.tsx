import React from 'react';
import { ClockIcon, Loader2Icon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { FormField } from '../components/FormField';
import { FormStatus } from '../components/FormStatus';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { site } from '../data/site';
import { useSubmit } from '../hooks/useSubmit';
import { Honeypot } from '../components/Honeypot';
import { MemberCta } from '../components/MemberCta';

export function Contact() {
  const { state, message, submit, reset } = useSubmit('contact_messages');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    submit(e, {
      name: formData.get('contact-nom'),
      email: formData.get('contact-email'),
      subject: formData.get('contact-objet'),
      message: formData.get('contact-message')
    });
  };
  const coordinates = [
  { icon: MapPinIcon, label: 'Adresse', value: site.address },
  { icon: PhoneIcon, label: 'Téléphone', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
  { icon: MailIcon, label: 'E-mail', value: site.email, href: `mailto:${site.email}` },
  { icon: ClockIcon, label: 'Horaires du secrétariat', value: site.hours }];


  return (
    <>
      <PageHeader kicker="Parlons musique" title="Contact" description="Une question, une demande de partenariat ou de programmation ? Écrivez-nous." />

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-8 lg:py-28">
        <Reveal>
          <h2 className="font-poster text-4xl uppercase lg:text-5xl">Nos coordonnées</h2>
          <dl className="mt-8 divide-y divide-fecam-black/10 border-y border-fecam-black/10">
            {coordinates.map(({ icon: Icon, label, value, href }) =>
            <div key={label} className="flex gap-4 py-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-fecam-orange" />
                <div>
                  <dt className="text-sm text-fecam-black/55">{label}</dt>
                  <dd className="mt-0.5 font-medium">
                    {href ? <a href={href} className="link-draw !p-0 !text-base !font-medium">{value}</a> : value}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </Reveal>

        {state === 'success' ?
        <FormStatus title="Message envoyé" message="Merci, nous vous répondrons sous 48 heures ouvrées." onReset={reset} /> :

        <Reveal delay={0.1}>
        <form onSubmit={handleSubmit} className="relative rounded-3xl bg-fecam-sand p-6 lg:p-10">
            <Honeypot />
            <h2 className="font-display text-2xl font-bold">Envoyer un message</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField id="contact-nom" label="Nom" required />
              <FormField id="contact-email" label="E-mail" type="email" required />
              <div className="sm:col-span-2">
                <FormField id="contact-objet" label="Objet" options={['Information générale', 'Adhésion', 'Partenariat', 'Programmation d’un événement', 'Radio FECAM', 'Presse']} />
              </div>
              <div className="sm:col-span-2">
                <FormField id="contact-message" label="Message" multiline required />
              </div>
            </div>
            <button
            type="submit"
            disabled={state === 'submitting'}
            className="btn-dark mt-8 disabled:opacity-70">
            
              {state === 'submitting' && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {state === 'submitting' ? 'Envoi…' : 'Envoyer le message'}
            </button>
            {state === 'error' &&
            <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{message}</p>
            }
          </form>
        </Reveal>
        }
      </section>

      <MemberCta />
    </>);

}