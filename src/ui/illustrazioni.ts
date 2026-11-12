// Illustrazioni delle carte (grafica), dai disegni a matita di Eros.
// Ogni disegno è un SVG: si vede nitido a ogni dimensione.

import type { Carta } from '../engine';

/** Carta 0: uomo a torso nudo, braccia incrociate. */
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

/** Tagliatette: scheletro col cappello che fischietta e taglia la pizza a metà. */
const TAGLIATETTE = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta Tagliatette: scheletro col cappello che fischietta e taglia una pizza a metà">
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
</svg>
`;

/** Giocoliere: burattino giullare appeso ai fili, tra le palline. */
const GIOCOLIERE = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" role="img" aria-label="Carta Giocoliere: burattino giullare appeso ai fili tra palline da giocoliere">
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
</svg>
`;

/** Cambio Tetta: gufo arrabbiato col coltello e la tetta di pezza cucita. */
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
</svg>
`;

/** Stop / Suora: suora col divieto sul velo che fa segno col dito. */
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
</svg>
`;

function comeImmagine(svg: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/** Illustrazione di una carta, se esiste; altrimenti la carta si mostra col solo nome. */
export function illustrazione(carta: Carta): string | undefined {
  if (carta.tipo === 'numero') return carta.valore === 0 ? comeImmagine(CARTA_0) : undefined;
  if (carta.tipo === 'tagliatette') return comeImmagine(TAGLIATETTE);
  if (carta.tipo === 'giocoliere') return comeImmagine(GIOCOLIERE);
  if (carta.tipo === 'cambioTetta') return comeImmagine(CAMBIO_TETTA);
  if (carta.tipo === 'stop') return comeImmagine(STOP);
  return undefined;
}
