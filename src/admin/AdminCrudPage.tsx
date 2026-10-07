import React, { useMemo, useState } from 'react';
import { ImageUpIcon, Loader2Icon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import { uploadImage, useAdminTable } from '../hooks/useAdminTable';
import { ApiError } from '../lib/api';
import { useConfirm } from './ui/ConfirmDialog';
import { IconButton } from './ui/IconButton';
import { Modal } from './ui/Modal';
import { Pagination, usePagination } from './ui/Pagination';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'date' | 'time' | 'select' | 'number' | 'checkbox' | 'image' | 'url';
  options?: string[];
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  // Texte d'aide affiché sous le champ
  hint?: string;
}

export interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminCrudPageProps<T extends {id: string;}> {
  title: string;
  description?: string;
  table: string;
  fields: FieldDef[];
  columns: ColumnDef<T>[];
  // Transforme les valeurs texte du formulaire vers le format attendu par l'API
  toRow?: (values: Record<string, string>) => Record<string, unknown>;
  // Transforme une ligne existante en valeurs texte pour pré-remplir le formulaire
  fromRow?: (row: T) => Record<string, string>;
  // Sous-ensemble affiché (ex. événements à venir / passés)
  filter?: (row: T) => boolean;
  // Libellé de l'élément au singulier, pour les titres de modale (« un événement »)
  itemLabel?: string;
  // Ligne affichée dans la confirmation de suppression
  describe?: (row: T) => string;
  emptyLabel?: string;
}

export const inputClass =
'mt-1.5 w-full rounded-xl border border-fecam-black/[0.12] bg-white px-4 py-2.5 text-sm transition-[border-color,box-shadow] duration-200 focus:border-fecam-black/40 focus:shadow-[0_0_0_4px_rgba(232,116,47,0.12)] focus:outline-none';

function formatCell(value: unknown): React.ReactNode {
  if (typeof value === 'boolean') return value ? 'Oui' : '—';
  if (Array.isArray(value)) return value.join(', ');
  return String(value ?? '');
}

