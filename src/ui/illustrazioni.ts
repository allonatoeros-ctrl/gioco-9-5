// Illustrazioni delle carte (grafica), dai disegni a matita di Eros.
// Ogni disegno è un SVG: si vede nitido a ogni dimensione.

import type { Carta } from '../engine';

/** 0: uomo a torso nudo, braccia incrociate. */
const NUMERI_0 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 0: uomo a torso nudo a braccia incrociate">
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
</svg>`;

/** Mezzo (0,5): mezza anguria sfacciata (inventata da Claude: manca il disegno). */
const MEZZO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta Mezzo: mezza anguria sfacciata con un cucchiaio, l'altra metà è già finita">
  <defs><clipPath id="mz-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#mz-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="250" cy="330" r="200" fill="#f4d9cf" stroke="none"/>
    <!-- tovaglia -->
    <path d="M30 520 L470 520 L470 670 L30 670 Z" fill="#fffdf5" stroke="none"/>
    <g fill="#e4b3a8" stroke="none"><rect x="30" y="520" width="30" height="30"/><rect x="90" y="520" width="30" height="30"/><rect x="150" y="520" width="30" height="30"/><rect x="210" y="520" width="30" height="30"/><rect x="270" y="520" width="30" height="30"/><rect x="330" y="520" width="30" height="30"/><rect x="390" y="520" width="30" height="30"/><rect x="450" y="520" width="30" height="30"/><rect x="30" y="580" width="30" height="30"/><rect x="90" y="580" width="30" height="30"/><rect x="150" y="580" width="30" height="30"/><rect x="210" y="580" width="30" height="30"/><rect x="270" y="580" width="30" height="30"/><rect x="330" y="580" width="30" height="30"/><rect x="390" y="580" width="30" height="30"/><rect x="450" y="580" width="30" height="30"/><rect x="30" y="640" width="30" height="30"/><rect x="90" y="640" width="30" height="30"/><rect x="150" y="640" width="30" height="30"/><rect x="210" y="640" width="30" height="30"/><rect x="270" y="640" width="30" height="30"/><rect x="330" y="640" width="30" height="30"/><rect x="390" y="640" width="30" height="30"/><rect x="450" y="640" width="30" height="30"/><rect x="60" y="550" width="30" height="30"/><rect x="120" y="550" width="30" height="30"/><rect x="180" y="550" width="30" height="30"/><rect x="240" y="550" width="30" height="30"/><rect x="300" y="550" width="30" height="30"/><rect x="360" y="550" width="30" height="30"/><rect x="420" y="550" width="30" height="30"/><rect x="60" y="610" width="30" height="30"/><rect x="120" y="610" width="30" height="30"/><rect x="180" y="610" width="30" height="30"/><rect x="240" y="610" width="30" height="30"/><rect x="300" y="610" width="30" height="30"/><rect x="360" y="610" width="30" height="30"/><rect x="420" y="610" width="30" height="30"/></g>
    <!-- piatto -->
    <ellipse cx="250" cy="540" rx="190" ry="40" fill="#fffdf5"/>
    <ellipse cx="250" cy="534" rx="150" ry="26" fill="#f1ecdc" stroke-width="3"/>
    <!-- mezza anguria -->
    <path d="M90 520 A160 160 0 0 1 410 520 Z" fill="#4d7a3a"/>
    <path d="M106 520 A144 144 0 0 1 394 520 Z" fill="#cfe5a6" stroke="none"/>
    <path d="M118 520 A132 132 0 0 1 382 520 Z" fill="#e0524a" stroke="none"/>
    <path d="M90 520 L410 520" stroke-width="4"/>
    <g fill="#2a201a" stroke="none"><ellipse cx="160" cy="470" rx="4" ry="7" transform="rotate(-30 160 470)"/><ellipse cx="200" cy="430" rx="4" ry="7" transform="rotate(-20 200 430)"/><ellipse cx="330" cy="440" rx="4" ry="7" transform="rotate(20 330 440)"/><ellipse cx="350" cy="480" rx="4" ry="7" transform="rotate(30 350 480)"/><ellipse cx="140" cy="500" rx="4" ry="7" transform="rotate(-40 140 500)"/><ellipse cx="370" cy="505" rx="4" ry="7" transform="rotate(40 370 505)"/><ellipse cx="300" cy="410" rx="4" ry="7" transform="rotate(10 300 410)"/></g>
    <!-- faccia -->
    <path d="M206 452 q14 -12 28 0" fill="none" stroke-width="5"/>
    <circle cx="282" cy="452" r="12" fill="#fffdf5" stroke-width="3"/><circle cx="284" cy="454" r="5" fill="#3a2a20" stroke="none"/>
    <path d="M226 484 Q256 504 286 480" fill="none" stroke-width="4"/>
    <path d="M262 492 Q268 510 280 500 L280 486 Z" fill="#f2b8b0" stroke-width="3"/>
    <!-- cucchiaio piantato -->
    <path d="M320 440 L376 300" stroke="#9aa3ad" stroke-width="10"/>
    <path d="M320 440 L376 300" stroke="#3a2a20" stroke-width="3" opacity=".4"/>
    <ellipse cx="382" cy="288" rx="16" ry="24" fill="#c8cfd6" transform="rotate(22 382 288)"/>
    <!-- buccia avanzata dell'altra metà -->
    <path d="M60 600 Q110 570 170 600 Q110 590 60 610 Z" fill="#4d7a3a" stroke-width="3"/>
    <path d="M320 616 Q380 590 440 618 Q380 606 320 626 Z" fill="#4d7a3a" stroke-width="3"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="112" font-size="80">½</text>
    <text x="80" y="112" font-size="80" transform="rotate(180 250 350)">½</text>
  </g>
</svg>`;

/** 1: ragazza ciclope. */
const NUMERI_1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 1: ragazza ciclope con un occhio solo e l'orecchino a cuore">
  <defs><clipPath id="n1-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n1-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="250" cy="330" r="190" fill="#efdcb4" stroke="none"/>
    <!-- gambe -->
    <path d="M206 560 L200 690 L244 690 L248 560 Z M256 560 L258 690 L300 690 L294 560 Z" fill="#f1c7a0"/>
    <!-- braccia dietro la schiena -->
    <path d="M168 320 Q150 400 176 470 L200 460 Q186 400 196 330 Z M332 320 Q350 400 324 470 L300 460 Q314 400 304 330 Z" fill="#e6b48a"/>
    <!-- collo e spalle -->
    <path d="M232 240 L232 300 L268 300 L268 240 Z" fill="#e6b48a"/>
    <path d="M170 330 Q176 296 232 292 L268 292 Q324 296 330 330 L320 380 L180 380 Z" fill="#f1c7a0"/>
    <!-- vestito stracciato -->
    <path d="M178 330 L322 330 L316 430 Q342 520 352 580 L330 562 L318 588 L300 566 L282 592 L266 568 L250 594 L234 568 L218 592 L200 566 L182 588 L170 562 L150 580 Q160 520 184 430 Z" fill="#7a4fa0"/>
    <path d="M196 330 L196 300 M304 330 L304 300" stroke="#7a4fa0" stroke-width="8"/>
    <path d="M200 420 q50 14 100 0 M210 480 q40 10 80 0" fill="none" stroke="#5e3a7f" stroke-width="3"/>
    <!-- testa -->
    <ellipse cx="250" cy="200" rx="54" ry="64" fill="#f1c7a0"/>
    <path d="M196 196 Q186 120 250 116 Q318 118 306 200 Q296 150 270 140 Q236 160 204 150 Q198 170 196 196 Z" fill="#3d2b22"/>
    <path d="M300 150 Q340 200 322 290 Q312 240 302 200 Z" fill="#3d2b22"/>
    <!-- occhio unico -->
    <ellipse cx="250" cy="194" rx="28" ry="20" fill="#fffdf5"/>
    <circle cx="250" cy="196" r="11" fill="#2f6f9f" stroke-width="3"/><circle cx="250" cy="196" r="5" fill="#1d1d1b" stroke="none"/>
    <path d="M220 170 Q250 156 280 170" fill="none" stroke-width="4"/>
    <path d="M222 182 l-6 -6 M232 176 l-3 -8 M268 176 l3 -8 M278 182 l6 -6" stroke-width="3"/>
    <path d="M250 214 L246 230 L254 230" fill="none" stroke-width="3"/>
    <path d="M228 242 Q250 260 272 242 Q250 250 228 242 Z" fill="#c4452a" stroke-width="3"/>
    <!-- orecchino a cuore -->
    <path d="M300 214 L300 236" stroke-width="2.5"/>
    <path d="M300 252 l-9 -10 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 Z" fill="#b3401d" stroke-width="2.5"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">1</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">1</text>
  </g>
</svg>`;

/** 2: ragazza timida. */
const NUMERI_2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 2: ragazza timida e arrossita che si copre col braccio">
  <defs><clipPath id="n2-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n2-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="250" cy="330" r="190" fill="#f4d9cf" stroke="none"/>
    <path d="M206 520 L196 690 L246 690 L250 540 Z M294 520 L304 690 L254 690 L250 540 Z" fill="#f1c7a0"/>
    <!-- capelli dietro -->
    <path d="M186 180 Q160 300 150 360 L200 330 Z M314 180 Q340 300 352 360 L300 330 Z" fill="#e2b13c"/>
    <!-- busto -->
    <path d="M232 240 L232 300 L268 300 L268 240 Z" fill="#e6b48a"/>
    <path d="M178 330 Q180 296 232 292 L268 292 Q320 296 322 330 L312 420 Q300 460 316 520 L184 520 Q200 460 188 420 Z" fill="#f1c7a0"/>
    <circle cx="250" cy="452" r="3" fill="#3a2a20" stroke="none"/>
    <!-- costume -->
    <path d="M190 494 Q250 486 310 494 L308 520 Q280 530 262 566 L238 566 Q220 530 192 520 Z" fill="#b3401d"/>
    <!-- braccia che coprono -->
    <path d="M178 330 Q160 380 176 420 L196 420 Q188 380 196 340 Z" fill="#e6b48a"/>
    <path d="M176 404 Q240 380 306 372 Q326 372 324 390 Q316 404 296 404 Q240 410 192 432 Q170 432 176 404 Z" fill="#f1c7a0"/>
    <path d="M322 330 Q336 362 322 380" fill="none"/>
    <path d="M196 352 Q250 336 304 352 L304 380 Q250 368 196 384 Z" fill="#f1c7a0" stroke="none"/>
    <path d="M200 366 Q250 352 300 366" fill="none" stroke-width="3" opacity=".5"/>
    <!-- testa -->
    <ellipse cx="250" cy="200" rx="52" ry="62" fill="#f1c7a0"/>
    <path d="M196 200 Q184 120 252 116 Q318 118 306 200 Q300 154 276 138 Q240 164 196 200 Z" fill="#e2b13c"/>
    <ellipse cx="228" cy="200" rx="11" ry="13" fill="#fffdf5" stroke-width="3"/><circle cx="231" cy="202" r="6" fill="#1d1d1b" stroke="none"/>
    <ellipse cx="274" cy="200" rx="11" ry="13" fill="#fffdf5" stroke-width="3"/><circle cx="277" cy="202" r="6" fill="#1d1d1b" stroke="none"/>
    <path d="M214 182 q12 -6 24 0 M262 182 q12 -6 24 0" fill="none" stroke-width="3"/>
    <ellipse cx="218" cy="226" rx="12" ry="7" fill="#e89c86" stroke="none"/><ellipse cx="286" cy="226" rx="12" ry="7" fill="#e89c86" stroke="none"/>
    <path d="M216 222 l6 -4 M224 224 l6 -4 M280 222 l6 -4 M288 224 l6 -4" stroke="#c4645a" stroke-width="2"/>
    <path d="M252 214 L250 226" stroke-width="3"/>
    <path d="M238 242 q12 6 24 -2" fill="none" stroke-width="3"/>
    <circle cx="198" cy="218" r="6" fill="#3a2a20" stroke="none"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">2</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">2</text>
  </g>
</svg>`;

