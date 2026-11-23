// Grafica "notte e oro": facce dei giocatori, dorso delle carte e i momenti grandi
// (pioggia di monete quando vinci, crepa quando sballi, 9½ che brilla).
// Solo aspetto: nessuna regola del gioco passa da qui.

import './festa.css';
import { suona } from './suoni';

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
    m.style.left = `${Math.random() * 100}%`;
    m.style.setProperty('--ritardo', `${Math.random() * 0.6}s`);
    m.style.setProperty('--durata', `${1.4 + Math.random() * 0.9}s`);
    m.style.setProperty('--taglia', `${20 + Math.round(Math.random() * 14)}px`);
    const giro = k % 3;
    if (giro) m.classList.add(giro === 1 ? 'giro-a' : 'giro-b');
    const faccia = document.createElement('i');
    faccia.style.animationDelay = `${-Math.random() * 0.5}s`;
    m.append(faccia);
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
    <g class="bagliore">
      <path d="M52 0 L47 18 L56 27 L44 41 L53 52 L41 66 L50 78 L45 100" />
      <path d="M47 18 L30 24 L22 20 M56 27 L72 30 L80 24 M44 41 L28 46 M53 52 L70 58 L78 66 M41 66 L26 72" />
    </g>
    <path d="M52 0 L47 18 L56 27 L44 41 L53 52 L41 66 L50 78 L45 100" />
    <path d="M47 18 L30 24 L22 20 M56 27 L72 30 L80 24 M44 41 L28 46 M53 52 L70 58 L78 66 M41 66 L26 72" />
  </svg>`;
  document.body.append(vetro);
  if (!pocoMovimento()) document.body.classList.add('scossa');
  setTimeout(() => document.body.classList.remove('scossa'), 500);
  setTimeout(() => vetro.remove(), 1700);
}

/** La mia stella dei segnalini, dove finiscono monete e carte vinte. */
function salvadanaio(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.mio .segnalini');
}

/** La stella "salta" quando ci arriva qualcosa. */
function faiSaltare() {
  const s = salvadanaio();
  if (!s) return;
  s.classList.remove('salta');
  void s.offsetWidth; // riparte l'animazione anche se c'era già
  s.classList.add('salta');
}

/**
 * Qualche moneta vola dal centro dello schermo dentro la mia stella dei segnalini.
 * Si muovono con le animazioni del browser solo in posizione e grandezza: fluide anche sui telefoni.
 */
export function moneteNelSalvadanaio(quante = 6) {
  if (pocoMovimento()) { faiSaltare(); return; }
  const meta = salvadanaio()?.getBoundingClientRect();
  if (!meta) return;
  const x0 = window.innerWidth / 2, y0 = window.innerHeight * 0.4;
  const x1 = meta.left + 10, y1 = meta.top + meta.height / 2;
  for (let k = 0; k < quante; k++) {
    const m = document.createElement('span');
    m.className = 'moneta-vola';
    m.setAttribute('aria-hidden', 'true');
    m.style.left = `${x0 - 14}px`; m.style.top = `${y0 - 14}px`;
    document.body.append(m);
    const sx = (Math.random() - 0.5) * 160, sy = -40 - Math.random() * 80; // prima si alza, poi va alla stella
    const volo = m.animate([
      { transform: 'translate(0, 0) scale(.6)', opacity: 0 },
      { transform: `translate(${sx}px, ${sy}px) scale(1.1)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${x1 - x0}px, ${y1 - y0}px) scale(.45)`, opacity: 1 },
    ], { duration: 750, delay: k * 90, easing: 'cubic-bezier(.45, 0, .55, 1)', fill: 'both' });
    volo.onfinish = () => { m.remove(); faiSaltare(); suona('moneta'); };
  }
}

/** La carta scelta come segnalino vola nella mia stella, con un luccichio all'arrivo. */
export function segnalinoVola(carta: HTMLElement) {
  if (pocoMovimento()) return;
  const da = carta.getBoundingClientRect();
  const meta = salvadanaio()?.getBoundingClientRect();
  if (!meta) return;
  const copia = carta.cloneNode(true) as HTMLElement;
  copia.classList.remove('sceglibile', 'anima-entra', 'anima-gira');
  copia.classList.add('carta-vola');
  copia.removeAttribute('role'); copia.removeAttribute('tabindex');
  copia.style.left = `${da.left}px`; copia.style.top = `${da.top}px`; copia.style.width = `${da.width}px`;
  document.body.append(copia);
  const dx = meta.left + meta.width / 2 - (da.left + da.width / 2);
  const dy = meta.top + meta.height / 2 - (da.top + da.height / 2);
  const volo = copia.animate([
    { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 60}px) scale(.8) rotate(-8deg)`, opacity: 1, offset: 0.4 },
    { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(12deg)`, opacity: 0.2 },
  ], { duration: 650, easing: 'cubic-bezier(.4, 0, .6, 1)', fill: 'both' });
  volo.onfinish = () => { copia.remove(); luccichio(); faiSaltare(); suona('moneta'); };
}

/** Piccole stelline che si accendono attorno alla stella dei segnalini. */
function luccichio() {
  const meta = salvadanaio()?.getBoundingClientRect();
  if (!meta) return;
  const cx = meta.left + 10, cy = meta.top + meta.height / 2;
  for (let k = 0; k < 6; k++) {
    const s = document.createElement('span');
    s.className = 'luccichio';
    s.textContent = '✦';
    s.setAttribute('aria-hidden', 'true');
    s.style.left = `${cx - 6}px`; s.style.top = `${cy - 8}px`;
    document.body.append(s);
    const ang = (k / 6) * Math.PI * 2, r = 22 + Math.random() * 10;
    const a = s.animate([
      { transform: 'translate(0, 0) scale(.3)', opacity: 1 },
      { transform: `translate(${Math.cos(ang) * r}px, ${Math.sin(ang) * r}px) scale(1)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${Math.cos(ang) * r * 1.3}px, ${Math.sin(ang) * r * 1.3}px) scale(.6)`, opacity: 0 },
    ], { duration: 600, easing: 'ease-out', fill: 'both' });
    a.onfinish = () => s.remove();
  }
}
