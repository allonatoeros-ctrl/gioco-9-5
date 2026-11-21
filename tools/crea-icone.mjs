// Crea le icone e le schermate di avvio dell'app (stile "Notte e oro" del mazzo).
// Si lancia a mano solo quando si vuole cambiare il disegno:  node tools/crea-icone.mjs
// Serve Playwright con Chromium (non è tra le dipendenze del progetto).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { mkdirSync } from 'node:fs';

const CARTELLA = new URL('../public/icone/', import.meta.url).pathname;
mkdirSync(CARTELLA, { recursive: true });

// Il disegno: tre carte a ventaglio, quella davanti è il dorso blu con il 9½ dorato.
// `scala` = quanto spazio occupano le carte (le icone "maskable" vogliono margini larghi).
function disegno(scala) {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
    <defs>
      <radialGradient id="cielo" cx="50%" cy="30%" r="80%">
        <stop offset="0" stop-color="#2a3a68"/><stop offset=".55" stop-color="#141c36"/><stop offset="1" stop-color="#0a0f1f"/>
      </radialGradient>
      <pattern id="righe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="16" height="16" fill="#1b2a55"/><rect width="8" height="16" fill="#132042"/>
      </pattern>
      <linearGradient id="oro" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f6dc86"/><stop offset="1" stop-color="#c9982f"/>
      </linearGradient>
      <filter id="ombra" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity=".45"/>
      </filter>
    </defs>
    <rect width="512" height="512" fill="url(#cielo)"/>
    <g transform="translate(256 262) scale(${scala}) translate(-256 -262)">
      <!-- carte dietro (facce color crema) -->
      <g filter="url(#ombra)">
        <g transform="rotate(-17 256 430)">
          <rect x="156" y="96" width="200" height="290" rx="22" fill="#fffaf0" stroke="#d6af55" stroke-width="6"/>
          <text x="180" y="146" font-family="Georgia, 'Liberation Serif', serif" font-weight="700" font-size="40" fill="#b3401d">9</text>
        </g>
        <g transform="rotate(17 256 430)">
          <rect x="156" y="96" width="200" height="290" rx="22" fill="#fffaf0" stroke="#d6af55" stroke-width="6"/>
          <text x="332" y="146" text-anchor="end" font-family="Georgia, 'Liberation Serif', serif" font-weight="700" font-size="40" fill="#b3401d">½</text>
        </g>
        <!-- carta davanti: il dorso del mazzo -->
        <rect x="146" y="92" width="220" height="320" rx="24" fill="#fffdf5"/>
        <rect x="160" y="106" width="192" height="292" rx="16" fill="url(#righe)"/>
        <circle cx="256" cy="252" r="82" fill="#132042" stroke="url(#oro)" stroke-width="8"/>
        <text x="256" y="283" text-anchor="middle" font-family="Georgia, 'Liberation Serif', serif" font-weight="700" font-size="92" fill="url(#oro)" letter-spacing="-4">9½</text>
      </g>
    </g>
  </svg>`;
}

function pagina(corpo, sfondo = '#10172c') {
  return `<!doctype html><html><head><style>html,body{margin:0;height:100%;background:${sfondo};overflow:hidden}</style></head><body>${corpo}</body></html>`;
}

const browser = await chromium.launch();

async function scatta(nome, larghezza, altezza, html) {
  const p = await browser.newPage({ viewport: { width: larghezza, height: altezza }, deviceScaleFactor: 1 });
  await p.setContent(html);
  await p.screenshot({ path: CARTELLA + nome, type: 'png' });
  await p.close();
  console.log('creata', nome);
}

const icona = (s) => pagina(`<div style="width:100vw;height:100vh">${disegno(s)}</div>`);

// Icone normali (Android, computer) e quella di iPhone (180).
for (const lato of [512, 192, 180, 48, 32]) {
  await scatta(lato === 180 ? 'apple-touch-icon.png' : `icona-${lato}.png`, lato, lato, icona(lato <= 48 ? 1.12 : 1));
}
// Icone "maskable": Android ritaglia un cerchio o una goccia, il disegno deve stare nell'80% centrale.
for (const lato of [512, 192]) await scatta(`icona-maskable-${lato}.png`, lato, lato, icona(0.74));

// Schermate di avvio per iPhone (larghezza x altezza in punti, densità).
const IPHONE = [
  [440, 956, 3], [402, 874, 3], [430, 932, 3], [393, 852, 3], [428, 926, 3],
  [390, 844, 3], [375, 812, 3], [414, 896, 3], [414, 896, 2], [414, 736, 3], [375, 667, 2],
];
for (const [w, h, d] of IPHONE) {
  const lato = Math.round(w * 0.55);
  const corpo = `
    <div style="position:fixed;inset:0;background:radial-gradient(120% 80% at 50% 20%, #24325a 0%, #141c36 50%, #0a0f1f 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(w * 0.04)}px;font-family:Georgia,'Liberation Serif',serif">
      <div style="width:${lato}px;height:${lato}px;border-radius:${Math.round(lato * 0.22)}px;overflow:hidden;box-shadow:0 12px 40px rgb(0 0 0 / .5)">${disegno(1)}</div>
      <div style="font-size:${Math.round(w * 0.19)}px;font-weight:700;line-height:1;color:#e9c766;letter-spacing:-.02em">9½</div>
    </div>`;
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: d });
  await p.setContent(pagina(corpo));
  await p.screenshot({ path: `${CARTELLA}avvio-${w * d}x${h * d}.jpg`, type: 'jpeg', quality: 85 });
  await p.close();
  console.log('creata', `avvio-${w * d}x${h * d}.jpg`);
}

await browser.close();
// Stampa i tag per index.html (le schermate di avvio iPhone vanno elencate una per una).
console.log('\n' + IPHONE.map(([w, h, d]) =>
  `    <link rel="apple-touch-startup-image" media="(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d}) and (orientation: portrait)" href="/icone/avvio-${w * d}x${h * d}.jpg" />`).join('\n'));
