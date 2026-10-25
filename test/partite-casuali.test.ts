// Prova di resistenza: tante partite complete con carte e scelte casuali.
// Controlla che il motore non si blocchi mai, che le 115 carte ci siano sempre tutte
// e che ogni partita finisca con un vincitore.
import { describe, expect, it } from 'vitest';
import { Azione, applicaAzione, azioniPermesse, casoReale, creaPartita, punteggio } from '../src/engine';
import { controllaCarte } from './aiuti';

function giocaPartita(seme: number, giocatori: number) {
  const caso = casoReale(seme);
  const scelte = casoReale(seme + 1_000_000);
  let s = creaPartita({ giocatori: Array.from({ length: giocatori }, (_, i) => `G${i + 1}`), caso, obiettivoPunti: 3 });
  let passi = 0;
  while (s.fase !== 'finita') {
    const azioni = azioniPermesse(s);
    expect(azioni.length).toBeGreaterThan(0);
    const a = azioni[scelte.intero(azioni.length)];
    let azione: Azione;
    if (a.tipo === 'scegliMoneta') azione = { tipo: a.tipo, giocatore: a.giocatore, scelta: scelte.moneta() };
    else if (a.tipo === 'scegliSegnalino') azione = { tipo: a.tipo, giocatore: a.giocatore, cartaId: a.carte![scelte.intero(a.carte!.length)] };
    else azione = { tipo: a.tipo, giocatore: a.giocatore } as Azione;
    // Per non sballare sempre: con più di 7 punti di solito ci si ferma.
    if (a.tipo === 'pesca' && !a.obbligatoria && punteggio(s, a.giocatore) > 7 && azioni.some((x) => x.tipo === 'fermati')) {
      azione = { tipo: 'fermati', giocatore: a.giocatore };
    }
    s = applicaAzione(s, azione, caso);
    controllaCarte(s);
    if (s.fase === 'turno' || s.fase === 'decisioneSballo') {
      expect(s.turno!.giocatore).toBe(azioniPermesse(s)[0].giocatore);
    }
    if (++passi > 20000) throw new Error('partita troppo lunga');
  }
  expect(s.vincitorePartita).not.toBeNull();
  return s;
}

describe('Partite complete casuali', () => {
  for (const giocatori of [2, 3, 4, 5, 6]) {
    it(`40 partite con ${giocatori} giocatori finiscono senza errori`, () => {
      for (let seme = 1; seme <= 40; seme++) giocaPartita(seme * 7919 + giocatori, giocatori);
    });
  }
});