/** 3: idra a tre teste. */
const NUMERI_3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 3: idra a tre teste con le fauci spalancate">
  <defs><clipPath id="n3-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n3-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="250" cy="360" r="200" fill="#e3e6c8" stroke="none"/>
    <!-- coda -->
    <path d="M330 600 Q450 600 440 500 Q436 450 400 460 Q420 520 360 560 Z" fill="#7fae5f"/>
    <!-- corpo -->
    <path d="M150 640 Q110 520 170 430 Q230 360 300 380 Q380 400 380 520 Q380 620 300 650 Z" fill="#7fae5f"/>
    <path d="M220 420 Q300 420 320 520 Q320 600 270 640 Q200 620 200 520 Q200 460 220 420 Z" fill="#d9d39a"/>
    <path d="M214 470 h90 M206 510 h108 M206 550 h110 M212 590 h96" stroke="#b3a96a" stroke-width="3"/>
    <!-- zampe -->
    <path d="M170 640 Q160 600 196 590 Q224 600 214 650 Z M300 650 Q296 600 330 596 Q356 610 340 660 Z" fill="#5f8f4a"/>
    <path d="M250 520 Q230 540 244 560 L256 552 Q248 540 262 526 Z" fill="#5f8f4a"/>
    <!-- colli -->
    <path d="M200 440 Q120 380 150 280 L196 300 Q180 370 240 420 Z" fill="#7fae5f"/>
    <path d="M240 420 Q230 300 250 210 L292 216 Q276 310 290 410 Z" fill="#7fae5f"/>
    <path d="M290 410 Q360 360 350 300 L392 290 Q410 380 320 450 Z" fill="#7fae5f"/>
    <g transform="translate(160 250) rotate(10)">
      <path d="M-34 -30 L-26 -62 L-14 -36 L-2 -70 L8 -36 L22 -60 L26 -28" fill="#5f8f4a"/>
      <path d="M-40 -20 Q-40 -46 0 -46 Q44 -46 52 -10 L60 30 Q20 50 -20 40 Q-44 30 -40 -20 Z" fill="#7fae5f"/>
      <path d="M-30 6 L58 10 L54 34 Q10 52 -22 36 Z" fill="#8c2a1c"/>
      <path d="M-26 8 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12" fill="#fffdf5" stroke-width="2.5"/>
      <path d="M-20 36 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10" fill="#fffdf5" stroke-width="2.5"/>
      <ellipse cx="2" cy="-18" rx="12" ry="9" fill="#e2b13c" stroke-width="3"/><path d="M2 -26 L2 -10" stroke-width="4"/>
      <path d="M-14 -32 L18 -24" stroke-width="5"/>
      <circle cx="40" cy="-8" r="3" fill="#3a2a20" stroke="none"/>
    </g>
    <g transform="translate(270 180) rotate(-8)">
      <path d="M-34 -30 L-26 -62 L-14 -36 L-2 -70 L8 -36 L22 -60 L26 -28" fill="#5f8f4a"/>
      <path d="M-40 -20 Q-40 -46 0 -46 Q44 -46 52 -10 L60 30 Q20 50 -20 40 Q-44 30 -40 -20 Z" fill="#7fae5f"/>
      <path d="M-30 6 L58 10 L54 34 Q10 52 -22 36 Z" fill="#8c2a1c"/>
      <path d="M-26 8 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12" fill="#fffdf5" stroke-width="2.5"/>
      <path d="M-20 36 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10" fill="#fffdf5" stroke-width="2.5"/>
      <ellipse cx="2" cy="-18" rx="12" ry="9" fill="#e2b13c" stroke-width="3"/><path d="M2 -26 L2 -10" stroke-width="4"/>
      <path d="M-14 -32 L18 -24" stroke-width="5"/>
      <circle cx="40" cy="-8" r="3" fill="#3a2a20" stroke="none"/>
    </g>
    <g transform="translate(380 270) rotate(14)">
      <path d="M-34 -30 L-26 -62 L-14 -36 L-2 -70 L8 -36 L22 -60 L26 -28" fill="#5f8f4a"/>
      <path d="M-40 -20 Q-40 -46 0 -46 Q44 -46 52 -10 L60 30 Q20 50 -20 40 Q-44 30 -40 -20 Z" fill="#7fae5f"/>
      <path d="M-30 6 L58 10 L54 34 Q10 52 -22 36 Z" fill="#8c2a1c"/>
      <path d="M-26 8 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12" fill="#fffdf5" stroke-width="2.5"/>
      <path d="M-20 36 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10" fill="#fffdf5" stroke-width="2.5"/>
      <ellipse cx="2" cy="-18" rx="12" ry="9" fill="#e2b13c" stroke-width="3"/><path d="M2 -26 L2 -10" stroke-width="4"/>
      <path d="M-14 -32 L18 -24" stroke-width="5"/>
      <circle cx="40" cy="-8" r="3" fill="#3a2a20" stroke="none"/>
    </g>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">3</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">3</text>
  </g>
</svg>`;

/** 4: mucca boxer. */
const NUMERI_4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 4: mucca in piedi con un guantone da boxe che muggisce MHUU">
  <defs><clipPath id="n4-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n4-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="260" cy="360" r="200" fill="#e3ecd6" stroke="none"/>
    <!-- zampe -->
    <path d="M196 540 L188 640 L230 640 L234 540 Z M300 540 L304 640 L346 640 L338 540 Z" fill="#fffdf5"/>
    <path d="M186 630 L232 630 L234 660 L182 660 Z M302 630 L348 630 L350 660 L298 660 Z" fill="#2a2522"/>
    <path d="M190 580 q14 -10 26 4 q-6 18 -24 10 Z M320 600 q14 -10 22 6 q-10 12 -22 4 Z" fill="#2a2522" stroke="none"/>
    <!-- corpo -->
    <path d="M190 330 Q200 290 260 290 Q330 290 340 340 L350 470 Q350 560 270 560 Q180 560 180 470 Z" fill="#fffdf5"/>
    <path d="M300 300 Q350 320 340 400 Q310 380 300 340 Z M186 380 Q220 400 204 450 Q184 440 182 410 Z M300 470 q30 10 40 50 q-30 10 -46 -20 Z" fill="#2a2522" stroke="none"/>
    <!-- mammella -->
    <ellipse cx="248" cy="470" rx="62" ry="58" fill="#f2b8b0"/>
    <path d="M222 470 l-4 16 l8 0 Z M270 470 l-4 16 l8 0 Z M226 506 l-4 16 l8 0 Z M266 506 l-4 16 l8 0 Z" fill="#e48f84" stroke-width="2.5"/>
    <!-- braccio con guantone -->
    <path d="M200 340 Q160 340 150 300 L176 290 Q186 316 210 316 Z" fill="#fffdf5"/>
    <circle cx="150" cy="272" r="34" fill="#b3401d"/>
    <path d="M128 260 q22 -18 44 0 M136 296 l26 -6" fill="none" stroke-width="3"/>
    <!-- braccio sul fianco -->
    <path d="M334 340 Q380 360 378 400 Q376 430 340 430 L340 410 Q358 406 356 392 Q352 370 328 362 Z" fill="#fffdf5"/>
    <path d="M330 420 L350 420 L350 440 L330 440 Z" fill="#2a2522"/>
    <!-- testa -->
    <path d="M200 140 Q170 110 160 130 Q170 160 204 166 Z" fill="#2a2522"/>
    <path d="M330 140 Q360 110 370 130 Q360 160 326 166 Z" fill="#2a2522"/>
    <path d="M222 118 Q210 80 230 70 Q224 96 238 116 Z M310 118 Q322 80 302 70 Q308 96 294 116 Z" fill="#fffdf5"/>
    <path d="M206 130 Q266 100 326 130 Q340 200 310 236 L220 236 Q192 200 206 130 Z" fill="#fffdf5"/>
    <path d="M206 130 Q240 116 262 120 Q256 170 230 200 Q204 190 206 130 Z" fill="#2a2522"/>
    <path d="M240 110 l6 -14 l6 12 l8 -14 l4 14 l8 -10 l0 14" fill="none" stroke-width="3"/>
    <circle cx="238" cy="166" r="9" fill="#fffdf5" stroke-width="3"/><circle cx="240" cy="167" r="4" fill="#3a2a20" stroke="none"/>
    <circle cx="292" cy="166" r="9" fill="#fffdf5" stroke-width="3"/><circle cx="294" cy="167" r="4" fill="#3a2a20" stroke="none"/>
    <ellipse cx="266" cy="232" rx="56" ry="38" fill="#f2b8b0"/>
    <ellipse cx="246" cy="222" rx="7" ry="9" fill="#3a2a20" stroke="none"/><ellipse cx="286" cy="222" rx="7" ry="9" fill="#3a2a20" stroke="none"/>
    <path d="M232 250 Q266 274 300 250 Q266 262 232 250 Z" fill="#8c2a1c" stroke-width="3"/>
    <path d="M104 224 L214 236 L125 232 Z" fill="#fffdf5" stroke-width="3.5"/><ellipse cx="120" cy="160" rx="52" ry="80" fill="#fffdf5" stroke-width="3.5"/><path d="M108 218 L121 226" stroke="#fffdf5" stroke-width="8"/><text x="120" y="124" font-size="36" font-family="'Comic Sans MS','Chalkboard SE','Marker Felt',sans-serif" font-weight="700" fill="#3a2a20" stroke="none" text-anchor="middle">M</text><text x="120" y="158" font-size="36" font-family="'Comic Sans MS','Chalkboard SE','Marker Felt',sans-serif" font-weight="700" fill="#3a2a20" stroke="none" text-anchor="middle">H</text><text x="120" y="192" font-size="36" font-family="'Comic Sans MS','Chalkboard SE','Marker Felt',sans-serif" font-weight="700" fill="#3a2a20" stroke="none" text-anchor="middle">U</text><text x="120" y="227" font-size="36" font-family="'Comic Sans MS','Chalkboard SE','Marker Felt',sans-serif" font-weight="700" fill="#3a2a20" stroke="none" text-anchor="middle">U</text>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">4</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">4</text>
  </g>
</svg>`;

/** 5: insegna MOTEL. */
const NUMERI_5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 5: insegna verticale MOTEL con cinque finestrelle">
  <defs><clipPath id="n5-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n5-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#2b3a55" stroke="none"/>
    <circle cx="70" cy="80" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="120" cy="150" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="400" cy="70" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="440" cy="180" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="90" cy="300" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="430" cy="320" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="60" cy="420" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="450" cy="440" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="360" cy="120" r="2.5" fill="#fff4c2" stroke="none"/><circle cx="150" cy="60" r="2.5" fill="#fff4c2" stroke="none"/>
    <circle cx="250" cy="330" r="190" fill="#ff6b4a" opacity=".12" stroke="none"/>
    <!-- insegna -->
    <path d="M168 100 L332 100 L352 80 L188 80 Z" fill="#9aa3ad"/>
    <path d="M332 100 L352 80 L352 520 L332 540 Z" fill="#6c757e"/>
    <rect x="168" y="100" width="164" height="440" fill="#c8cfd6"/>
    <rect x="182" y="114" width="136" height="412" fill="#3a4250" stroke-width="3"/>
    <text x="256" y="176" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#7a1f12" stroke="none" text-anchor="middle">M</text><text x="250" y="170" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#ff6b4a" stroke="#fff4c2" stroke-width="2.5" text-anchor="middle">M</text><text x="256" y="252" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#7a1f12" stroke="none" text-anchor="middle">O</text><text x="250" y="246" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#ff6b4a" stroke="#fff4c2" stroke-width="2.5" text-anchor="middle">O</text><text x="256" y="328" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#7a1f12" stroke="none" text-anchor="middle">T</text><text x="250" y="322" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#ff6b4a" stroke="#fff4c2" stroke-width="2.5" text-anchor="middle">T</text><text x="256" y="404" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#7a1f12" stroke="none" text-anchor="middle">E</text><text x="250" y="398" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#ff6b4a" stroke="#fff4c2" stroke-width="2.5" text-anchor="middle">E</text><text x="256" y="480" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#7a1f12" stroke="none" text-anchor="middle">L</text><text x="250" y="474" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#ff6b4a" stroke="#fff4c2" stroke-width="2.5" text-anchor="middle">L</text>
    <!-- edificio -->
    <path d="M50 540 L370 540 L390 520 L70 520 Z" fill="#9aa3ad"/>
    <path d="M50 540 L370 540 L370 640 L50 640 Z" fill="#c8cfd6"/>
    <path d="M370 540 L390 520 L390 620 L370 640 Z" fill="#6c757e"/>
    <rect x="66" y="560" width="50" height="50" rx="4" fill="#fff4c2" stroke-width="3"/><circle cx="91" cy="590" r="17" fill="#f0a9a0" stroke-width="3"/><circle cx="91" cy="594" r="4" fill="#d97d72" stroke="none"/><path d="M66 560 L116 560 L116 572 L66 572 Z" fill="#b3401d" stroke-width="3"/><rect x="124" y="560" width="50" height="50" rx="4" fill="#fff4c2" stroke-width="3"/><circle cx="149" cy="590" r="17" fill="#f0a9a0" stroke-width="3"/><circle cx="149" cy="594" r="4" fill="#d97d72" stroke="none"/><path d="M124 560 L174 560 L174 572 L124 572 Z" fill="#b3401d" stroke-width="3"/><rect x="182" y="560" width="50" height="50" rx="4" fill="#fff4c2" stroke-width="3"/><circle cx="207" cy="590" r="17" fill="#f0a9a0" stroke-width="3"/><circle cx="207" cy="594" r="4" fill="#d97d72" stroke="none"/><path d="M182 560 L232 560 L232 572 L182 572 Z" fill="#b3401d" stroke-width="3"/><rect x="240" y="560" width="50" height="50" rx="4" fill="#fff4c2" stroke-width="3"/><circle cx="265" cy="590" r="17" fill="#f0a9a0" stroke-width="3"/><circle cx="265" cy="594" r="4" fill="#d97d72" stroke="none"/><path d="M240 560 L290 560 L290 572 L240 572 Z" fill="#b3401d" stroke-width="3"/><rect x="298" y="560" width="50" height="50" rx="4" fill="#fff4c2" stroke-width="3"/><circle cx="323" cy="590" r="17" fill="#f0a9a0" stroke-width="3"/><circle cx="323" cy="594" r="4" fill="#d97d72" stroke="none"/><path d="M298 560 L348 560 L348 572 L298 572 Z" fill="#b3401d" stroke-width="3"/>
    <path d="M30 640 L470 640 L470 670 L30 670 Z" fill="#4a4f57" stroke="none"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#ff6b4a" stroke="#2b3a55" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">5</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">5</text>
  </g>
