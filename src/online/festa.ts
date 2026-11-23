// Grafica "notte e oro": facce dei giocatori, dorso delle carte e i momenti grandi
// (pioggia di monete quando vinci, crepa quando sballi, 9½ che brilla).
// Solo aspetto: nessuna regola del gioco passa da qui.

import './festa.css';

/** Facce fisse per i giocatori del computer (i nomi sono in computer.ts). */
const FACCE_COMPUTER: Record<string, string> = {
  'Gino': '🧔🏻',
  'Pina': '👵🏼',
  'Il Conte': '🧐',
  'Rosetta': '👩🏻‍🦰',
  'Baffo': '🥸',
};

/** Facce per le persone: ognuno ne ha sempre una, scelta dal nome. */
const FACCE_PERSONE = ['😎', '🤠', '😏', '🥳', '🤓', '😜', '😇', '🤩', '🧑🏻‍🎤', '🦸🏻', '🧙🏻', '🕵🏻'];

/** La faccia di un giocatore: fissa per i bot, sempre la stessa per lo stesso nome. */
export function faccia(nome: string): string {
  const pulito = nome.replace('🤖', '').trim();
  if (nome.includes('🤖') && FACCE_COMPUTER[pulito]) return FACCE_COMPUTER[pulito];
  let h = 0;
  for (const ch of pulito.toLowerCase()) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return FACCE_PERSONE[h % FACCE_PERSONE.length];
}

function pocoMovimento() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
}

/** Pioggia di monete d'oro su tutto lo schermo (per chi vince la mano o fa 9½). */
export function pioggiaDiMonete(quante = 26) {
  if (pocoMovimento()) return;
  const cielo = document.createElement('div');
  cielo.className = 'pioggia-monete';
  cielo.setAttribute('aria-hidden', 'true');
  for (let k = 0; k < quante; k++) {
    const m = document.createElement('span');
    m.className = 'moneta-cade';
    m.textContent = '★';
    m.style.left = `${Math.random() * 100}%`;
    m.style.setProperty('--ritardo', `${Math.random() * 0.6}s`);
    m.style.setProperty('--durata', `${1.4 + Math.random() * 0.9}s`);
    m.style.setProperty('--giro', `${(Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540)}deg`);
    m.style.setProperty('--taglia', `${18 + Math.random() * 16}px`);
    cielo.append(m);
  }
  document.body.append(cielo);
  setTimeout(() => cielo.remove(), 2800);
}

/** Lo schermo trema e compare una crepa rossa (per chi sballa). */
export function crepa() {
  const vetro = document.createElement('div');
  vetro.className = 'crepa-schermo';
  vetro.setAttribute('aria-hidden', 'true');
  vetro.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M52 0 L47 18 L56 27 L44 41 L53 52 L41 66 L50 78 L45 100" />
    <path d="M47 18 L30 24 L22 20 M56 27 L72 30 L80 24 M44 41 L28 46 M53 52 L70 58 L78 66 M41 66 L26 72" />
  </svg>`;
  document.body.append(vetro);
  if (!pocoMovimento()) document.body.classList.add('scossa');
  setTimeout(() => document.body.classList.remove('scossa'), 500);
  setTimeout(() => vetro.remove(), 1700);
}
