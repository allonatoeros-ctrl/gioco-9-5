// I giocatori computer: giocano partite intere da soli senza mai bloccarsi
// e scelgono sempre una mossa che il motore permette.
import { describe, expect, it } from 'vitest';
import { avviaPartita, eseguiMossa } from '../../src/server/servizio';
import { vistaPubblica } from '../../src/server/vista';
import { CORAGGIO, decidiMossa } from '../../src/online/computer';

function partitaTraComputer(n: number) {
  const nomi = Array.from({ length: n }, (_, i) => `C${i}`);
  let stato = avviaPartita(nomi, n >= 4 ? 5 : null).stato;
  let mosse = 0;
  while (stato.fase !== 'finita') {
    const v = vistaPubblica(stato);
    const chi = v.azioniPermesse[0].giocatore;
    const mossa = decidiMossa(v, chi, CORAGGIO[chi % CORAGGIO.length]);
    expect(mossa).not.toBeNull();
    stato = eseguiMossa(stato, chi, mossa).stato;
    if (++mosse > 20000) throw new Error('partita infinita');
  }
  return stato;
}

describe('giocatori computer', () => {
  for (const n of [2, 3, 4, 6]) {
    it(`finiscono 15 partite in ${n} senza errori`, () => {
      for (let k = 0; k < 15; k++) {
        const s = partitaTraComputer(n);
        expect(s.vincitorePartita).not.toBeNull();
      }
    });
  }

  it('si fermano a 9,5 e pescano quando sono sotto a chi ha già finito', () => {
    const base = vistaPubblica(avviaPartita(['A', 'B'], null).stato);
    const carta = (valore: number, id: number) => ({ coperta: false as const, carta: { id, tipo: 'numero' as const, valore }, fattore: 1, ordine: 1 });
    const v = {
      ...base,
      fase: 'turno' as const,
      azioniPermesse: [{ tipo: 'pesca' as const, giocatore: 1, obbligatoria: false }, { tipo: 'fermati' as const, giocatore: 1 }],
      giocatori: [
        { ...base.giocatori[0], esito: 'fermo' as const, inGioco: [carta(8, 1001)], punteggio: 8 },
        { ...base.giocatori[1], esito: 'inTurno' as const, inGioco: [carta(7, 1002)], punteggio: 7 },
      ],
    };
    expect(decidiMossa(v, 1, 0.1)).toEqual({ tipo: 'pesca' });
    v.giocatori[1] = { ...v.giocatori[1], inGioco: [carta(9.5, 1003)], punteggio: 9.5 };
    expect(decidiMossa(v, 1, 0.9)).toEqual({ tipo: 'fermati' });
  });
});