</svg>`;

/** 6: suricato col latte. */
const NUMERI_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 6: suricato con gli occhialoni che fa merenda con biscotto e tazza di latte">
  <defs><clipPath id="n6-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n6-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="250" cy="360" r="200" fill="#e9e0c6" stroke="none"/>
    <!-- coda -->
    <path d="M330 470 Q400 420 380 300 Q376 260 396 230 Q410 280 404 330 Q420 450 344 500 Z" fill="#c9a273"/>
    <path d="M396 230 Q410 280 404 300 L384 296 Q382 260 396 230 Z" fill="#3a2a20" stroke="none"/>
    <!-- zampe posteriori -->
    <path d="M140 560 Q120 520 170 490 L210 540 Q170 570 140 560 Z" fill="#c9a273"/>
    <path d="M360 560 Q380 520 330 490 L290 540 Q330 570 360 560 Z" fill="#c9a273"/>
    <circle cx="150" cy="548" r="7" fill="#3a2a20" stroke="none"/><circle cx="350" cy="548" r="7" fill="#3a2a20" stroke="none"/>
    <!-- corpo -->
    <path d="M190 290 Q170 360 176 460 Q182 560 250 566 Q318 560 324 460 Q330 360 310 290 Z" fill="#c9a273"/>
    <path d="M216 320 Q206 420 214 520 Q250 540 286 520 Q294 420 284 320 Z" fill="#ead6b0" stroke="none"/>
    <path d="M226 520 q-6 -20 6 -26 M274 520 q6 -20 -6 -26" fill="none" stroke-width="3"/>
    <!-- zampe anteriori con biscotto -->
    <path d="M196 330 Q186 380 214 400 L230 386 Q212 370 216 340 Z" fill="#a8814f"/>
    <circle cx="226" cy="388" r="22" fill="#b07a3c"/><circle cx="220" cy="382" r="3" fill="#5a3a1c" stroke="none"/><circle cx="232" cy="394" r="3" fill="#5a3a1c" stroke="none"/><circle cx="232" cy="378" r="3" fill="#5a3a1c" stroke="none"/>
    <path d="M244 372 a22 22 0 0 1 4 18 l-8 -4 Z" fill="#e9e0c6" stroke="none"/>
    <path d="M304 330 Q316 380 286 400 L274 386 Q290 370 286 340 Z" fill="#a8814f"/>
    <path d="M270 392 q10 10 22 0" fill="none" stroke-width="3"/>
    <!-- testa -->
    <ellipse cx="250" cy="240" rx="62" ry="58" fill="#c9a273"/>
    <path d="M190 220 l-14 -10 l10 22 Z M310 220 l14 -10 l-10 22 Z" fill="#a8814f"/>
    <ellipse cx="250" cy="276" rx="34" ry="26" fill="#ead6b0"/>
    <ellipse cx="250" cy="262" rx="10" ry="7" fill="#3a2a20" stroke="none"/>
    <path d="M236 284 Q250 296 264 284" fill="none" stroke-width="3"/>
    <path d="M244 288 L244 300 L256 300 L256 288 Z" fill="#fffdf5" stroke-width="2.5"/>
    <path d="M222 274 l-30 -4 M222 282 l-30 4 M278 274 l30 -4 M278 282 l30 4" stroke-width="2"/>
    <path d="M232 186 l-4 -14 M248 182 l0 -16 M264 186 l4 -14" stroke-width="3"/>
    <!-- occhialoni -->
    <path d="M190 226 L310 226" stroke="#5a3a1c" stroke-width="10"/>
    <circle cx="222" cy="226" r="28" fill="#cfe0e6" stroke="#5a3a1c" stroke-width="8"/>
    <circle cx="278" cy="226" r="28" fill="#cfe0e6" stroke="#5a3a1c" stroke-width="8"/>
    <path d="M210 214 l10 -6 M206 228 l20 -14 M266 214 l10 -6 M262 228 l20 -14" stroke="#ffffff" stroke-width="4"/>
    <!-- tazza di latte -->
    <path d="M190 560 L310 560 L304 650 Q250 664 196 650 Z" fill="#fffdf5"/>
    <path d="M308 580 Q346 580 344 610 Q342 636 304 632" fill="none" stroke-width="8"/>
    <ellipse cx="250" cy="560" rx="60" ry="12" fill="#ffffff"/>
    <text x="250" y="618" font-family="'Comic Sans MS','Chalkboard SE',sans-serif" font-weight="700" font-size="30" fill="#2f6f9f" stroke="none" text-anchor="middle">MILK</text>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">6</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">6</text>
  </g><g fill="#b3401d" stroke="#fffdf5" stroke-width="3"><rect x="398" y="128" width="44" height="8" rx="3"/><rect x="58" y="128" width="44" height="8" rx="3" transform="rotate(180 250 350)"/></g>
</svg>`;

/** 7: ragazzo e sette nanetti. */
const NUMERI_7 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 7: ragazzo sorridente in mezzo a sette nanetti a forma di tetta col cappello a punta">
  <defs><clipPath id="n7-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n7-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="250" cy="330" r="200" fill="#e3ecd6" stroke="none"/>
    <path d="M30 560 Q250 520 470 560 L470 670 L30 670 Z" fill="#a9c98a"/>
    <!-- ragazzo -->
    <path d="M200 260 Q210 230 250 228 Q290 230 300 260 L310 420 L190 420 Z" fill="#2f6f9f"/>
    <path d="M226 232 L230 420 M274 232 L270 420" stroke="#1f4f75" stroke-width="10"/>
    <path d="M236 240 L264 240 L262 360 L238 360 Z" fill="#fffdf5" stroke-width="3"/>
    <g fill="#3a2a20" stroke="none"><circle cx="250" cy="270" r="3"/><circle cx="250" cy="300" r="3"/><circle cx="250" cy="330" r="3"/></g>
    <path d="M232 236 L250 250 L268 236 L268 226 L250 238 L232 226 Z" fill="#b3401d" stroke-width="3"/>
    <ellipse cx="250" cy="178" rx="46" ry="52" fill="#f1c7a0"/>
    <path d="M204 170 Q196 112 252 110 Q306 112 298 172 Q290 140 270 134 Q264 150 240 146 Q252 138 250 128 Q228 148 206 150 Z" fill="#6b4226"/>
    <path d="M226 172 q8 -8 16 0 M258 172 q8 -8 16 0" fill="none" stroke-width="4"/>
    <path d="M226 196 Q250 226 274 196 Z" fill="#8c2a1c" stroke-width="3"/>
    <path d="M232 198 L268 198 L266 204 L234 204 Z" fill="#fffdf5" stroke="none"/>
    <ellipse cx="220" cy="196" rx="8" ry="5" fill="#e89c86" stroke="none"/><ellipse cx="280" cy="196" rx="8" ry="5" fill="#e89c86" stroke="none"/>
    <!-- nanetti -->
    <g transform="translate(130 300) scale(0.9)">
      <path d="M-26 40 L-30 62 L-8 62 L-8 44 Z M26 40 L30 62 L8 62 L8 44 Z" fill="#6b4226"/>
      <circle cx="0" cy="20" r="36" fill="#f0a9a0"/>
      <circle cx="0" cy="24" r="12" fill="#e48f84" stroke-width="3"/><circle cx="0" cy="24" r="5" fill="#d06e62" stroke="none"/>
      <path d="M-36 6 L0 -90 L36 6 Q0 -6 -36 6 Z" fill="#1f5d3a"/>
      <path d="M-38 6 Q0 -8 38 6 L36 16 Q0 4 -36 16 Z" fill="#fffdf5" stroke-width="3"/>
      <circle cx="-38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/><circle cx="38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/>
    </g><g transform="translate(370 290) scale(0.9)">
      <path d="M-26 40 L-30 62 L-8 62 L-8 44 Z M26 40 L30 62 L8 62 L8 44 Z" fill="#6b4226"/>
      <circle cx="0" cy="20" r="36" fill="#f0a9a0"/>
      <circle cx="0" cy="24" r="12" fill="#e48f84" stroke-width="3"/><circle cx="0" cy="24" r="5" fill="#d06e62" stroke="none"/>
      <path d="M-36 6 L0 -90 L36 6 Q0 -6 -36 6 Z" fill="#2f6f9f"/>
      <path d="M-38 6 Q0 -8 38 6 L36 16 Q0 4 -36 16 Z" fill="#fffdf5" stroke-width="3"/>
      <circle cx="-38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/><circle cx="38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/>
    </g>
    <g transform="translate(80 430) scale(0.95)">
      <path d="M-26 40 L-30 62 L-8 62 L-8 44 Z M26 40 L30 62 L8 62 L8 44 Z" fill="#6b4226"/>
      <circle cx="0" cy="20" r="36" fill="#f0a9a0"/>
      <circle cx="0" cy="24" r="12" fill="#e48f84" stroke-width="3"/><circle cx="0" cy="24" r="5" fill="#d06e62" stroke="none"/>
      <path d="M-36 6 L0 -90 L36 6 Q0 -6 -36 6 Z" fill="#e2b13c"/>
      <path d="M-38 6 Q0 -8 38 6 L36 16 Q0 4 -36 16 Z" fill="#fffdf5" stroke-width="3"/>
      <circle cx="-38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/><circle cx="38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/>
    </g><g transform="translate(420 420) scale(0.95)">
      <path d="M-26 40 L-30 62 L-8 62 L-8 44 Z M26 40 L30 62 L8 62 L8 44 Z" fill="#6b4226"/>
      <circle cx="0" cy="20" r="36" fill="#f0a9a0"/>
      <circle cx="0" cy="24" r="12" fill="#e48f84" stroke-width="3"/><circle cx="0" cy="24" r="5" fill="#d06e62" stroke="none"/>
      <path d="M-36 6 L0 -90 L36 6 Q0 -6 -36 6 Z" fill="#7a4fa0"/>
      <path d="M-38 6 Q0 -8 38 6 L36 16 Q0 4 -36 16 Z" fill="#fffdf5" stroke-width="3"/>
      <circle cx="-38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/><circle cx="38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/>
    </g>
    <g transform="translate(180 470) scale(1)">
      <path d="M-26 40 L-30 62 L-8 62 L-8 44 Z M26 40 L30 62 L8 62 L8 44 Z" fill="#6b4226"/>
      <circle cx="0" cy="20" r="36" fill="#f0a9a0"/>
      <circle cx="0" cy="24" r="12" fill="#e48f84" stroke-width="3"/><circle cx="0" cy="24" r="5" fill="#d06e62" stroke="none"/>
      <path d="M-36 6 L0 -90 L36 6 Q0 -6 -36 6 Z" fill="#b3401d"/>
      <path d="M-38 6 Q0 -8 38 6 L36 16 Q0 4 -36 16 Z" fill="#fffdf5" stroke-width="3"/>
      <circle cx="-38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/><circle cx="38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/>
    </g><g transform="translate(320 470) scale(1)">
      <path d="M-26 40 L-30 62 L-8 62 L-8 44 Z M26 40 L30 62 L8 62 L8 44 Z" fill="#6b4226"/>
      <circle cx="0" cy="20" r="36" fill="#f0a9a0"/>
      <circle cx="0" cy="24" r="12" fill="#e48f84" stroke-width="3"/><circle cx="0" cy="24" r="5" fill="#d06e62" stroke="none"/>
      <path d="M-36 6 L0 -90 L36 6 Q0 -6 -36 6 Z" fill="#1f5d3a"/>
      <path d="M-38 6 Q0 -8 38 6 L36 16 Q0 4 -36 16 Z" fill="#fffdf5" stroke-width="3"/>
      <circle cx="-38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/><circle cx="38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/>
    </g><g transform="translate(250 520) scale(1.05)">
      <path d="M-26 40 L-30 62 L-8 62 L-8 44 Z M26 40 L30 62 L8 62 L8 44 Z" fill="#6b4226"/>
      <circle cx="0" cy="20" r="36" fill="#f0a9a0"/>
      <circle cx="0" cy="24" r="12" fill="#e48f84" stroke-width="3"/><circle cx="0" cy="24" r="5" fill="#d06e62" stroke="none"/>
      <path d="M-36 6 L0 -90 L36 6 Q0 -6 -36 6 Z" fill="#2f6f9f"/>
      <path d="M-38 6 Q0 -8 38 6 L36 16 Q0 4 -36 16 Z" fill="#fffdf5" stroke-width="3"/>
      <circle cx="-38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/><circle cx="38" cy="28" r="9" fill="#f0a9a0" stroke-width="3"/>
    </g>
    <path d="M90 596 L90 614" stroke="#4d7a3a" stroke-width="3"/><path d="M90 596 l-9 -10 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 Z" fill="#b3401d" stroke-width="2.5"/><path d="M160 626 L160 644" stroke="#4d7a3a" stroke-width="3"/><path d="M160 626 l-9 -10 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 Z" fill="#b3401d" stroke-width="2.5"/><path d="M250 616 L250 634" stroke="#4d7a3a" stroke-width="3"/><path d="M250 616 l-9 -10 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 Z" fill="#b3401d" stroke-width="2.5"/><path d="M340 628 L340 646" stroke="#4d7a3a" stroke-width="3"/><path d="M340 628 l-9 -10 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 Z" fill="#b3401d" stroke-width="2.5"/><path d="M410 600 L410 618" stroke="#4d7a3a" stroke-width="3"/><path d="M410 600 l-9 -10 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 Z" fill="#b3401d" stroke-width="2.5"/><path d="M200 576 L200 594" stroke="#4d7a3a" stroke-width="3"/><path d="M200 576 l-9 -10 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 Z" fill="#b3401d" stroke-width="2.5"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">7</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">7</text>
  </g>
