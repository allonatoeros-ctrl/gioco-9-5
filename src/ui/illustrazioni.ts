// Illustrazioni delle carte (grafica). Ogni disegno è un SVG: si vede nitido a ogni dimensione.
// Carta 0: dal disegno a matita di Eros (uomo a torso nudo, braccia incrociate).

const CARTA_0 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 0: uomo a torso nudo a braccia incrociate">
  <defs>
    <clipPath id="z0-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath>
  </defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#z0-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="250" cy="340" r="200" fill="#efdcb4" stroke="none"/>
    <!-- gambe -->
    <path d="M182 585 L196 690 L242 690 L244 585 Z" fill="#f1c7a0"/>
    <path d="M318 585 L304 690 L258 690 L256 585 Z" fill="#f1c7a0"/>
    <!-- pantaloncini -->
    <path d="M170 470 Q250 486 330 470 L330 480 L170 480 Z" fill="#dba67f" stroke="none"/>
    <path d="M168 478 L332 478 L350 598 L262 604 L250 540 L238 604 L150 598 Z" fill="#1f5d3a"/>
    <path d="M168 478 L332 478 L334 496 L166 496 Z" fill="#17482d"/>
    <path d="M250 498 q-20 4 -22 18 q14 -4 22 -14 q8 10 22 14 q-2 -14 -22 -18 M244 505 l-6 26 M256 505 l6 26" fill="none" stroke="#fffdf5" stroke-width="3"/>
    <!-- collo -->
    <path d="M226 240 L226 296 L274 296 L274 240 Z" fill="#e6b48a"/>
    <!-- busto -->
    <path d="M152 332 Q152 302 192 296 L224 286 Q250 300 276 286 L308 296 Q348 302 348 332 L344 420 L332 482 L168 482 L156 420 Z" fill="#f1c7a0"/>
    <path d="M226 288 Q250 304 274 288" fill="none" stroke-width="3"/>
    <path d="M196 392 Q222 404 246 388 M254 388 Q278 404 304 392" fill="none" stroke-width="3" opacity=".7"/>
    <path d="M250 330 L250 386" fill="none" stroke-width="3" opacity=".6"/>
    <!-- X sui capezzoli -->
    <path d="M208 350 l22 22 M230 350 l-22 22 M270 350 l22 22 M292 350 l-22 22" stroke="#b3401d" stroke-width="6"/>
    <path d="M247 466 q3 4 6 0" fill="none" stroke-width="3"/>
    <!-- braccia: parte alta -->
    <path d="M154 312 Q122 328 124 392 Q126 446 166 458 L204 446 Q186 400 192 340 Z" fill="#f1c7a0"/>
    <path d="M346 312 Q378 328 376 392 Q374 446 334 458 L296 446 Q314 400 308 340 Z" fill="#f1c7a0"/>
    <!-- avambraccio dietro (destro, va a sinistra) -->
    <path d="M362 418 Q300 396 200 402 L196 432 Q290 428 350 452 Z" fill="#e9bb94"/>
    <!-- avambraccio davanti (sinistro, va a destra) -->
    <path d="M140 430 Q220 420 306 424 L306 458 Q220 474 160 466 Q132 456 140 430 Z" fill="#f1c7a0"/>
    <path d="M206 438 q10 8 24 6" fill="none" stroke-width="2.5" opacity=".6"/>
    <path d="M300 424 Q322 426 322 441 Q322 456 300 458 Z" fill="#f1c7a0"/>
    <path d="M304 436 q10 1 14 4 M304 447 q10 0 14 -3" fill="none" stroke-width="2.5"/>
    <path d="M198 404 q-8 -2 -10 6 q-2 8 8 10" fill="#e9bb94" stroke-width="3"/>
    <!-- orecchie -->
    <ellipse cx="194" cy="200" rx="13" ry="19" fill="#e6b48a"/>
    <ellipse cx="306" cy="200" rx="13" ry="19" fill="#e6b48a"/>
    <!-- testa -->
    <ellipse cx="250" cy="196" rx="56" ry="66" fill="#f1c7a0"/>
    <!-- barba -->
    <path d="M196 206 Q198 262 250 266 Q302 262 304 206 Q298 238 278 240 Q262 228 250 232 Q236 228 222 240 Q202 238 196 206 Z" fill="#6b4226" stroke="none" opacity=".75"/>
    <path d="M194 206 Q196 264 250 264 Q304 264 306 206" fill="none"/>
    <!-- capelli -->
    <path d="M192 196 Q182 128 244 120 Q316 114 312 192 Q306 160 286 148 Q276 176 238 168 Q256 160 258 146 Q232 170 204 166 Q198 178 192 196 Z" fill="#6b4226"/>
    <!-- sopracciglia, occhi, naso, bocca -->
    <path d="M218 176 L240 180 M262 182 L286 172" fill="none" stroke-width="5"/>
    <circle cx="230" cy="194" r="5" fill="#3a2a20" stroke="none"/>
    <circle cx="272" cy="194" r="5" fill="#3a2a20" stroke="none"/>
    <path d="M254 196 L242 220 L258 220" fill="none" stroke-width="3.5"/>
    <path d="M230 238 Q250 248 272 232" fill="none" stroke-width="4"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" text-anchor="middle">
    <text x="420" y="118" font-size="96">0</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">0</text>
  </g>
</svg>
`;

/** Illustrazione di una carta numerica, se esiste (per ora solo lo 0). */
export function illustrazioneNumero(valore: number): string | undefined {
  if (valore === 0) return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(CARTA_0);
  return undefined;
}
