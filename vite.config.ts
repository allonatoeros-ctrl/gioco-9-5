import { defineConfig, type Plugin } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

/**
 * Crea dist/sw.js dal modello src/app/sw-modello.js, con dentro l'elenco dei file
 * del gioco online da tenere in memoria sul telefono (per aprirlo anche senza internet).
 */
function serviceWorker(): Plugin {
  return {
    name: 'service-worker-9-5',
    apply: 'build',
    generateBundle(_opzioni, bundle) {
      const daSito = Object.keys(bundle)
        .filter((f) => f.startsWith('assets/') && !f.includes('prototipo') && !f.endsWith('.map'))
        .map((f) => '/' + f);
      const icone = readdirSync('public/icone').filter((f) => f.startsWith('icona-') || f === 'apple-touch-icon.png').map((f) => '/icone/' + f);
      const file = ['/', '/manifest.webmanifest', ...icone, ...daSito].sort();
      const modello = readFileSync('src/app/sw-modello.js', 'utf8');
      const versione = createHash('sha256').update(modello + file.join('\n')).digest('hex').slice(0, 12);
      const codice = modello
        .replace('__VERSIONE__', versione)
        .replace('__FILE__', JSON.stringify(file, null, 2));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: codice });
    },
  };
}

// Due pagine: index.html = gioco online, prototipo.html = tutti sullo stesso schermo (Fase B).
export default defineConfig({
  plugins: [serviceWorker()],
  build: {
    rollupOptions: {
      input: { online: 'index.html', prototipo: 'prototipo.html' },
    },
  },
});
