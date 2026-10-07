// Champ invisible pour les humains, que les robots de spam remplissent : l'API ignore alors l'envoi.
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor="website">Ne pas remplir</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>);

}
