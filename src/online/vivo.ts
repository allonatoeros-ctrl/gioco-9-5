// Un tavolo più "vivo": la sfera del punteggio, il punteggio da battere,
// la carta parlante che consiglia se spingere o fermarsi e la moneta che gira davvero.
//
// Qui non si decide niente: le mosse restano quelle che manda il server.
// Il consiglio della carta parlante è solo un parere (una stima a occhio sulle carte
// che si vedono), non cambia nessuna regola.

import './vivo.css';
import { creaMazzo, eNumerica } from '../engine';
import type { AzionePermessa, Carta } from '../engine';
import type { GiocatoreVista, VistaPartita } from '../server/vista';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, classe?: string, testo?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (testo !== undefined) e.textContent = testo;
  return e;
}

const fmt = (n: number) => String(n).replace('.', ',');
const haNumeriche = (g: GiocatoreVista) => g.inGioco.some((c) => !c.coperta && eNumerica(c.carta));

// ---------------------------------------------------------------------------
// La sfera del punteggio (un po' sfera del drago, un po' capezzolo)
// ---------------------------------------------------------------------------

/**
 * Il punteggio dentro una sfera lucida: l'anello attorno si riempie man mano che ci si
 * avvicina a 9,5 (verde, poi caldo, poi rosso). A 9,5 brilla, se si sballa si incrina.
 */
export function sfera(g: GiocatoreVista, taglia: 'grande' | 'piccola') {
  const numeri = haNumeriche(g);
  const p = g.punteggio;
  const sballato = g.esito === 'sballato' || p > 9.5;
  const box = el('div', `sfera ${taglia}`);
  const livello = numeri ? Math.max(0, Math.min(1, p / 9.5)) : 0;
  box.style.setProperty('--livello', String(livello));
  if (sballato) box.classList.add('sballata');
  else if (!numeri) box.classList.add('limbo');
  else if (p === 9.5) box.classList.add('perfetta');
  else if (p >= 8) box.classList.add('calda');
  else box.classList.add('tranquilla');
  const testo = numeri ? fmt(p) : '–';
  box.setAttribute('aria-label', sballato ? `Sballato con ${testo}` : `Punteggio ${testo} su 9,5`);
  const globo = el('div', 'globo');
  const capezzolo = el('div', 'capezzolo');
  const numero = el('strong', 'numero', testo);
  if (testo.length >= 4) numero.classList.add('lungo');
  capezzolo.append(numero);
  globo.append(capezzolo, el('span', 'riflesso'));
  if (sballato) globo.append(el('span', 'crepa'));
  box.append(globo);
  return box;
}

// ---------------------------------------------------------------------------
// Il punteggio da battere
// ---------------------------------------------------------------------------

/** Valore per confrontare (gerarchia del regolamento): sballato < solo speciali < numeri. */
function valore(g: GiocatoreVista) {
  if (g.esito === 'sballato') return -2;
  return haNumeriche(g) ? g.punteggio : -1;
}

export interface DaBattere {
  /** Il miglior punteggio di chi ha già finito il turno (null se nessuno). */
  punteggio: number | null;
  chi: string[];
  /** Il mio punteggio messo a confronto. */
  stato: 'nessuno' | 'sotto' | 'pari' | 'sopra';
}

export function calcolaDaBattere(v: VistaPartita, io: number): DaBattere | null {
  if (v.fase === 'finita') return null;
  const me = v.giocatori[io];
  if (me.esito === 'nonPartecipa') return null;
  let migliore = -Infinity;
  let chi: string[] = [];
  v.giocatori.forEach((g, i) => {
    if (i === io || g.esito !== 'fermo') return;
    const x = valore(g);
    if (x > migliore) { migliore = x; chi = [g.nome]; } else if (x === migliore) chi.push(g.nome);
  });
  if (chi.length === 0 || migliore < -1) return { punteggio: null, chi: [], stato: 'nessuno' };
  const mio = valore(me);
  const conNumeri = migliore >= 0;
  return {
    punteggio: conNumeri ? migliore : null,
    chi,
    stato: mio > migliore ? 'sopra' : mio === migliore ? 'pari' : 'sotto',
  };
}