</svg>`;

/** 8: polpo. */
const NUMERI_8 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 8: polpo con otto tentacoli arricciati">
  <defs><clipPath id="n8-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n8-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#dbe8ea" stroke="none"/>
    <path d="M30 600 Q250 560 470 600 L470 670 L30 670 Z" fill="#e8d7a8" stroke="none"/>
    <g fill="#ffffff" stroke="#9fb6bf" stroke-width="2"><circle cx="80" cy="80" r="8"/><circle cx="100" cy="60" r="5"/><circle cx="420" cy="420" r="7"/><circle cx="60" cy="380" r="5"/></g>
    <path d="M232 330 Q120 300 90 140" fill="none" stroke="#3a2a20" stroke-width="34"/><path d="M232 330 Q120 300 90 140" fill="none" stroke="#c9708a" stroke-width="26"/><circle cx="90" cy="140" r="22" fill="#c9708a"/><path d="M78 140 a12 12 0 1 1 12 12" fill="none" stroke-width="3"/><circle cx="164" cy="293" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="134" cy="258" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="110" cy="212" r="5" fill="#f2c6d2" stroke-width="2"/><path d="M228 330 Q200 220 170 90" fill="none" stroke="#3a2a20" stroke-width="34"/><path d="M228 330 Q200 220 170 90" fill="none" stroke="#c9708a" stroke-width="26"/><circle cx="170" cy="90" r="22" fill="#c9708a"/><path d="M158 90 a12 12 0 1 1 12 12" fill="none" stroke-width="3"/><circle cx="208" cy="251" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="197" cy="203" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="185" cy="154" r="5" fill="#f2c6d2" stroke-width="2"/><path d="M276 330 Q300 220 330 90" fill="none" stroke="#3a2a20" stroke-width="34"/><path d="M276 330 Q300 220 330 90" fill="none" stroke="#c9708a" stroke-width="26"/><circle cx="330" cy="90" r="22" fill="#c9708a"/><path d="M318 90 a12 12 0 1 1 12 12" fill="none" stroke-width="3"/><circle cx="294" cy="251" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="304" cy="203" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="315" cy="154" r="5" fill="#f2c6d2" stroke-width="2"/><path d="M280 330 Q380 300 420 170" fill="none" stroke="#3a2a20" stroke-width="34"/><path d="M280 330 Q380 300 420 170" fill="none" stroke="#c9708a" stroke-width="26"/><circle cx="420" cy="170" r="22" fill="#c9708a"/><path d="M408 170 a12 12 0 1 1 12 12" fill="none" stroke-width="3"/><circle cx="343" cy="297" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="372" cy="267" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="396" cy="229" r="5" fill="#f2c6d2" stroke-width="2"/><path d="M232 330 Q120 420 70 520" fill="none" stroke="#3a2a20" stroke-width="34"/><path d="M232 330 Q120 420 70 520" fill="none" stroke="#c9708a" stroke-width="26"/><circle cx="70" cy="520" r="22" fill="#c9708a"/><path d="M58 520 a12 12 0 1 1 12 12" fill="none" stroke-width="3"/><circle cx="161" cy="394" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="128" cy="432" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="99" cy="471" r="5" fill="#f2c6d2" stroke-width="2"/><path d="M228 330 Q200 520 170 640" fill="none" stroke="#3a2a20" stroke-width="34"/><path d="M228 330 Q200 520 170 640" fill="none" stroke="#c9708a" stroke-width="26"/><circle cx="170" cy="640" r="22" fill="#c9708a"/><path d="M158 640 a12 12 0 1 1 12 12" fill="none" stroke-width="3"/><circle cx="208" cy="454" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="197" cy="518" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="185" cy="576" r="5" fill="#f2c6d2" stroke-width="2"/><path d="M276 330 Q300 520 330 640" fill="none" stroke="#3a2a20" stroke-width="34"/><path d="M276 330 Q300 520 330 640" fill="none" stroke="#c9708a" stroke-width="26"/><circle cx="330" cy="640" r="22" fill="#c9708a"/><path d="M318 640 a12 12 0 1 1 12 12" fill="none" stroke-width="3"/><circle cx="294" cy="454" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="304" cy="518" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="315" cy="576" r="5" fill="#f2c6d2" stroke-width="2"/><path d="M280 330 Q380 420 440 520" fill="none" stroke="#3a2a20" stroke-width="34"/><path d="M280 330 Q380 420 440 520" fill="none" stroke="#c9708a" stroke-width="26"/><circle cx="440" cy="520" r="22" fill="#c9708a"/><path d="M428 520 a12 12 0 1 1 12 12" fill="none" stroke-width="3"/><circle cx="345" cy="394" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="378" cy="432" r="5" fill="#f2c6d2" stroke-width="2"/><circle cx="408" cy="471" r="5" fill="#f2c6d2" stroke-width="2"/>
    <path d="M250 120 Q330 120 336 230 Q340 330 290 350 L210 350 Q160 330 164 230 Q170 120 250 120 Z" fill="#c9708a"/>
    <path d="M206 170 q20 -20 40 -10 M260 150 q24 -4 36 14" fill="none" stroke="#a8506a" stroke-width="4"/>
    <ellipse cx="220" cy="290" rx="18" ry="16" fill="#fffdf5"/><circle cx="222" cy="292" r="7" fill="#3a2a20" stroke="none"/>
    <ellipse cx="280" cy="290" rx="18" ry="16" fill="#fffdf5"/><circle cx="278" cy="292" r="7" fill="#3a2a20" stroke="none"/>
    <path d="M200 268 q20 -8 40 4 M260 272 q20 -12 40 -4" fill="none" stroke-width="4"/>
    <path d="M238 326 q12 10 24 0" fill="none" stroke-width="3"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">8</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">8</text>
  </g>
</svg>`;

/** 9: volpe a nove code. */
const NUMERI_9 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta 9: volpe seduta con nove code soffici a ventaglio">
  <defs><clipPath id="n9-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#n9-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <circle cx="250" cy="340" r="200" fill="#efdcb4" stroke="none"/>
    <path d="M30 600 Q250 570 470 600 L470 670 L30 670 Z" fill="#d6c79d" stroke="none"/>
    <path d="M250 450 Q130 451 43 395" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q130 451 43 395" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="43" cy="395" r="24" fill="#fffdf5"/><path d="M250 450 Q134 399 68 310" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q134 399 68 310" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="68" cy="310" r="24" fill="#fffdf5"/><path d="M250 450 Q153 353 115 241" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q153 353 115 241" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="115" cy="241" r="24" fill="#fffdf5"/><path d="M250 450 Q182 316 178 196" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q182 316 178 196" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="178" cy="196" r="24" fill="#fffdf5"/><path d="M250 450 Q220 295 250 180" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q220 295 250 180" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="250" cy="180" r="24" fill="#fffdf5"/><path d="M250 450 Q262 291 322 196" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q262 291 322 196" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="322" cy="196" r="24" fill="#fffdf5"/><path d="M250 450 Q302 305 385 241" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q302 305 385 241" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="385" cy="241" r="24" fill="#fffdf5"/><path d="M250 450 Q336 335 432 310" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q336 335 432 310" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="432" cy="310" r="24" fill="#fffdf5"/><path d="M250 450 Q359 378 457 395" fill="none" stroke="#3a2a20" stroke-width="58"/><path d="M250 450 Q359 378 457 395" fill="none" stroke="#d9792e" stroke-width="50"/><circle cx="457" cy="395" r="24" fill="#fffdf5"/>
    <!-- corpo seduto -->
    <path d="M200 420 Q190 520 200 620 L300 620 Q310 520 300 420 Z" fill="#d9792e"/>
    <path d="M226 420 Q216 520 230 600 L270 600 Q284 520 274 420 Z" fill="#fffdf5" stroke="none"/>
    <path d="M206 610 L206 640 L236 640 L236 610 M264 610 L264 640 L294 640 L294 610" fill="#fffdf5"/>
    <!-- testa -->
    <path d="M190 320 L180 230 L232 290 Z M310 320 L320 230 L268 290 Z" fill="#d9792e"/>
    <path d="M194 300 L188 250 L222 290 Z M306 300 L312 250 L278 290 Z" fill="#3a2a20" stroke="none"/>
    <path d="M186 330 Q190 280 250 278 Q310 280 314 330 Q300 380 250 440 Q200 380 186 330 Z" fill="#d9792e"/>
    <path d="M200 350 Q230 360 250 440 Q270 360 300 350 Q280 400 250 440 Q220 400 200 350 Z" fill="#fffdf5"/>
    <path d="M216 336 q14 -8 26 2 M258 338 q12 -10 26 -2" fill="none" stroke-width="5"/>
    <ellipse cx="250" cy="432" rx="10" ry="7" fill="#3a2a20" stroke="none"/>
    <path d="M226 420 l-36 -6 M226 428 l-34 6 M274 420 l36 -6 M274 428 l34 6" stroke-width="2"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">
    <text x="420" y="118" font-size="96">9</text>
    <text x="80" y="118" font-size="96" transform="rotate(180 250 350)">9</text>
  </g><g fill="#b3401d" stroke="#fffdf5" stroke-width="3"><rect x="398" y="128" width="44" height="8" rx="3"/><rect x="58" y="128" width="44" height="8" rx="3" transform="rotate(180 250 350)"/></g>
