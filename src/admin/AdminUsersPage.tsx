import React, { useCallback, useEffect, useState } from 'react';
import { Loader2Icon, PlusIcon, ShieldCheckIcon, Trash2Icon } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { api, ApiError, sendJson } from '../lib/api';
import { inputClass } from './AdminCrudPage';
import { useConfirm } from './ui/ConfirmDialog';
import { IconButton } from './ui/IconButton';
import { Modal } from './ui/Modal';
import { PasswordInput } from './ui/PasswordInput';

interface AdminRow {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_login_at: string | null;
}

const when = (iso: string | null) =>
iso ? new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Jamais';

// Mot de passe aléatoire lisible (proposé à la création d'un compte)
function generatePassword() {
  const alphabet = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('').replace(/(.{4})(?!$)/g, '$1-');
}

export function AdminUsersPage() {
  const { user, expire } = useAdminAuth();
  const confirm = useConfirm();
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', password: '' });

  const fail = useCallback((err: unknown) => {
    if (err instanceof ApiError && err.status === 401) expire();
    setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
  }, [expire]);

  const load = useCallback(async () => {
    try {
      setRows(await api<AdminRow[]>('/api/admin/users'));
    } catch (err) {
      fail(err);
    }
    setLoading(false);
  }, [fail]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await sendJson('/api/admin/users', 'POST', form);
      setOpen(false);
      await load();
    } catch (err) {
      fail(err);
    }
    setSaving(false);
  };

  const handleDelete = async (row: AdminRow) => {
    const ok = await confirm({
      title: 'Retirer cet administrateur ?',
      message: `${row.email} n’aura plus accès au back-office. Ses sessions ouvertes seront fermées immédiatement.`,
      confirmLabel: 'Retirer l’accès'
    });
    if (!ok) return;
    try {
      await sendJson(`/api/admin/users?id=${encodeURIComponent(row.id)}`, 'DELETE');
      await load();
    } catch (err) {
      fail(err);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-poster text-4xl uppercase">Administrateurs</h1>
          <p className="mt-1 max-w-xl text-sm text-fecam-black/60">Personnes ayant accès au back-office. Chacune se connecte avec son propre email et mot de passe.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm({ email: '', name: '', password: generatePassword() });
            setError(null);
            setOpen(true);
          }}
          className="btn-dark !py-2.5">
          
          <PlusIcon className="h-4 w-4" /> Ajouter un administrateur
        </button>
      </div>

      {error && !open && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-fecam-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-fecam-black/10 text-xs uppercase tracking-[0.12em] text-fecam-black/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Dernière connexion</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fecam-black/[0.06]">
            {loading ?
            <tr><td colSpan={4} className="px-4 py-8 text-fecam-black/50">Chargement…</td></tr> :
            rows.map((r) =>
            <tr key={r.id} className="hover:bg-fecam-paper">
                  <td className="px-4 py-3 font-medium">
                    <span className="flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4 text-fecam-orange" />
                      {r.name || '—'}
                      {r.id === user?.id && <span className="rounded-full bg-fecam-sand px-2 py-0.5 text-[11px] font-semibold">Vous</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3 text-fecam-black/60">{when(r.last_login_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {r.id !== user?.id &&
                  <IconButton label="Retirer l’accès" tone="danger" onClick={() => handleDelete(r)}>
                          <Trash2Icon className="h-4 w-4" />
                        </IconButton>
                  }
                    </div>
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        busy={saving}
        title="Ajouter un administrateur"
        description="Transmettez le mot de passe à la personne par un canal sûr ; elle pourra le changer dans « Mon compte »."
        footer={
        <>
            {error && <p className="mr-auto text-sm font-medium text-red-700" role="alert">{error}</p>}
            <button type="button" onClick={() => setOpen(false)} disabled={saving} className="btn-ghost !py-2.5">Annuler</button>
            <button type="submit" form="form-admin-user" disabled={saving} className="btn-dark !py-2.5 disabled:opacity-70">
              {saving && <Loader2Icon className="h-4 w-4 animate-spin" />}
              Créer le compte
            </button>
          </>
        }>
        
        <form id="form-admin-user" onSubmit={handleCreate} className="grid gap-5">
          <div>
            <label htmlFor="new-admin-name" className="text-sm font-medium text-fecam-black/80">Nom</label>
            <input id="new-admin-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="new-admin-email" className="text-sm font-medium text-fecam-black/80">Email <span className="text-fecam-orange">*</span></label>
            <input id="new-admin-email" type="email" required autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="new-admin-password" className="text-sm font-medium text-fecam-black/80">Mot de passe <span className="text-fecam-orange">*</span></label>
            <PasswordInput
              id="new-admin-password"
              required
              minLength={12}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              inputClassName={inputClass} />
            
            <p className="mt-1 text-xs text-fecam-black/50">12 caractères minimum. Un mot de passe aléatoire est proposé.</p>
          </div>
        </form>
      </Modal>
    </div>);

}
