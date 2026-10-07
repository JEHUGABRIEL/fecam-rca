import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageUpIcon, Loader2Icon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon, XIcon } from 'lucide-react';
import { uploadImage, useAdminTable } from '../hooks/useAdminTable';
import { ApiError } from '../lib/api';

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

export function AdminCrudPage<T extends {id: string;}>({ title, description, table, fields, columns, toRow, fromRow }: AdminCrudPageProps<T>) {
  const { data, loading, saving, error, create, update, remove } = useAdminTable<T>(table);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) => Object.values(row as Record<string, unknown>).some((v) => String(v ?? '').toLowerCase().includes(q)));
  }, [data, search]);

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setValues(Object.fromEntries(fields.map((f) => [f.key, ''])));
    setOpen(true);
  };

  const openEdit = (row: T) => {
    setEditingId(row.id);
    const raw = fromRow ? fromRow(row) : (row as unknown as Record<string, unknown>);
    setValues(Object.fromEntries(fields.map((f) => [f.key, raw[f.key] === true ? 'true' : String(raw[f.key] ?? '')])));
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer définitivement cet élément ?')) return;
    await remove(id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-poster text-4xl uppercase">{title}</h1>
          {description && <p className="mt-1 max-w-xl text-sm text-fecam-black/60">{description}</p>}
        </div>
        <button type="button" onClick={openCreate} className="btn-dark !py-2.5">
          <PlusIcon className="h-4 w-4" /> Ajouter
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
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-fecam-black/[0.06]">
            {loading ?
            <tr><td className="px-4 py-8 text-fecam-black/50" colSpan={columns.length + 1}>Chargement…</td></tr> :
            rows.length === 0 ?
            <tr><td className="px-4 py-8 text-fecam-black/50" colSpan={columns.length + 1}>{search ? 'Aucun résultat.' : 'Aucun élément pour le moment.'}</td></tr> :

            rows.map((row) =>
            <tr key={row.id} className="transition-colors hover:bg-fecam-paper">
                  {columns.map((c) =>
              <td key={c.key} className="max-w-xs truncate px-4 py-3">
                      {c.render ? c.render(row) : formatCell((row as Record<string, unknown>)[c.key])}
                    </td>
              )}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => openEdit(row)} aria-label="Modifier" className="rounded-full p-2 hover:bg-fecam-black/5">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(row.id)} aria-label="Supprimer" className="rounded-full p-2 text-red-700 hover:bg-red-50">
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
            )
            }
          </tbody>
        </table>
      </div>

      {/* Panneau d'édition latéral */}
      <AnimatePresence>
        {open &&
        <>
            <motion.div
            className="fixed inset-0 z-40 bg-fecam-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)} />

            <motion.form
            onSubmit={handleSubmit}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-fecam-paper shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>

              <div className="flex items-center justify-between border-b border-fecam-black/10 px-6 py-5">
                <h2 className="font-display text-xl font-bold">{editingId ? 'Modifier' : 'Ajouter'} · {title}</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="rounded-full p-2 hover:bg-fecam-black/5">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="grid flex-1 content-start gap-5 overflow-y-auto px-6 py-6 sm:grid-cols-2">
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
              </div>
              <div className="flex items-center gap-4 border-t border-fecam-black/10 px-6 py-4">
                <button type="submit" disabled={saving} className="btn-dark !py-2.5 disabled:opacity-70">
                  {saving && <Loader2Icon className="h-4 w-4 animate-spin" />}
                  Enregistrer
                </button>
                {error && <p className="text-sm font-medium text-red-700">{error}</p>}
              </div>
            </motion.form>
          </>
        }
      </AnimatePresence>
    </div>);

}