</svg>`;

/** +1: maiale macellaio. */
const PIU_1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta +1: maiale macellaio coi baffi e il cappello da cuoco che chiede LASCIO?">
  <defs><clipPath id="p1-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#p1-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <g stroke="#e0d4b8" stroke-width="3" fill="none"><path d="M40 60 Q120 200 60 340 M440 80 Q380 200 450 360 M60 420 Q140 500 80 620"/></g>
    <!-- bancone -->
    <path d="M30 560 L470 560 L470 670 L30 670 Z" fill="#c9c2a8"/>
    <path d="M30 560 L470 560" stroke-width="5"/>
    <!-- cartello +1 -->
    <path d="M86 380 L86 560" stroke-width="10"/>
    <rect x="44" y="330" width="96" height="66" rx="6" fill="#fffdf5"/>
    <text x="92" y="380" font-family="Georgia, serif" font-weight="700" font-size="44" fill="#b3401d" stroke="none" text-anchor="middle">+1</text>
    <!-- corpo con grembiule -->
    <path d="M150 560 Q140 400 200 340 L300 340 Q360 400 350 560 Z" fill="#f2b0b8"/>
    <path d="M190 360 L310 360 L320 560 L180 560 Z" fill="#fffdf5"/>
    <path d="M210 360 L210 560 M240 360 L240 560 M270 360 L270 560 M300 360 L300 560" stroke="#9fb6bf" stroke-width="3"/>
    <!-- salsicce -->
    <ellipse cx="380" cy="330" rx="16" ry="22" fill="#b0503c" transform="rotate(20 380 330)"/><ellipse cx="400" cy="380" rx="16" ry="22" fill="#b0503c" transform="rotate(-10 400 380)"/><ellipse cx="392" cy="432" rx="16" ry="22" fill="#b0503c" transform="rotate(15 392 432)"/><ellipse cx="372" cy="480" rx="16" ry="22" fill="#b0503c" transform="rotate(-20 372 480)"/><ellipse cx="350" cy="524" rx="16" ry="22" fill="#b0503c" transform="rotate(10 350 524)"/><ellipse cx="320" cy="560" rx="16" ry="22" fill="#b0503c" transform="rotate(40 320 560)"/>
    <!-- mano col coltello -->
    <path d="M200 470 L330 410 L340 428 L210 486 Z" fill="#c9d3da"/>
    <path d="M170 480 L210 462 L216 480 L176 498 Z" fill="#6b4226"/>
    <circle cx="190" cy="484" r="22" fill="#f2b0b8"/>
    <circle cx="350" cy="372" r="20" fill="#f2b0b8"/>
    <!-- testa -->
    <path d="M170 170 L130 120 L200 140 Z M330 170 L370 120 L300 140 Z" fill="#e08a96"/>
    <ellipse cx="250" cy="230" rx="88" ry="80" fill="#f2b0b8"/>
    <!-- cappello da cuoco -->
    <path d="M190 166 Q170 100 210 90 Q230 50 270 70 Q310 60 316 100 Q340 120 312 166 Z" fill="#fffdf5"/>
    <path d="M190 166 L312 166 L312 184 L190 184 Z" fill="#fffdf5"/>
    <path d="M222 100 L226 164 M252 90 L252 164 M282 96 L280 164" stroke="#c9c2a8" stroke-width="3"/>
    <path d="M196 190 Q230 176 250 196 Q216 196 196 190 Z" fill="#2a201a"/>
    <path d="M206 210 L238 220 M264 220 L296 206" stroke-width="5"/>
    <ellipse cx="222" cy="232" rx="9" ry="7" fill="#3a2a20" stroke="none"/><ellipse cx="280" cy="232" rx="9" ry="7" fill="#3a2a20" stroke="none"/>
    <ellipse cx="252" cy="270" rx="40" ry="28" fill="#e08a96"/>
    <ellipse cx="238" cy="270" rx="7" ry="10" fill="#8c3a46" stroke="none"/><ellipse cx="266" cy="270" rx="7" ry="10" fill="#8c3a46" stroke="none"/>
    <path d="M196 300 Q226 280 252 302 Q278 280 308 300 Q300 318 280 314 Q262 310 252 304 Q242 310 224 314 Q204 318 196 300 Z" fill="#2a201a"/>
    <path d="M373 207 L304 272 L398 211 Z" fill="#fffdf5" stroke-width="3.5"/><ellipse cx="392" cy="170" rx="62" ry="46" fill="#fffdf5" stroke-width="3.5"/><path d="M377 201 L394 205" stroke="#fffdf5" stroke-width="8"/><text x="392" y="179" font-size="26" font-family="'Comic Sans MS','Chalkboard SE','Marker Felt',sans-serif" font-weight="700" fill="#3a2a20" stroke="none" text-anchor="middle">LASCIO?</text>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <rect x="110" y="628" width="280" height="36" rx="10" fill="#1f5d3a"/>
  <text x="250" y="654" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="#fffdf5" text-anchor="middle" letter-spacing="2">+1</text>
  <text x="82" y="102" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">+1</text>
</svg>`;

/** +2: tramoggia. */
const PIU_2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta +2: una tramoggia con scritto +2 rovescia due palline su un ometto stupito">
  <defs><clipPath id="p2-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#p2-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#f6ead0" stroke="none"/>
    <g stroke="#e0d4b8" stroke-width="3"><path d="M40 300 l60 -60 M380 640 l60 -60 M50 640 l60 -60 M400 330 l60 -60"/></g>
    <!-- tramoggia -->
    <path d="M110 110 L390 110 L410 180 L90 180 Z" fill="#9aa3ad"/>
    <rect x="160" y="70" width="180" height="40" fill="#c8cfd6"/>
    <text x="250" y="160" font-family="Georgia, serif" font-weight="700" font-size="54" fill="#b3401d" stroke="#fffdf5" stroke-width="4" paint-order="stroke" text-anchor="middle">+2</text>
    <path d="M100 180 L400 180 L300 300 L200 300 Z" fill="#6c757e"/>
    <circle cx="170" cy="226" r="26" fill="#f0a9a0"/><circle cx="214" cy="214" r="22" fill="#e2b13c"/><circle cx="256" cy="222" r="26" fill="#2f6f9f"/><circle cx="300" cy="214" r="22" fill="#f0a9a0"/><circle cx="336" cy="226" r="24" fill="#7a4fa0"/><circle cx="196" cy="256" r="20" fill="#1f5d3a"/><circle cx="236" cy="252" r="22" fill="#b3401d"/><circle cx="280" cy="254" r="22" fill="#e2b13c"/><circle cx="318" cy="258" r="20" fill="#f0a9a0"/>
    <path d="M100 180 L400 180" stroke-width="5"/>
    <path d="M200 300 L300 300 L290 330 L210 330 Z" fill="#4a4f57"/>
    <!-- le due che cadono -->
    <circle cx="232" cy="378" r="24" fill="#f0a9a0"/><circle cx="232" cy="378" r="7" fill="#d97d72" stroke-width="3"/>
    <circle cx="276" cy="414" r="24" fill="#f0a9a0"/><circle cx="276" cy="414" r="7" fill="#d97d72" stroke-width="3"/>
    <path d="M210 350 l-10 -12 M300 388 l12 -10 M206 400 l-14 4" stroke-width="3"/>
    <!-- ometto sdraiato che guarda in su -->
    <path d="M130 600 L370 600 L400 670 L100 670 Z" fill="#c9c2a8" stroke="none"/>
    <path d="M190 560 Q250 520 310 560 L320 640 L180 640 Z" fill="#2f6f9f"/>
    <ellipse cx="250" cy="540" rx="52" ry="44" fill="#f1c7a0"/>
    <path d="M200 528 Q206 494 250 494 Q296 494 300 528 Q280 510 250 512 Q220 510 200 528 Z" fill="#6b4226"/>
    <circle cx="232" cy="536" r="9" fill="#fffdf5" stroke-width="3"/><circle cx="232" cy="534" r="4" fill="#3a2a20" stroke="none"/>
    <circle cx="268" cy="536" r="9" fill="#fffdf5" stroke-width="3"/><circle cx="268" cy="534" r="4" fill="#3a2a20" stroke="none"/>
    <ellipse cx="250" cy="566" rx="10" ry="12" fill="#8c2a1c" stroke-width="3"/>
    <path d="M190 560 q-30 -10 -34 -40 M310 560 q30 -10 34 -40" fill="none" stroke="#f1c7a0" stroke-width="18"/>
    <path d="M190 560 q-30 -10 -34 -40 M310 560 q30 -10 34 -40" fill="none" stroke-width="3"/>
    <!-- nuvoletta !? -->
    <path d="M444 480 L447 500 L429 513 L415 529 L392 526 L369 529 L355 513 L337 500 L340 480 L337 460 L355 447 L369 431 L392 434 L415 431 L429 447 L447 460 L444 480 Z" fill="#fffdf5" stroke-width="3.5"/>
    <circle cx="340" cy="540" r="8" fill="#fffdf5" stroke-width="3"/><circle cx="322" cy="560" r="5" fill="#fffdf5" stroke-width="3"/>
    <text x="392" y="500" font-family="'Comic Sans MS','Chalkboard SE',sans-serif" font-weight="900" font-size="52" fill="#3a2a20" stroke="none" text-anchor="middle">!?</text>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <rect x="110" y="628" width="280" height="36" rx="10" fill="#1f5d3a"/>
  <text x="250" y="654" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="#fffdf5" text-anchor="middle" letter-spacing="2">+2</text>
  <text x="82" y="102" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" fill="#b3401d" stroke="#fffdf5" stroke-width="6" paint-order="stroke" text-anchor="middle">+2</text>
