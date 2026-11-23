// "Come si gioca": una guida a schede, corta, da scorrere col dito.
// Si apre da sola la prima volta che qualcuno arriva sulla pagina iniziale,
// e si può riaprire quando si vuole (pagina iniziale, sala d'attesa, menu ☰ del tavolo).
// Nessuna regola viene calcolata qui: sono solo testi presi da regolamento.md, detti in breve.

import './guida.css';
import type { Carta } from '../engine';

type DisegnaCarta = (carta: Carta, taglia: 'mini' | 'media' | 'grande') => HTMLElement;

export interface OpzioniGuida {
  disegnaCarta: DisegnaCarta;
  /** Se c'è, l'ultima scheda propone "Prova contro il computer" e chiama questa funzione. */
  provaComputer?: () => void;
  /** Chiamata quando la guida si chiude (in qualunque modo). */
  allaChiusura?: () => void;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, classe?: string, testo?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (testo !== undefined) e.textContent = testo;
  return e;
}

/** Un paragrafo con qualche parola in grassetto: le parti tra **asterischi** diventano <strong>. */
function frase(testo: string, classe?: string) {
  const p = el('p', classe);
  testo.split('**').forEach((pezzo, k) => {
    if (!pezzo) return;
    p.append(k % 2 ? el('strong', undefined, pezzo) : document.createTextNode(pezzo));
  });
  return p;
}

/** Un elenco numerato di frasi. */
function elenco(righe: string[]) {
  const ol = el('ol', 'guida-passi');
  for (const r of righe) { const li = el('li'); li.append(frase(r)); ol.append(li); }
  return ol;
}

const numero = (id: number, valore: number): Carta => ({ id, tipo: 'numero', valore });

interface Scheda {
  titolo: string;
  corpo: (d: DisegnaCarta) => HTMLElement[];
}

const SCHEDE: Scheda[] = [
  {
    titolo: 'Benvenuto a 9½',
    corpo: (d) => {
      const carte = el('div', 'guida-carte');
      carte.append(d(numero(-11, 9), 'media'), el('span', 'guida-segno', '+'), d(numero(-12, 0.5), 'media'), el('span', 'guida-segno', '='), el('span', 'guida-punti', '9½'));
      return [
        carte,
        frase('Gira le carte e fai il punteggio **più alto possibile senza superare 9½**.'),
        frase('Se vai oltre **sballi** e quella mano non la puoi vincere.'),
      ];
    },
  },
  {
    titolo: 'Il tuo turno',
    corpo: (d) => {
      const carte = el('div', 'guida-carte');
      const coperta = el('div', 'carta media coperta');
      coperta.append(el('span', 'dorso-logo', '9½'));
      carte.append(coperta, el('span', 'guida-segno', '👆'), d(numero(-13, 6), 'media'));
      const passi = elenco([
        'Ricevi **2 carte coperte**: tocca una carta per girarla.',
        'Poi decidi: **Stai** (ti fermi e tieni il punteggio) oppure vai avanti.',
        'Girate le tue carte, puoi **Pescare** dal mazzo, una carta alla volta.',
      ]);
      return [carte, passi, frase('Quando tocca a te lo schermo si illumina. Gli altri giocano uno alla volta.', 'guida-piccolo')];
    },
  },
  {
    titolo: 'Le carte speciali',
    corpo: (d) => {
      const lista = el('ul', 'guida-speciali');
      const voci: [Carta, string][] = [
        [{ id: -21, tipo: 'piu1' }, '**+1 / +2**: devi pescare 1 o 2 carte, per forza.'],
        [{ id: -22, tipo: 'stop' }, '**Stop**: non puoi più pescare dal mazzo. Due Stop si annullano.'],
        [{ id: -23, tipo: 'cambioTetta' }, '**Cambio Tetta**: cambia una tua carta con una nuova dal mazzo.'],
        [{ id: -24, tipo: 'giocoliere' }, '**Giocoliere**: rimescola le tue carte e te ne ridà altrettante.'],
        [{ id: -25, tipo: 'tagliatette' }, '**Tagliatette**: lo tieni da parte; dimezza il punteggio e ti salva dallo sballo.'],
      ];
      for (const [c, t] of voci) {
        const li = el('li');
        li.append(d(c, 'media'), frase(t));
        lista.append(li);
      }
      return [lista, frase('Le speciali **non valgono punti**. Non serve impararle: quando escono il gioco te le spiega.', 'guida-piccolo')];
    },
  },
  {
    titolo: 'Chi vince',
    corpo: () => {
      const stella = el('div', 'guida-stella', '★');
      return [
        stella,
        frase('Chi ha il punteggio più alto **vince la mano** e tiene una sua carta come **segnalino ★**.'),
        frase('In **2 o 3** si gioca finché finisce il mazzo: vince chi ha più segnalini.'),
        frase('In **4 o più** vince il primo che arriva all\'obiettivo (3, 5 o 7 segnalini).'),
      ];
    },
  },
  {
    titolo: 'Giocare con gli amici',
    corpo: () => {
      const passi = elenco([
        'Tocca **Crea una stanza**.',
        'Tocca **Invita gli amici** e manda il link nella chat (WhatsApp, Telegram…).',
        'Gli amici toccano il link ed entrano. Si può anche entrare scrivendo il **codice di 5 caratteri**.',
        'Quando ci sono tutti, tocca **Inizia la partita**.',
      ]);
      return [passi, frase('Ognuno gioca dal suo telefono. **Da soli la partita non parte**: serve almeno un amico nella stanza.', 'guida-piccolo')];
    },
  },
];