/** La targhetta "Da battere: 7,5 (Luca)" accanto alla mia sfera. */
export function targhettaDaBattere(d: DaBattere | null, mioEsito: GiocatoreVista['esito']) {
  const box = el('div', 'da-battere');
  // Se ho già sballato non c'è più niente da battere: si mostra solo la sfera.
  if (!d || mioEsito === 'sballato') return box;
  if (d.stato === 'nessuno') {
    if (mioEsito === 'inTurno' || mioEsito === 'daGiocare') {
      box.classList.add('primo');
      box.append(el('span', 'eti', 'Da battere'), el('strong', undefined, 'nessuno'), el('span', 'chi', 'fai il massimo'));
    }
    return box;
  }
  const valoreTesto = d.punteggio === null ? 'solo speciali' : fmt(d.punteggio);
  box.classList.add(d.stato);
  const titolo = d.stato === 'sopra' ? 'Sei in testa!' : d.stato === 'pari' ? 'Pari con' : 'Da battere';
  box.append(el('span', 'eti', titolo), el('strong', undefined, valoreTesto), el('span', 'chi', d.chi.join(', ')));
  if (d.stato === 'pari') box.append(el('span', 'quanto', 'pari = moneta'));
  return box;
}

// ---------------------------------------------------------------------------
// La carta parlante: consiglia se spingere (pescare) o lasciare (fermarsi)
// ---------------------------------------------------------------------------

export type Umore = 'spingi' | 'dubbio' | 'lascia' | 'costretto' | 'perfetto';

export interface Consiglio {
  umore: Umore;
  frase: string;
  /** Quanto si rischia di sballare con la prossima carta (0..1), a occhio. */
  rischio: number;
}

const TUTTE = creaMazzo();

/** Stima a occhio: quante carte numeriche, tra quelle non ancora viste, mi farebbero sballare. */
export function stimaRischio(v: VistaPartita, io: number): number {
  const viste = new Set<number>();
  for (const g of v.giocatori) {
    for (const c of g.inGioco) if (!c.coperta) viste.add(c.carta.id);
    for (const c of g.riserva) viste.add(c.id);
    for (const s of g.segnalini) if (s.carta) viste.add(s.carta.id);
  }
  const resto: Carta[] = TUTTE.filter((c) => !viste.has(c.id));
  if (resto.length === 0) return 0;
  const p = v.giocatori[io].punteggio;
  const sballano = resto.filter((c) => eNumerica(c) && p + c.valore > 9.5).length;
  // +1 e +2 obbligano a pescare ancora: li conto a metà come pericolo, se si è già alti.
  const obblighi = p >= 5 ? resto.filter((c) => c.tipo === 'piu1' || c.tipo === 'piu2').length * 0.5 : 0;
  return Math.min(1, (sballano + obblighi) / resto.length);
}

const scegli = <T,>(lista: T[], seme: number) => lista[Math.abs(seme) % lista.length];

export function consiglia(v: VistaPartita, io: number, mie: AzionePermessa[]): Consiglio | null {
  const puoPescare = mie.some((a) => a.tipo === 'pesca' && !a.obbligatoria);
  const puoFermarsi = mie.some((a) => a.tipo === 'fermati');
  if (!puoPescare || !puoFermarsi) return null;
  const me = v.giocatori[io];
  const p = me.punteggio;
  const rischio = stimaRischio(v, io);
  const perc = `${Math.round(rischio * 100)}%`;
  const d = calcolaDaBattere(v, io);
  // Un seme che cambia a ogni carta, così le frasi non sono sempre uguali.
  const seme = me.inGioco.length * 7 + Math.round(p * 2) + v.numeroMano * 3;

  if (p === 9.5) return { umore: 'perfetto', rischio, frase: 'NOVE E MEZZO! Fermati, non toccare più niente.' };
  if (d && (d.stato === 'sotto' || (d.stato === 'pari' && d.punteggio !== null && rischio < 0.5)) && d.punteggio !== null) {
    return {
      umore: 'costretto', rischio,
      frase: d.stato === 'pari'
        ? `Sei pari con ${d.chi[0]}. Una carta piccola e lo superi… rischio ${perc}.`
        : scegli([
          `Se ti fermi perdi: ${d.chi[0]} ha ${fmt(d.punteggio)}. Devi spingere.`,
          `Con ${fmt(p)} non basta, ${d.chi[0]} è a ${fmt(d.punteggio)}. Pesca!`,
        ], seme),
    };
  }
  if (rischio === 0) return { umore: 'spingi', rischio, frase: `Pesca tranquillo: a ${fmt(p)} non puoi sballare.` };
  if (rischio < 0.3) {
    return { umore: 'spingi', rischio, frase: scegli([
      `Dai, pesca! Rischi poco: ${perc}.`,
      `Sei a ${fmt(p)}… c'è spazio. Un'altra!`,
      `Spingi, spingi! Solo ${perc} di sballare.`,
    ], seme) };
  }
  if (rischio < 0.55) {
    return { umore: 'dubbio', rischio, frase: scegli([
      `Mmh… ${perc} di sballare. Te la senti?`,
      `È un azzardo: ${perc}. Io ci penserei.`,
      `Metà e metà… ${perc}. Il cuore dice pesca, la testa dice stai.`,
    ], seme) };
  }
  return { umore: 'lascia', rischio, frase: scegli([
    `Fermati! Rischi di sballare: ${perc}.`,
    `Lascia stare… ${perc} di sballare. Stai!`,
    `Io tremo solo a guardarti. Stai a ${fmt(p)}.`,
  ], seme) };
}