</svg>`;

/** Cambio Tetta: gufo col coltello. */
const CAMBIO_TETTA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta Cambio Tetta: gufo arrabbiato con coltello e tetta di pezza cucita">
  <defs><clipPath id="ct-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#ct-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#efe4cc" stroke="none"/>
    <g stroke="#cdbb98" stroke-width="2" fill="none"><path d="M60 30 l-300 300" /><path d="M88 30 l-300 300" /><path d="M116 30 l-300 300" /><path d="M144 30 l-300 300" /><path d="M172 30 l-300 300" /><path d="M200 30 l-300 300" /><path d="M228 30 l-300 300" /><path d="M256 30 l-300 300" /><path d="M284 30 l-300 300" /><path d="M312 30 l-300 300" /><path d="M340 30 l-300 300" /><path d="M368 30 l-300 300" /><path d="M396 30 l-300 300" /><path d="M424 30 l-300 300" /><path d="M452 30 l-300 300" /><path d="M480 30 l-300 300" /><path d="M508 30 l-300 300" /><path d="M536 30 l-300 300" /><path d="M564 30 l-300 300" /><path d="M592 30 l-300 300" /><path d="M620 30 l-300 300" /><path d="M648 30 l-300 300" /><path d="M676 30 l-300 300" /><path d="M704 30 l-300 300" /><path d="M732 30 l-300 300" /><path d="M760 30 l-300 300" /><path d="M788 30 l-300 300" /><path d="M-300 30 l300 300" /><path d="M-272 30 l300 300" /><path d="M-244 30 l300 300" /><path d="M-216 30 l300 300" /><path d="M-188 30 l300 300" /><path d="M-160 30 l300 300" /><path d="M-132 30 l300 300" /><path d="M-104 30 l300 300" /><path d="M-76 30 l300 300" /><path d="M-48 30 l300 300" /><path d="M-20 30 l300 300" /><path d="M8 30 l300 300" /><path d="M36 30 l300 300" /><path d="M64 30 l300 300" /><path d="M92 30 l300 300" /><path d="M120 30 l300 300" /><path d="M148 30 l300 300" /><path d="M176 30 l300 300" /><path d="M204 30 l300 300" /><path d="M232 30 l300 300" /><path d="M260 30 l300 300" /><path d="M288 30 l300 300" /><path d="M316 30 l300 300" /><path d="M344 30 l300 300" /><path d="M372 30 l300 300" /><path d="M400 30 l300 300" /><path d="M428 30 l300 300" /><path d="M456 30 l300 300" /></g>
    <!-- corpo peloso -->
    <path d="M410 370 L420 395 L406 417 L411 444 L394 461 L395 489 L375 501 L371 528 L350 534 L341 560 L319 559 L306 581 L286 575 L269 593 L250 580 L231 593 L214 575 L194 581 L181 559 L159 560 L150 534 L129 528 L125 501 L105 489 L106 461 L89 444 L94 417 L80 395 L90 370 L80 345 L94 323 L89 296 L106 279 L105 251 L125 239 L129 212 L150 206 L159 180 L181 181 L194 159 L214 165 L231 147 L250 160 L269 147 L286 165 L306 159 L319 181 L341 180 L350 206 L371 212 L375 239 L395 251 L394 279 L411 296 L406 323 L420 345 L410 370 Z" fill="#6b5640"/>
    <path d="M350 440 L355 462 L345 480 L345 503 L331 516 L325 538 L309 545 L298 563 L281 564 L267 576 L250 570 L233 576 L219 564 L202 563 L191 545 L175 538 L169 516 L155 503 L155 480 L145 462 L150 440 L145 418 L155 400 L155 377 L169 364 L175 342 L191 335 L202 317 L219 316 L233 304 L250 310 L267 304 L281 316 L298 317 L309 335 L325 342 L331 364 L345 377 L345 400 L355 418 L350 440 Z" fill="#e2d2b0" stroke-width="3"/>
    <path d="M200 400 q15 10 30 0 M270 410 q15 10 30 0 M220 470 q15 10 30 0 M260 520 q15 10 30 0" fill="none" stroke="#a8936d" stroke-width="3"/>
    <!-- ciuffi -->
    <path d="M150 210 L120 100 L200 170 Z" fill="#6b5640"/>
    <path d="M350 210 L380 100 L300 170 Z" fill="#6b5640"/>
    <path d="M128 110 l-14 -10 M134 104 l-4 -16 M372 104 l4 -16 M378 110 l14 -10" fill="none" stroke-width="3"/>
    <!-- muso -->
    <ellipse cx="250" cy="240" rx="82" ry="62" fill="#8a7253"/>
    <circle cx="214" cy="236" r="30" fill="#fffdf5"/><circle cx="286" cy="236" r="30" fill="#fffdf5"/>
    <circle cx="220" cy="242" r="15" fill="#2a201a" stroke="none"/><circle cx="280" cy="242" r="15" fill="#2a201a" stroke="none"/>
    <circle cx="224" cy="237" r="4" fill="#fffdf5" stroke="none"/><circle cx="284" cy="237" r="4" fill="#fffdf5" stroke="none"/>
    <path d="M178 196 L246 222 M322 196 L254 222" fill="none" stroke="#2a201a" stroke-width="9"/>
    <path d="M242 262 L258 262 L250 276 Z" fill="#e2b13c" stroke-width="3"/>
    <path d="M236 280 L264 280 L264 302 L236 302 Z" fill="#fffdf5" stroke-width="3"/>
    <path d="M250 280 L250 302" stroke-width="2.5"/>
    <path d="M214 278 Q250 290 286 278" fill="none" stroke-width="3"/>
    <!-- ala sinistra con coltello -->
    <path d="M286 418 L330 360 L344 372 L300 428 Z" fill="#c9d3da"/>
    <path d="M262 446 L292 418 L306 430 L276 458 Z" fill="#3a2a20"/>
    <path d="M288 470 L292 481 L280 488 L275 499 L260 501 L248 508 L233 504 L218 505 L209 496 L195 491 L194 480 L186 470 L194 460 L195 449 L209 444 L218 435 L233 436 L248 432 L260 439 L275 441 L280 452 L292 459 L288 470 Z" fill="#6b5640"/>
    <!-- ala destra con tetta di pezza -->
    <path d="M404 470 L406 489 L397 502 L392 520 L378 525 L367 535 L354 529 L340 530 L331 515 L319 506 L318 487 L312 470 L318 453 L319 434 L331 425 L340 410 L354 411 L367 405 L378 415 L392 420 L397 438 L406 451 L404 470 Z" fill="#6b5640"/>
    <circle cx="362" cy="450" r="36" fill="#f0a9a0"/>
    <circle cx="362" cy="450" r="8" fill="#d97d72" stroke-width="3"/>
    <path d="M336 426 Q362 444 388 426" fill="none" stroke-width="2.5" stroke-dasharray="6 5"/>
    <!-- tavolo -->
    <path d="M30 560 L470 560 L470 670 L30 670 Z" fill="#8a5a35"/>
    <path d="M30 560 L470 560" stroke-width="5"/>
    <path d="M50 590 q100 -8 200 0 q100 8 210 -2 M40 612 q120 10 240 0 M300 600 q80 -6 160 4" fill="none" stroke="#6b4226" stroke-width="3"/>
    <!-- tetta cucita sul tavolo -->
    <path d="M168 610 Q170 560 250 556 Q330 560 332 610 Z" fill="#f0a9a0"/>
    <path d="M250 556 L250 610" fill="none" stroke-width="3"/>
    <path d="M240 566 l20 8 M240 578 l20 8 M240 590 l20 8" fill="none" stroke-width="3"/>
    <circle cx="210" cy="590" r="7" fill="#d97d72" stroke-width="3"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <rect x="110" y="628" width="280" height="36" rx="10" fill="#1f5d3a"/>
  <text x="250" y="654" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="#fffdf5" text-anchor="middle" letter-spacing="2">CAMBIO TETTA</text>
  <text x="78" y="100" font-family="Georgia, 'Times New Roman', serif" font-size="56" font-weight="700" fill="#b3401d" text-anchor="middle">⇄</text>
</svg>`;

/** Stop / Suora: suora col divieto. */
const STOP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta Stop: suora col segno di divieto sul velo che fa segno col dito">
  <defs><clipPath id="st-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#st-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#e9dfc8" stroke="none"/>
    <!-- abito -->
    <path d="M40 700 Q40 520 150 480 L330 480 Q460 520 470 700 Z" fill="#2b2a30"/>
    <!-- velo -->
    <path d="M110 520 Q90 300 120 170 Q160 70 250 66 Q350 70 382 170 Q410 300 392 520 Q330 470 250 470 Q170 470 110 520 Z" fill="#2b2a30"/>
    <!-- bottoni -->
    <g fill="#e9dfc8" stroke-width="2.5"><circle cx="252" cy="560" r="7"/><circle cx="254" cy="600" r="7"/><circle cx="256" cy="640" r="7"/></g>
    <!-- colletto -->
    <path d="M178 452 L322 452 L330 500 Q250 520 170 500 Z" fill="#fffdf5"/>
    <path d="M186 462 L314 462" stroke-dasharray="3 8" stroke-width="3"/>
    <!-- collo -->
    <path d="M214 400 L214 456 L286 456 L286 400 Z" fill="#e7bf9c"/>
    <!-- viso -->
    <path d="M168 230 L332 230 L326 340 Q316 430 250 436 Q184 430 174 340 Z" fill="#f1cfae"/>
    <path d="M186 300 q10 6 20 2 M300 296 q10 4 20 -2 M196 360 q6 12 4 22 M300 362 q-6 12 -4 22" fill="none" stroke="#c09774" stroke-width="2.5"/>
    <!-- fascia bianca con divieto -->
    <path d="M160 120 L340 120 L340 236 L160 236 Z" fill="#fffdf5"/>
    <path d="M170 132 L170 226 M330 132 L330 226" stroke-dasharray="3 10" stroke-width="3"/>
    <path d="M232 178 q8 -14 20 -4 q10 12 -4 20 q-18 6 -24 -12 q-4 -22 22 -26 q28 0 30 28" fill="none" stroke="#7a6a5a" stroke-width="3"/>
    <circle cx="250" cy="176" r="40" fill="none" stroke="#b3401d" stroke-width="10"/>
    <path d="M222 148 L278 204" stroke="#b3401d" stroke-width="10"/>
    <!-- occhi -->
    <path d="M190 266 Q208 252 228 264" fill="none" stroke-width="4"/>
    <ellipse cx="210" cy="282" rx="18" ry="10" fill="#fffdf5" stroke-width="3"/>
    <circle cx="212" cy="282" r="7" fill="#3a2a20" stroke="none"/>
    <path d="M270 262 Q290 252 310 262" fill="none" stroke-width="4"/>
    <path d="M272 284 Q290 276 308 284" fill="none" stroke-width="4"/>
    <!-- naso e bocca con linguaccia -->
    <path d="M250 290 Q238 330 244 336 Q252 342 262 334" fill="none" stroke-width="3.5"/>
    <path d="M214 368 Q250 356 290 366 Q262 386 222 380 Z" fill="#c4645a" stroke-width="3"/>
    <path d="M236 376 Q244 400 256 398 Q266 394 262 376 Z" fill="#e89c86" stroke-width="3"/>
    <!-- mano alzata col dito -->
    <path d="M276 520 L346 520 L356 600 L270 600 Z" fill="#fffdf5"/>
    <path d="M282 532 L340 532" stroke-dasharray="3 8" stroke-width="3"/>
    <path d="M272 520 Q262 470 270 430 Q276 400 296 398 L298 272 Q300 252 314 252 Q328 254 328 272 L328 400 Q360 404 366 440 Q370 490 348 520 Z" fill="#f1cfae"/>
    <path d="M300 268 Q304 238 314 228 Q324 240 326 268 Z" fill="#b3401d" stroke-width="3"/>
    <path d="M300 404 Q290 412 296 424 M330 410 q14 0 22 10 M336 436 q14 0 22 10 M338 462 q12 2 18 10" fill="none" stroke-width="3"/>
    <!-- croce sulla mano -->
    <path d="M296 492 L344 452 M310 456 L330 492" stroke="#3a2a20" stroke-width="6"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <rect x="110" y="628" width="280" height="36" rx="10" fill="#1f5d3a"/>
  <text x="250" y="654" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="#fffdf5" text-anchor="middle" letter-spacing="2">STOP</text>
  <polygon points="102.0,91.9 87.9,106.0 68.1,106.0 54.0,91.9 54.0,72.1 68.1,58.0 87.9,58.0 102.0,72.1" fill="#b3401d" stroke="#fffdf5" stroke-width="3"/>
  <text x="78" y="88" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#fffdf5" text-anchor="middle">STOP</text>
