
interface FilterChipsProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterChips({ label, options, value, onChange }: FilterChipsProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
            active ? 'border-fecam-black bg-fecam-black text-fecam-paper' : 'border-fecam-black/[0.12] text-fecam-black/70 hover:border-fecam-black/40 hover:text-fecam-black'}`
            }>
            
            {option}
          </button>);

      })}
    </div>);

}