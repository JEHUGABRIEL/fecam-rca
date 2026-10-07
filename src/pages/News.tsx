import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FilterChips } from '../components/FilterChips';
import { PageHeader } from '../components/PageHeader';
import { MemberCta } from '../components/MemberCta';
import { LoadError } from '../components/LoadError';
import { PageLoader } from '../components/LoadingScreen';
import { easeOut, RevealGroup, revealItem } from '../components/Reveal';
import { newsCategories } from '../data/news';
import { useNews } from '../hooks/data';
import { formatShortDate } from '../utils/date';

export function News() {
  const { data: news, loading, failed, refresh } = useNews();
  const [category, setCategory] = useState('Toutes');
  const filtered = news.filter((n) => category === 'Toutes' || n.category === category);
  const [lead, ...rest] = filtered;

  return (
    <>
      <PageHeader kicker="La scène bouge" title="Actualités" description="La vie de la fédération, de la radio et de la scène musicale centrafricaine." />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <FilterChips label="Rubrique" options={['Toutes', ...newsCategories]} value={category} onChange={setCategory} />

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}>

            {loading ?
            <PageLoader /> :
            failed ?
            <LoadError onRetry={refresh} what="les actualités" /> :
            !lead ?
            <p className="py-20 text-center text-fecam-black/60">Aucun article dans cette rubrique pour le moment.</p> :

            <>
                <article className="group mt-12 grid items-center gap-10 border-b border-fecam-black/10 pb-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
                  <div className="overflow-hidden rounded-2xl">
                    <img src={lead.image} alt="" className="img-zoom aspect-[16/10] w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fecam-clay">
                      {lead.category} · {formatShortDate(lead.date)}
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-bold leading-tight lg:text-[2.6rem] lg:leading-[1.1]">{lead.title}</h2>
                    <p className="mt-5 text-lg leading-relaxed text-fecam-black/65">{lead.excerpt}</p>
                  </div>
                </article>

                <RevealGroup className="grid gap-x-8 gap-y-14 pt-14 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((item) =>
                <motion.article key={item.id} variants={revealItem} className="group">
                      <div className="overflow-hidden rounded-2xl">
                        <img src={item.image} alt="" className="img-zoom aspect-[4/3] w-full object-cover" />
                      </div>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-fecam-clay">
                        {item.category} · {formatShortDate(item.date)}
                      </p>
                      <h2 className="mt-2 font-display text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-fecam-clay">
                        {item.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 leading-relaxed text-fecam-black/60">{item.excerpt}</p>
                    </motion.article>
                )}
                </RevealGroup>
              </>
            }
          </motion.div>
        </AnimatePresence>
      </section>

      <MemberCta />
    </>);

}
