export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        fecam: {
          // Noir chaud (encre) plutôt qu'un noir pur : moins froid sous les photos
          black: '#1A1612',
          // Orange du logo, adouci : réservé aux accents (boutons, libellés)
          orange: '#E8742F',
          // Bleu du logo, adouci : accents uniquement, jamais en aplat
          blue: '#2B36B0',
          // Fond papier : remplace le blanc pur des pages publiques
          paper: '#F7F3EC',
          // Sable : sections alternées, survols
          sand: '#EEE6D9',
          // Terre cuite, pour les petits libellés
          clay: '#A2593A',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        // Titres d'affiche (toujours en capitales)
        poster: ['Anton', 'Impact', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        // Accents éditoriaux en italique
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        equalizer: {
          '0%, 100%': { transform: 'scaleY(0.25)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        equalizer: 'equalizer 0.9s ease-in-out infinite',
      },
    },
  },
};
