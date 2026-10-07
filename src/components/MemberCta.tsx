import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { images } from '../data/site';
import { Reveal } from './Reveal';

// Appel à l'adhésion placé en fin de page
export function MemberCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
      <Reveal className="group relative overflow-hidden rounded-3xl bg-fecam-black text-fecam-paper">
        <img src={images.workshop} alt="" className="img-zoom absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-fecam-black via-fecam-black/80 to-transparent" aria-hidden="true" />
        <div className="relative grid gap-10 p-8 py-16 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:p-16">
          <div>
            <p className="font-serif text-xl italic text-fecam-orange">Artiste, groupe ou association ?</p>
            <h2 className="mt-2 font-poster text-6xl uppercase leading-[0.92] lg:text-8xl">
              Rejoignez
              <br />
              la famille
            </h2>
          </div>
          <div>
            <p className="max-w-sm text-lg text-fecam-paper/75">Être accompagné, diffusé sur Radio FECAM et représenté auprès des institutions.</p>
            <Link to="/adhesion" className="btn-primary mt-8 hover:!bg-fecam-paper hover:!text-fecam-black">
              Devenir membre <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>);

}
