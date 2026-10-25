// Crea un unico file HTML autonomo (CSS e JS dentro) per provare il gioco senza installare nulla.
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

const risultato = await build({
  entryPoints: ['src/ui/main.ts'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2022',
  write: false,
});
const js = risultato.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = readFileSync('src/ui/stile.css', 'utf8');
const pagina = `<title>Nove e mezzo</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
${css}</style>
<div id="app"></div>
<script>
${js}</script>
`;
writeFileSync(process.argv[2] ?? 'dist/gioco-singolo.html', pagina);
console.log('Scritto', process.argv[2] ?? 'dist/gioco-singolo.html', Math.round(pagina.length / 1024) + ' KB');