/** La carta coperta con gli occhi che parla. Toccandola cambia frase. */
export function cartaParlante(c: Consiglio) {
  const box = el('div', `carta-parlante ${c.umore}`);
  const carta = el('div', 'faccia');
  carta.setAttribute('aria-hidden', 'true');
  const occhi = el('div', 'occhi');
  occhi.append(el('i', 'occhio'), el('i', 'occhio'));
  carta.append(occhi, el('i', 'bocca'));
  if (c.umore === 'lascia') carta.append(el('i', 'goccia'));
  const fumetto = el('p', 'fumetto');
  fumetto.setAttribute('role', 'status');
  scrivi(fumetto, c.frase);
  box.append(carta, fumetto);
  return box;
}

/** Il testo compare lettera per lettera, come se la carta stesse parlando. */
function scrivi(dove: HTMLElement, frase: string) {
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ridotto) { dove.textContent = frase; return; }
  dove.textContent = '';
  const testo = el('span', undefined, '');
  const resto = el('span', 'invisibile', frase);
  dove.append(testo, resto);
  let k = 0;
  const passo = () => {
    if (!dove.isConnected && k > 0) return;
    k = Math.min(frase.length, k + 2);
    testo.textContent = frase.slice(0, k);
    resto.textContent = frase.slice(k);
    if (k < frase.length) setTimeout(passo, 28);
  };
  setTimeout(passo, 250);
}

// ---------------------------------------------------------------------------
// La moneta che gira davvero
// ---------------------------------------------------------------------------

function facciaMoneta(lato: 'testa' | 'croce') {
  const f = el('div', `lato ${lato}`);
  f.append(el('span', 'simbolo', lato === 'testa' ? '♛' : '✚'), el('span', 'scritta', lato === 'testa' ? 'TESTA' : 'CROCE'));
  return f;
}

/** Una moneta d'oro; se `ferma` è falso gira piano su se stessa (in attesa della scelta). */
export function moneta(classe = '') {
  const m = el('div', `moneta ${classe}`.trim());
  m.setAttribute('aria-hidden', 'true');
  const dentro = el('div', 'dentro');
  dentro.append(facciaMoneta('testa'), facciaMoneta('croce'));
  m.append(dentro);
  return m;
}

/**
 * Il lancio: la moneta sale girando, ricade e si ferma sulla faccia uscita.
 * Restituisce l'elemento (da aggiungere alla pagina) e quanto dura in millisecondi.
 */
export function lancioMoneta(uscita: string, scelta: string | undefined, chi: string | undefined) {
  const lato = uscita === 'croce' ? 'croce' : 'testa';
  const velo = el('div', 'lancio-moneta');
  velo.setAttribute('role', 'status');
  const scena = el('div', 'scena');
  const m = moneta(`lancia esce-${lato}`);
  scena.append(m, el('div', 'ombra-moneta'));
  const sopra = el('p', 'chi-sceglie', chi && scelta ? `${chi} ha scelto ${scelta}` : 'Testa o croce?');
  const sotto = el('p', 'esito-moneta', `Esce ${lato}!`);
  if (scelta) sotto.classList.add(scelta === lato ? 'indovinato' : 'sbagliato');
  velo.append(sopra, scena, sotto);
  return { velo, durata: 3400 };
}
