// Controlla che il file impacchettato usato dal server (supabase/functions/gioco/logica.js)
// sia aggiornato: se si cambia il motore bisogna rilanciare `npm run prepara-server`.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';

it('il motore impacchettato per il server è aggiornato', () => {
  const file = new URL('../../supabase/functions/gioco/logica.js', import.meta.url);
  const prima = readFileSync(file, 'utf8');
  execFileSync('node', ['tools/prepara-server.mjs'], { stdio: 'ignore' });
  const dopo = readFileSync(file, 'utf8');
  expect(dopo === prima, 'Lancia `npm run prepara-server` e salva il file aggiornato').toBe(true);
});
