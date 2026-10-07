import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
}

const fieldClass =
'mt-2 w-full rounded-xl border border-fecam-black/[0.12] bg-white/70 px-4 py-3 text-fecam-black placeholder:text-fecam-black/35 transition-[border-color,background-color,box-shadow] duration-300 hover:border-fecam-black/25 focus:border-fecam-black/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(232,116,47,0.12)] focus:outline-none';

export function FormField({ id, label, type = 'text', required, placeholder, multiline, options, value, onChange }: FormFieldProps) {
  const controlled = value !== undefined ? { value, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange?.(e.target.value) } : {};
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-fecam-black/80">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {options ?
      <select id={id} name={id} required={required} className={fieldClass} {...controlled}>
          {options.map((o) =>
        <option key={o} value={o}>{o}</option>
        )}
        </select> :
      multiline ?
      <textarea id={id} name={id} required={required} placeholder={placeholder} rows={4} className={fieldClass} {...controlled} /> :

      <input id={id} name={id} type={type} required={required} placeholder={placeholder} className={fieldClass} {...controlled} />
      }
    </div>);

}