</svg>`;

/** Giocoliere: burattino giullare. */
const GIOCOLIERE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta Giocoliere: burattino giullare appeso ai fili tra palline da giocoliere">
  <defs>
    <clipPath id="gi-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath>
    <radialGradient id="gi-luce" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="#f3e7cc"/><stop offset="1" stop-color="#bfae8c"/></radialGradient>
  </defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#gi-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="url(#gi-luce)" stroke="none"/>
    <path d="M60 80 l60 -60 M60 140 l120 -120 M300 30 l170 170 M360 30 l110 110 M60 560 l40 -40 M400 660 l70 -70" stroke="#a8977a" stroke-width="3" fill="none"/>
    <ellipse cx="255" cy="640" rx="150" ry="26" fill="#a8977a" stroke="none" opacity=".6"/>
    <g transform="translate(30 6) scale(0.88)">
    <!-- fili -->
    <g stroke="#3a2a20" stroke-width="2.5" fill="none">
      <path d="M130 -40 L130 120 M300 -40 L300 45 M412 -40 L412 172 M118 -40 L118 280"/>
      <path d="M232 -40 L240 190 M290 -40 L292 345 M180 -40 L160 400 M330 -40 L344 384 M220 -40 L232 520 M300 -40 L298 470"/>
    </g>
    <!-- palline appese -->
    <circle cx="130" cy="160" r="40" fill="#b3401d"/><circle cx="130" cy="160" r="22" fill="none" stroke="#fffdf5" stroke-width="5"/><circle cx="130" cy="160" r="8" fill="#fffdf5" stroke="none"/>
    <circle cx="300" cy="80" r="36" fill="#2f6f9f"/><path d="M272 70 Q300 56 328 70" fill="none" stroke="#fffdf5" stroke-width="5"/>
    <circle cx="412" cy="210" r="38" fill="#e2b13c"/><path d="M390 190 q10 -12 24 -8" fill="none" stroke="#fffdf5" stroke-width="5"/>
    <circle cx="118" cy="312" r="32" fill="#1f5d3a"/><path d="M100 300 q8 -10 20 -8" fill="none" stroke="#fffdf5" stroke-width="5"/>
    <!-- gambe -->
    <ellipse cx="226" cy="545" rx="26" ry="52" fill="#d9a86c"/>
    <ellipse cx="296" cy="520" rx="26" ry="50" fill="#d9a86c"/>
    <ellipse cx="222" cy="610" rx="22" ry="34" fill="#d9a86c"/>
    <ellipse cx="304" cy="590" rx="22" ry="34" fill="#d9a86c"/>
    <circle cx="226" cy="590" r="18" fill="#b9864c"/>
    <circle cx="300" cy="566" r="18" fill="#b9864c"/>
    <path d="M188 640 L240 634 L246 656 L190 662 Z" fill="#6b4226"/>
    <path d="M292 616 L346 624 L344 646 L290 640 Z" fill="#6b4226"/>
    <!-- busto -->
    <ellipse cx="258" cy="405" rx="72" ry="92" fill="#d9a86c"/>
    <path d="M216 360 Q258 380 300 360 M206 420 Q258 444 310 420" fill="none" stroke="#b9864c" stroke-width="3"/>
    <!-- braccio sinistro: palmo aperto con pallina -->
    <circle cx="186" cy="345" r="16" fill="#b9864c"/>
    <ellipse cx="166" cy="392" rx="20" ry="42" fill="#d9a86c" transform="rotate(25 166 392)"/>
    <circle cx="148" cy="430" r="13" fill="#b9864c"/>
    <path d="M110 452 Q120 430 150 432 Q178 436 176 456 Q170 478 140 480 Q112 476 110 452 Z" fill="#d9a86c"/>
    <path d="M112 452 l-10 -6 M118 466 l-12 2 M130 476 l-6 10" fill="none" stroke-width="3"/>
    <circle cx="142" cy="436" r="17" fill="#7a4fa0"/>
    <!-- braccio destro: palmo aperto -->
    <circle cx="328" cy="345" r="16" fill="#b9864c"/>
    <ellipse cx="350" cy="380" rx="18" ry="36" fill="#d9a86c" transform="rotate(-35 350 380)"/>
    <path d="M356 420 Q370 398 398 404 Q420 412 414 434 Q406 452 380 450 Q356 446 356 420 Z" fill="#d9a86c"/>
    <path d="M406 412 l10 -8 M414 426 l12 -2 M406 444 l8 8" fill="none" stroke-width="3"/>
    <!-- pernetti dei fili -->
    <g fill="#3a2a20" stroke="none"><circle cx="160" cy="400" r="4"/><circle cx="344" cy="384" r="4"/><circle cx="292" cy="345" r="4"/><circle cx="232" cy="520" r="4"/><circle cx="298" cy="470" r="4"/><circle cx="240" cy="190" r="4"/></g>
    <!-- collare -->
    <path d="M200 300 Q215 280 230 300 Q245 280 260 300 Q275 280 290 300 Q305 280 318 300 Q300 322 258 322 Q216 322 200 300 Z" fill="#fffdf5"/>
    <!-- testa -->
    <ellipse cx="256" cy="245" rx="44" ry="52" fill="#e8c193"/>
    <path d="M232 238 L248 242 M266 242 L282 236" fill="none" stroke-width="4"/>
    <path d="M258 248 L252 266 L262 266" fill="none" stroke-width="3"/>
    <path d="M246 280 Q258 284 270 278" fill="none" stroke-width="3.5"/>
    <circle cx="232" cy="262" r="7" fill="#e89c86" stroke="none"/><circle cx="284" cy="262" r="7" fill="#e89c86" stroke="none"/>
    <!-- cappello da giullare -->
    <path d="M210 228 Q206 196 232 188 L214 120 L258 176 L300 108 L294 190 Q308 204 302 230 Q256 210 210 228 Z" fill="#b3401d"/>
    <path d="M258 176 L300 108 L294 190 Q280 180 258 176 Z" fill="#1f5d3a"/>
    <path d="M208 228 Q256 206 304 230 L302 242 Q256 222 208 240 Z" fill="#e2b13c"/>
    <circle cx="214" cy="118" r="9" fill="#e2b13c"/><circle cx="300" cy="106" r="9" fill="#e2b13c"/>
    </g>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <rect x="110" y="628" width="280" height="36" rx="10" fill="#1f5d3a"/>
  <text x="250" y="654" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="#fffdf5" text-anchor="middle" letter-spacing="2">GIOCOLIERE</text>
</svg>`;

/** Tagliatette: scheletro che taglia la pizza. */
const TAGLIATETTE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta Tagliatette: scheletro col cappello che fischietta e taglia una pizza a metà">
  <defs>
    <clipPath id="tt-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath>
  </defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#tt-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#e4d6b8" stroke="none"/>
    <!-- nastro ondulato sullo sfondo -->
    <path d="M20 120 Q140 40 260 90 Q360 130 330 230 Q300 330 420 360 Q480 380 490 420 L490 470 Q450 420 400 410 Q270 380 290 250 Q310 150 230 130 Q130 110 20 190 Z" fill="#d3c19a" stroke="#8d7a55" stroke-width="3"/>
    <path d="M40 140 Q140 80 240 105 M330 330 Q360 380 450 395" fill="none" stroke="#8d7a55" stroke-width="3" stroke-dasharray="2 10"/>
    <path d="M20 330 Q90 300 120 360 Q140 420 60 450 L20 450 Z" fill="#d3c19a" stroke="#8d7a55" stroke-width="3"/>
    <!-- omini che ballano -->
    <g stroke="#5a4a35" stroke-width="3" fill="#5a4a35">
      <circle cx="400" cy="300" r="5"/><path d="M400 305 L398 325 M398 312 L388 304 M398 312 L410 306 M398 325 L390 338 M398 325 L408 336" fill="none"/>
      <circle cx="438" cy="282" r="5"/><path d="M438 287 L440 307 M439 294 L428 300 M439 294 L450 284 M440 307 L432 320 M440 307 L450 318" fill="none"/>
      <circle cx="426" cy="335" r="5"/><path d="M426 340 L424 360 M425 347 L414 340 M425 347 L436 352 M424 360 L416 372 M424 360 L432 372" fill="none"/>
      <circle cx="452" cy="345" r="5"/><path d="M452 350 L450 368 M451 356 L460 348 M451 356 L442 362 M450 368 L444 380 M450 368 L458 378" fill="none"/>
    </g>
    <!-- pizza -->
    <circle cx="405" cy="600" r="135" fill="#e2a65a"/>
    <circle cx="405" cy="600" r="112" fill="#c4452a" stroke="none"/>
    <path d="M318 560 q20 -30 50 -20 q30 -40 70 -10 q40 0 40 40 q20 30 -10 60 q0 40 -50 40 q-30 30 -70 0 q-40 0 -35 -45 q-20 -30 5 -65 Z" fill="#f3d27a" stroke="none"/>
    <g fill="#3a2a20" stroke="none"><circle cx="360" cy="580" r="9"/><circle cx="440" cy="560" r="9"/><circle cx="420" cy="640" r="9"/><circle cx="465" cy="610" r="9"/></g>
    <g fill="#9e2f1c" stroke="none"><circle cx="395" cy="545" r="13"/><circle cx="355" cy="625" r="13"/><circle cx="455" cy="660" r="13"/><circle cx="470" cy="525" r="12"/></g>
    <g fill="#4d7a3a" stroke="none"><path d="M400 600 q12 -14 24 0 q-12 10 -24 0Z"/><path d="M330 600 q12 -14 24 0 q-12 10 -24 0Z"/></g>
    <!-- bacino -->
    <path d="M168 560 Q170 530 215 530 Q262 530 262 560 Q258 600 232 612 L215 598 L198 612 Q172 600 168 560 Z" fill="#f4efe2"/>
    <circle cx="196" cy="568" r="6" fill="#4a3f33" stroke="none"/><circle cx="234" cy="568" r="6" fill="#4a3f33" stroke="none"/>
    <path d="M182 612 q-6 30 6 60 M248 612 q6 30 -6 60" fill="none" stroke-width="16"/>
    <path d="M182 612 q-6 30 6 60 M248 612 q6 30 -6 60" fill="none" stroke="#f4efe2" stroke-width="9"/>
    <!-- colonna -->
    <path d="M215 290 L215 530" stroke-width="16"/>
    <path d="M215 290 L215 530" stroke="#f4efe2" stroke-width="9" stroke-dasharray="14 4"/>
    <!-- costole -->
    <g fill="none">
      <path d="M215 340 Q150 330 150 370 Q152 392 215 384 M215 340 Q280 330 280 370 Q278 392 215 384" stroke-width="13"/>
      <path d="M215 340 Q150 330 150 370 Q152 392 215 384 M215 340 Q280 330 280 370 Q278 392 215 384" stroke="#f4efe2" stroke-width="7"/>
      <path d="M215 384 Q146 380 148 418 Q152 440 215 430 M215 384 Q284 380 282 418 Q278 440 215 430" stroke-width="13"/>
      <path d="M215 384 Q146 380 148 418 Q152 440 215 430 M215 384 Q284 380 282 418 Q278 440 215 430" stroke="#f4efe2" stroke-width="7"/>
      <path d="M215 430 Q152 428 156 462 Q162 482 215 472 M215 430 Q278 428 274 462 Q268 482 215 472" stroke-width="13"/>
      <path d="M215 430 Q152 428 156 462 Q162 482 215 472 M215 430 Q278 428 274 462 Q268 482 215 472" stroke="#f4efe2" stroke-width="7"/>
      <path d="M215 472 Q168 474 176 498 Q186 512 215 506 M215 472 Q262 474 254 498 Q244 512 215 506" stroke-width="12"/>
      <path d="M215 472 Q168 474 176 498 Q186 512 215 506 M215 472 Q262 474 254 498 Q244 512 215 506" stroke="#f4efe2" stroke-width="6"/>
    </g>
    <path d="M206 330 L224 330 L222 470 L208 470 Z" fill="#f4efe2"/>
    <!-- clavicole e spalle -->
    <path d="M150 336 Q185 318 215 326 Q245 318 282 336" fill="none" stroke-width="14"/>
    <path d="M150 336 Q185 318 215 326 Q245 318 282 336" fill="none" stroke="#f4efe2" stroke-width="8"/>
    <circle cx="146" cy="340" r="14" fill="#f4efe2"/><circle cx="286" cy="340" r="14" fill="#f4efe2"/>
    <!-- coltello a mezzaluna -->
    <path d="M250 590 Q360 640 480 540 L486 556 Q370 668 244 612 Z" fill="#4a5560"/>
    <path d="M262 598 Q360 640 470 556" fill="none" stroke="#c9d3da" stroke-width="4"/>
    <rect x="196" y="586" width="62" height="28" rx="8" fill="#6b4226" transform="rotate(20 227 600)"/>
    <!-- braccio sinistro: omero, avambraccio, mano sul manico -->
    <path d="M146 340 L128 470 L210 590" fill="none" stroke-width="16"/>
    <path d="M146 340 L128 470 L210 590" fill="none" stroke="#f4efe2" stroke-width="9"/>
    <circle cx="128" cy="470" r="11" fill="#f4efe2"/>
    <path d="M200 580 q16 -6 26 8 q4 14 -10 20 q-18 0 -16 -28 Z" fill="#f4efe2"/>
    <!-- braccio destro: verso la lama -->
    <path d="M286 340 L320 460 L298 600" fill="none" stroke-width="16"/>
    <path d="M286 340 L320 460 L298 600" fill="none" stroke="#f4efe2" stroke-width="9"/>
    <circle cx="320" cy="460" r="11" fill="#f4efe2"/>
    <path d="M286 592 q14 -10 26 0 l-2 26 q-14 6 -24 -4 Z" fill="#f4efe2"/>
    <path d="M292 600 l14 0 M292 610 l14 0" fill="none" stroke-width="2.5"/>
    <!-- collo -->
    <path d="M206 268 L224 268 L224 326 L206 326 Z" fill="#f4efe2"/>
    <path d="M206 285 L224 285 M206 305 L224 305" fill="none" stroke-width="3"/>
    <!-- teschio -->
    <path d="M150 220 Q150 150 220 148 Q290 150 288 222 Q288 250 270 262 L266 286 Q240 296 214 290 L210 268 Q160 262 150 220 Z" fill="#f4efe2"/>
    <path d="M214 266 L266 266" fill="none" stroke-width="3"/>
    <path d="M220 266 L220 290 M232 266 L232 293 M244 266 L244 293 M256 266 L256 290" fill="none" stroke-width="3"/>
    <path d="M170 210 Q186 196 204 210" fill="none" stroke-width="5"/>
    <path d="M236 196 Q262 186 274 206 Q276 230 252 232 Q232 228 236 196 Z" fill="#4a3f33"/>
    <path d="M212 230 L204 248 L220 248 Z" fill="#4a3f33" stroke-width="3"/>
    <!-- bocca che fischia -->
    <ellipse cx="282" cy="262" rx="7" ry="6" fill="#4a3f33" stroke-width="3"/>
    <!-- cappello -->
    <path d="M140 172 Q210 150 296 158 Q300 168 290 172 Q210 168 146 184 Q134 182 140 172 Z" fill="#3d3a38"/>
    <path d="M166 166 L170 112 Q220 98 268 108 L272 160 Q220 156 166 166 Z" fill="#4d4946"/>
    <path d="M168 146 Q220 136 271 142 L272 158 Q220 154 167 162 Z" fill="#b3401d" stroke-width="3"/>
    <!-- fumetto -->
    <path d="M320 70 Q330 40 390 38 Q458 38 462 92 Q462 140 400 146 Q350 148 334 130 L292 248 L322 120 Q312 100 320 70 Z" fill="#fffdf5" stroke-width="3.5"/>
    <text x="392" y="98" font-family="'Comic Sans MS','Chalkboard SE','Marker Felt',sans-serif" font-size="34" font-weight="700" fill="#3a2a20" stroke="none" text-anchor="middle">FIUUH</text>
    <g fill="#3a2a20" stroke="none">
      <ellipse cx="368" cy="128" rx="7" ry="5"/><rect x="373" y="104" width="3" height="24"/>
      <ellipse cx="400" cy="130" rx="7" ry="5"/><ellipse cx="424" cy="126" rx="7" ry="5"/>
      <rect x="405" y="106" width="3" height="24"/><rect x="429" y="102" width="3" height="24"/>
      <path d="M405 106 L432 102 L432 108 L405 112 Z"/>
    </g>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <!-- nome della carta -->
  <rect x="110" y="628" width="280" height="36" rx="10" fill="#1f5d3a"/>
  <text x="250" y="654" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="#fffdf5" text-anchor="middle" letter-spacing="2">TAGLIATETTE</text>
  <!-- simbolo: dimezza -->
  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#b3401d" text-anchor="middle">
    <text x="80" y="100" font-size="60">½</text>
  </g>
