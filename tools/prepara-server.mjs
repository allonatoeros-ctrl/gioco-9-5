// Impacchetta il motore delle regole + la logica del server in un solo file JavaScript
// che la Edge Function di Supabase (supabase/functions/gioco/) può usare.
// Va rilanciato ogni volta che cambia src/engine/ o src/server/.
import { build } from 'esbuild';

await build({
  entryPoints: ['src/server/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  outfile: 'supabase/functions/gioco/logica.js',
  banner: { js: '// FILE GENERATO da `npm run prepara-server`: non modificarlo a mano.\n// deno-lint-ignore-file' },
  logLevel: 'info',
});
