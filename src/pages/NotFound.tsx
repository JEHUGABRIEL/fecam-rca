import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { MaskedLines } from '../components/Reveal';

export function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-28 text-center lg:py-40">
      <p className="font-poster text-[9rem] leading-none text-fecam-orange lg:text-[12rem]">
        <MaskedLines lines={['404']} />
      </p>
      <h1 className="mt-6 font-display text-3xl font-bold">Cette page n’existe pas</h1>
      <p className="mt-3 text-fecam-black/60">Le lien est peut-être ancien. La radio, elle, continue de jouer.</p>
      <Link to="/" className="btn-dark mt-10">
        Retour à l’accueil <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </section>);

}
