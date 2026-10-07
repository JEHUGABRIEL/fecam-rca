import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  inputClassName: string;
}

// Champ mot de passe avec bouton « œil » pour afficher / masquer la saisie
export function PasswordInput({ inputClassName, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? 'text' : 'password'} className={`${inputClassName} pr-12`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 mt-[3px] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-fecam-black/50 transition-colors hover:bg-fecam-black/5 hover:text-fecam-black">
        
        {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </button>
    </div>);

}