</svg>`;

/** Spione: faccione che spia dalla finestra (pronta per quando il motore avrà la carta 'spione'). */
export const SPIONE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta Lo Spione: un faccione con gli occhiali spia dalla finestra; nella lente si vede il bagno">
  <defs><clipPath id="sp-lente"><circle cx="300" cy="300" r="105"/></clipPath><clipPath id="sp-dentro"><rect x="30" y="30" width="440" height="640" rx="20"/></clipPath></defs>
  <rect x="6" y="6" width="488" height="688" rx="34" fill="#fffdf5" stroke="#c9c2a8" stroke-width="6"/>
  <g clip-path="url(#sp-dentro)" stroke="#3a2a20" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <rect x="30" y="30" width="440" height="640" fill="#d8c8a6" stroke="none"/>
    <!-- muro di mattoni in alto -->
    <path d="M30 30 L470 30 L470 120 L30 120 Z" fill="#b98c66"/>
    <path d="M30 60 L470 60 M30 90 L470 90 M90 30 L90 60 M190 30 L190 60 M290 30 L290 60 M390 30 L390 60 M140 60 L140 90 M240 60 L240 90 M340 60 L340 90 M440 60 L440 90 M90 90 L90 120 M190 90 L190 120 M290 90 L290 120 M390 90 L390 120" fill="none" stroke="#7a5638" stroke-width="3"/>
    <!-- muro a destra -->
    <path d="M400 30 Q380 200 410 420 Q420 560 400 670 L470 670 L470 30 Z" fill="#6b5640"/>
    <!-- davanzale e pianta in basso -->
    <path d="M30 560 L400 560 L400 670 L30 670 Z" fill="#cdbb98"/>
    <path d="M70 560 L70 640 M60 640 L190 640 M150 560 L150 640" fill="none" stroke-width="5"/>
    <path d="M330 590 L380 590 L380 610 L330 610 Z M352 610 L352 650" fill="#8a5a35"/>
    <!-- faccione peloso -->
    <path d="M450 330 L463 354 L445 375 L452 400 L430 417 L431 444 L406 456 L401 483 L374 490 L363 515 L335 516 L319 538 L291 534 L271 553 L244 544 L220 558 L196 544 L169 553 L149 534 L121 538 L105 516 L77 515 L66 490 L39 483 L34 456 L9 444 L10 417 L-12 400 L-5 375 L-23 354 L-10 330 L-23 306 L-5 285 L-12 260 L10 243 L9 216 L34 204 L39 177 L66 170 L77 145 L105 144 L121 122 L149 126 L169 107 L196 116 L220 102 L244 116 L271 107 L291 126 L319 122 L335 144 L363 145 L374 170 L401 177 L406 204 L431 216 L430 243 L452 260 L445 285 L463 306 L450 330 Z" fill="#7d6649"/>
    <path d="M60 130 Q160 90 240 140 Q300 100 380 140" fill="none" stroke="#4a3a28" stroke-width="5"/>
    <!-- muso chiaro -->
    <path d="M30 400 Q120 380 300 430 Q390 460 380 520 Q340 560 200 556 Q80 552 30 530 Z" fill="#e2d2b0"/>
    <ellipse cx="110" cy="440" rx="40" ry="26" fill="#3a2a20"/>
    <ellipse cx="102" cy="434" rx="10" ry="6" fill="#7d6649" stroke="none"/>
    <path d="M40 510 Q200 540 380 500" fill="none" stroke-width="5"/>
    <path d="M90 512 L90 548 L130 552 L130 518 Z M130 518 L130 552 L170 554 L170 522 Z" fill="#fffdf5" stroke-width="3"/>
    <path d="M200 470 Q280 486 360 470 M210 490 Q280 506 350 494" fill="none" stroke="#a8936d" stroke-width="3"/>
    <!-- occhio sinistro (lente piccola, in parte fuori carta) -->
    <path d="M30 170 Q110 160 140 230 Q150 320 80 340 Q50 344 30 336 Z" fill="#f1ecdc"/>
    <path d="M60 220 l40 -30 M70 260 l50 -40" stroke="#c9c2a8" stroke-width="3" fill="none"/>
    <path d="M100 250 L132 250 L118 300 Z" fill="#3a2a20"/>
    <!-- ponte degli occhiali -->
    <path d="M140 230 Q170 214 196 224" fill="none" stroke="#2a201a" stroke-width="10"/>
    <!-- lente grande con il riflesso -->
    <circle cx="300" cy="300" r="110" fill="#f7f1e2" stroke="#2a201a" stroke-width="10"/>
    <g clip-path="url(#sp-lente)">
      <rect x="190" y="190" width="220" height="110" fill="#cfe0e6" stroke="none"/>
      <path d="M240 190 L240 300 M300 190 L300 300 M360 190 L360 300 M190 245 L410 245" stroke="#9fb6bf" stroke-width="5"/>
      <rect x="190" y="300" width="220" height="110" fill="#f7f1e2" stroke="none"/>
      <!-- vasca -->
      <path d="M200 330 L400 330 Q396 400 300 404 Q204 400 200 330 Z" fill="#fffdf5" stroke-width="3"/>
      <!-- signora -->
      <circle cx="248" cy="306" r="18" fill="#f1c7a0" stroke-width="3"/>
      <path d="M228 304 Q230 280 250 284 Q272 284 268 304 Q264 292 250 292 Q234 294 228 304 Z" fill="#6b4226" stroke-width="3"/>
      <path d="M241 304 l2 0 M254 304 l2 0" stroke-width="3"/>
      <path d="M244 314 q4 3 8 0" fill="none" stroke-width="2"/>
      <!-- toro -->
      <ellipse cx="346" cy="300" rx="24" ry="22" fill="#a07a55" stroke-width="3"/>
      <path d="M326 286 q-12 -10 -8 -24 M366 286 q12 -10 8 -24" fill="none" stroke="#fffdf5" stroke-width="6"/>
      <path d="M326 286 q-12 -10 -8 -24 M366 286 q12 -10 8 -24" fill="none" stroke-width="2"/>
      <ellipse cx="346" cy="312" rx="14" ry="9" fill="#e8b49a" stroke-width="2.5"/>
      <circle cx="338" cy="294" r="3" fill="#3a2a20" stroke="none"/><circle cx="354" cy="294" r="3" fill="#3a2a20" stroke="none"/>
      <!-- schiuma -->
      <path d="M206 334 q12 -14 24 0 q12 -14 24 0 q12 -14 24 0 q12 -14 24 0 q12 -14 24 0 q12 -14 24 0 q12 -14 24 0 q12 -14 24 0 L392 344 L208 344 Z" fill="#ffffff" stroke-width="2.5"/>
      <circle cx="292" cy="300" r="6" fill="#ffffff" stroke-width="2"/><circle cx="304" cy="286" r="4" fill="#ffffff" stroke-width="2"/><circle cx="380" cy="276" r="5" fill="#ffffff" stroke-width="2"/>
      <path d="M210 360 q20 -6 40 0 M300 372 q20 -6 40 0" fill="none" stroke="#9fb6bf" stroke-width="2.5"/>
    </g>
    <circle cx="300" cy="300" r="110" fill="none" stroke="#2a201a" stroke-width="10"/>
    <path d="M220 240 q20 -30 50 -40" fill="none" stroke="#ffffff" stroke-width="6" opacity=".8"/>
    <!-- asta degli occhiali -->
    <path d="M408 290 Q440 280 470 286" fill="none" stroke="#2a201a" stroke-width="10"/>
  </g>
  <rect x="30" y="30" width="440" height="640" rx="20" fill="none" stroke="#1f5d3a" stroke-width="4"/>
  <rect x="110" y="628" width="280" height="36" rx="10" fill="#1f5d3a"/>
  <text x="250" y="654" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="#fffdf5" text-anchor="middle" letter-spacing="2">LO SPIONE</text>
</svg>`;

const NUMERI: Record<string, string> = {
  '0': NUMERI_0, '0.5': MEZZO, '1': NUMERI_1, '2': NUMERI_2, '3': NUMERI_3, '4': NUMERI_4,
  '5': NUMERI_5, '6': NUMERI_6, '7': NUMERI_7, '8': NUMERI_8, '9': NUMERI_9,
};

const SPECIALI: Record<string, string> = {
  piu1: PIU_1, piu2: PIU_2, cambioTetta: CAMBIO_TETTA, stop: STOP, giocoliere: GIOCOLIERE, tagliatette: TAGLIATETTE,
};

function comeImmagine(svg: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/** Illustrazione di una carta, se esiste; altrimenti la carta si mostra col solo nome. */
export function illustrazione(carta: Carta): string | undefined {
  const svg = carta.tipo === 'numero' ? NUMERI[String(carta.valore)] : SPECIALI[carta.tipo];
  return svg ? comeImmagine(svg) : undefined;
}
