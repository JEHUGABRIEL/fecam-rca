import { FormEvent, useState } from 'react';
import { ApiError, sendJson } from '../lib/api';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

// Envoie un formulaire public vers /api/submit/:table (lu ensuite dans le back-office).
export function useSubmit(table: string) {
  const [state, setState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>, values: Record<string, unknown>) => {
    e.preventDefault();
    setState('submitting');
    setMessage(null);
    try {
      // « website » : champ piège invisible, rempli uniquement par les robots
      const website = new FormData(e.currentTarget).get('website');
      await sendJson(`/api/submit/${table}`, 'POST', { ...values, website });
      setState('success');
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : 'Une erreur est survenue, merci de réessayer.');
      setState('error');
    }
  };

  return { state, message, submit, reset: () => setState('idle') };
}