// Champ image : URL saisie à la main ou fichier envoyé vers le stockage, avec aperçu
function ImageField({ id, value, onChange }: {id: string;value: string;onChange: (v: string) => void;}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Envoi impossible.');
    }
    setUploading(false);
  };

  return (
    <div className="mt-1.5 flex gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-fecam-sand">
        {value && <img src={value} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-fecam-black/15 px-4 py-2 text-sm font-medium transition-colors hover:border-fecam-black">
          {uploading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <ImageUpIcon className="h-4 w-4" />}
          {uploading ? 'Envoi…' : 'Choisir une image'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="… ou collez un lien https://"
          className={inputClass} />

        {error && <p className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
      </div>
    </div>);

}

export function AdminCrudPage<T extends {id: string;}>({
  title,
  description,
  table,
  fields,
  columns,
  toRow,
  fromRow,
  filter,
  itemLabel = 'un élément',
  describe,
  emptyLabel = 'Aucun élément pour le moment.'
}: AdminCrudPageProps<T>) {
  const { data, loading, saving, error, create, update, remove, clearError } = useAdminTable<T>(table);
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const scoped = filter ? data.filter(filter) : data;
    if (!q) return scoped;
    return scoped.filter((row) => Object.values(row as Record<string, unknown>).some((v) => String(v ?? '').toLowerCase().includes(q)));
  }, [data, search, filter]);
  const pagination = usePagination(rows, 10);

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setValues(Object.fromEntries(fields.map((f) => [f.key, ''])));
    clearError();
    setOpen(true);
  };

  const openEdit = (row: T) => {
    setEditingId(row.id);
    const raw = fromRow ? fromRow(row) : (row as unknown as Record<string, unknown>);
    setValues(Object.fromEntries(fields.map((f) => [f.key, raw[f.key] === true ? 'true' : String(raw[f.key] ?? '')])));
    clearError();
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const base: Record<string, unknown> = Object.fromEntries(
      fields.map((f) => [f.key, f.type === 'checkbox' ? values[f.key] === 'true' : values[f.key]])
    );
    const payload = toRow ? { ...base, ...toRow(values) } : base;
    const ok = editingId ? await update(editingId, payload) : await create(payload);
    if (ok) setOpen(false);
  };

  const handleDelete = async (row: T) => {
    const ok = await confirm({
      title: 'Supprimer cet élément ?',
      message: `${describe ? `« ${describe(row)} » sera` : 'Cet élément sera'} supprimé définitivement. Cette action est irréversible.`,
      confirmLabel: 'Supprimer'
    });
    if (ok) await remove(row.id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-poster text-4xl uppercase">{title}</h1>
          {description && <p className="mt-1 max-w-xl text-sm text-fecam-black/60">{description}</p>}
        </div>
        <button type="button" onClick={openCreate} className="btn-dark !py-2.5">
          <PlusIcon className="h-4 w-4" /> Ajouter {itemLabel}
        </button>
      </div>

      <div className="relative mt-6 max-w-xs">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fecam-black/40" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          aria-label="Rechercher"
          className={`${inputClass} !mt-0 rounded-full pl-11`} />

      </div>

      {error && !open && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-fecam-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-fecam-black/10 text-xs uppercase tracking-[0.12em] text-fecam-black/50">
            <tr>
              {columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fecam-black/[0.06]">
            {loading ?
            <tr><td className="px-4 py-8 text-fecam-black/50" colSpan={columns.length + 1}>Chargement…</td></tr> :
            rows.length === 0 ?
            <tr><td className="px-4 py-8 text-fecam-black/50" colSpan={columns.length + 1}>{search ? 'Aucun résultat.' : emptyLabel}</td></tr> :

            pagination.pageItems.map((row) =>
            <tr key={row.id} className="transition-colors hover:bg-fecam-paper">
                  {columns.map((c) =>
              <td key={c.key} className="max-w-xs truncate px-4 py-3">
                      {c.render ? c.render(row) : formatCell((row as Record<string, unknown>)[c.key])}
                    </td>
              )}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <IconButton label="Modifier" onClick={() => openEdit(row)}>
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Supprimer" tone="danger" onClick={() => handleDelete(row)}>
                        <Trash2Icon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
            )
            }
          </tbody>
        </table>
      </div>
      <Pagination
        page={pagination.page}
        pageCount={pagination.pageCount}
        onChange={pagination.setPage}
        from={pagination.from}
        to={pagination.to}
        total={pagination.total} />
      

      {/* Ajout / modification en modale */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        busy={saving}
        size="lg"
        title={editingId ? `Modifier ${itemLabel}` : `Ajouter ${itemLabel}`}
        description={`${title} · les champs marqués * sont obligatoires.`}
        footer={
        <>
            {error && <p className="mr-auto text-sm font-medium text-red-700" role="alert">{error}</p>}
            <button type="button" onClick={() => setOpen(false)} disabled={saving} className="btn-ghost !py-2.5">
              Annuler
            </button>
            <button type="submit" form={`form-${table}`} disabled={saving} className="btn-dark !py-2.5 disabled:opacity-70">
              {saving && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {editingId ? 'Enregistrer les modifications' : 'Ajouter'}
            </button>
          </>
        }>
        
        <form id={`form-${table}`} onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) =>
          <div key={f.key} className={f.fullWidth || f.type === 'textarea' || f.type === 'image' ? 'sm:col-span-2' : ''}>
              {f.type === 'checkbox' ?
            <label className="flex items-center gap-3 text-sm font-medium" htmlFor={`f-${f.key}`}>
                  <input
                id={`f-${f.key}`}
                type="checkbox"
                checked={values[f.key] === 'true'}
                onChange={(e) => set(f.key, e.target.checked ? 'true' : '')}
                className="h-4 w-4 accent-fecam-orange" />
              
                  {f.label}
                </label> :

            <label className="text-sm font-medium text-fecam-black/80" htmlFor={`f-${f.key}`}>
                  {f.label}
                  {f.required && <span className="text-fecam-orange"> *</span>}
                </label>
            }
              {f.type === 'textarea' ?
            <textarea id={`f-${f.key}`} required={f.required} rows={4} value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={inputClass} /> :
            f.type === 'select' ?
            <select id={`f-${f.key}`} required={f.required} value={values[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={inputClass}>
                  <option value="" disabled>Choisir…</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select> :
            f.type === 'image' ?
            <ImageField id={`f-${f.key}`} value={values[f.key] ?? ''} onChange={(v) => set(f.key, v)} /> :
            f.type === 'checkbox' ?
            null :

            <input
              id={`f-${f.key}`}
              type={f.type ?? 'text'}
              required={f.required}
              placeholder={f.placeholder}
              value={values[f.key] ?? ''}
              onChange={(e) => set(f.key, e.target.value)}
              className={inputClass} />

            }
              {f.hint && <p className="mt-1 text-xs text-fecam-black/50">{f.hint}</p>}
            </div>
          )}
        </form>
      </Modal>
    </div>);

}