/** Apre la guida sopra la pagina. Restituisce una funzione per chiuderla. */
export function apriGuida(opz: OpzioniGuida): () => void {
  const velo = el('div', 'velo centrato guida-velo');
  const box = el('div', 'pannello conferma guida');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Come si gioca');

  const testa = el('div', 'guida-testa');
  testa.append(el('span', 'guida-etichetta', 'Come si gioca'));
  const chiudiX = el('button', 'tasto-icona', '✕');
  chiudiX.setAttribute('aria-label', 'Chiudi la guida');
  testa.append(chiudiX);

  const nastro = el('div', 'guida-nastro');
  SCHEDE.forEach((s, k) => {
    const sezione = el('section', 'guida-scheda');
    sezione.setAttribute('aria-label', `${k + 1} di ${SCHEDE.length}: ${s.titolo}`);
    sezione.append(el('h2', undefined, s.titolo), ...s.corpo(opz.disegnaCarta));
    nastro.append(sezione);
  });

  const puntini = el('div', 'guida-puntini');
  const pallini = SCHEDE.map((_, k) => {
    const b = el('button', 'guida-pallino');
    b.setAttribute('aria-label', `Vai alla scheda ${k + 1}`);
    b.onclick = () => vaiA(k);
    puntini.append(b);
    return b;
  });

  const tasti = el('div', 'guida-tasti');
  const avanti = el('button', 'tasto primario grande', 'Avanti');
  const computer = el('button', 'tasto secondario grande', '🤖 Prova contro il computer');
  const salta = el('button', 'tasto leggero', 'Salta');
  tasti.append(avanti, computer, salta);

  box.append(testa, nastro, puntini, tasti);
  velo.append(box);
  document.body.append(velo);

  let attuale = 0;
  const larghezza = () => nastro.clientWidth || 1;
  function aggiorna() {
    const ultima = attuale === SCHEDE.length - 1;
    pallini.forEach((p, k) => p.classList.toggle('attivo', k === attuale));
    avanti.textContent = ultima ? 'Ho capito, giochiamo!' : 'Avanti';
    // (con `hidden` non basta: lo stile dei tasti lo scavalca)
    computer.style.display = ultima && opz.provaComputer ? '' : 'none';
    salta.style.display = ultima ? 'none' : '';
  }
  function vaiA(k: number) {
    attuale = Math.max(0, Math.min(SCHEDE.length - 1, k));
    nastro.scrollTo({ left: attuale * larghezza(), behavior: 'smooth' });
    aggiorna();
  }
  // Scorrendo col dito si aggiornano i pallini.
  nastro.addEventListener('scroll', () => {
    const k = Math.round(nastro.scrollLeft / larghezza());
    if (k !== attuale) { attuale = k; aggiorna(); }
  }, { passive: true });

  let chiusa = false;
  function chiudi() {
    if (chiusa) return;
    chiusa = true;
    document.removeEventListener('keydown', tastiera);
    velo.remove();
    opz.allaChiusura?.();
  }
  function tastiera(ev: KeyboardEvent) {
    if (ev.key === 'Escape') chiudi();
    if (ev.key === 'ArrowRight') vaiA(attuale + 1);
    if (ev.key === 'ArrowLeft') vaiA(attuale - 1);
  }
  document.addEventListener('keydown', tastiera);
  avanti.onclick = () => (attuale === SCHEDE.length - 1 ? chiudi() : vaiA(attuale + 1));
  computer.onclick = () => { chiudi(); opz.provaComputer?.(); };
  salta.onclick = chiudi;
  chiudiX.onclick = chiudi;
  velo.onclick = (ev) => { if (ev.target === velo) chiudi(); };

  aggiorna();
  setTimeout(() => avanti.focus());
  return chiudi;
}
