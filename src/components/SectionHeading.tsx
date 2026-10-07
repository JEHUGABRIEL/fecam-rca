import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  title: string;
  description?: string;
  // Courte accroche en italique au-dessus du titre
  kicker?: string;
  linkTo?: string;
  linkLabel?: string;
  tone?: 'light' | 'dark';
}

export function SectionHeading({ title, description, kicker, linkTo, linkLabel, tone = 'light' }: SectionHeadingProps) {
  const muted = tone === 'light' ? 'text-fecam-black/65' : 'text-fecam-paper/65';

  return (
    <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && <p className={`font-serif text-lg italic ${tone === 'light' ? 'text-fecam-clay' : 'text-fecam-orange'}`}>{kicker}</p>}
        <h2 className="mt-1 font-poster text-5xl uppercase leading-[0.95] lg:text-6xl">{title}</h2>
        {description && <p className={`mt-4 max-w-xl ${muted}`}>{description}</p>}
      </div>
      {linkTo && linkLabel &&
      <Link to={linkTo} className="link-draw">
          {linkLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      }
    </Reveal>);

}
