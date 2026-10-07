import { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

// Découpe une liste en pages ; revient à la page 1 quand la liste change (recherche, filtre)
export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => setPage(1), [items.length]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);
  const pageItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize]);
  return { page, setPage, pageCount, pageItems, total: items.length, from: items.length ? (page - 1) * pageSize + 1 : 0, to: Math.min(page * pageSize, items.length) };
}

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  from: number;
  to: number;
  total: number;
}

// Pages affichées : 1 … 4 5 [6] 7 8 … 20
function pagesToShow(page: number, count: number): (number | '…')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...set].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => i > 0 && p - sorted[i - 1] > 1 ? ['…' as const, p] : [p]);
}

export function Pagination({ page, pageCount, onChange, from, to, total }: PaginationProps) {
  if (total === 0) return null;
  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-fecam-black/55">
        {from}–{to} sur {total}
      </p>
      {pageCount > 1 &&
      <div className="flex items-center gap-1">
          <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Page précédente"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-fecam-black/5 disabled:pointer-events-none disabled:opacity-30">
          
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          {pagesToShow(page, pageCount).map((p, i) =>
        p === '…' ?
        <span key={`gap-${i}`} className="px-1 text-fecam-black/40">…</span> :

        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`h-9 min-w-9 rounded-full px-3 font-medium transition-colors ${
          p === page ? 'bg-fecam-black text-fecam-paper' : 'hover:bg-fecam-black/5'}`
          }>
          
                {p}
              </button>

        )}
          <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Page suivante"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-fecam-black/5 disabled:pointer-events-none disabled:opacity-30">
          
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      }
    </nav>);

}
