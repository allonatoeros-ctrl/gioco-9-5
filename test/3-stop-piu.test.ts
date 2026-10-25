import { describe, expect, it } from 'vitest';
import { azioniPermesse } from '../src/engine';
import { Partita } from './aiuti';

describe('Parte 3 – Stop (pari/dispari) e +1/+2', () => {
  it('lo Stop non blocca la rivelazione delle carte coperte', () => {
    const p = new Partita({ cima: ['Stop', '7', '1', '1'] }).rivela();
    expect(p.puo('rivela')).toBe(true);
    expect(p.puo('pesca')).toBe(false);
  });

  it('regola pari/dispari: 1 blocca, 2 no, 3 sì, 4 no', () => {
    const p = new Partita({ cima: ['Stop', 'Giocoliere'], poi: [['Stop', 'Stop', 'Stop', 'Stop']] }).rivela();
    expect(p.puo('pesca')).toBe(false);
    // Il Giocoliere (seconda carta) dà 2 carte nuove: rivelo uno Stop alla volta.
    p.rivela(); // Giocoliere: 2 carte coperte (Stop, Stop)
    expect(p.inGioco()).toEqual(['(coperta)', '(coperta)']);
    p.rivela();
    expect(p.puo('pesca')).toBe(false); // 1 Stop
    p.rivela(); // 2 Stop
    expect(p.puo('pesca')).toBe(true);
    p.pesca(); // 3 Stop: blocco, nessuna carta coperta → turno finito
    expect(p.s.giocatori[0].esito).toBe('fermo');
    expect(p.chi).toBe(1);
  });

  it('4 Stop scoperti = nessun blocco', () => {
    const p = new Partita({ cima: ['Stop', 'Stop', '+2', 'Stop', 'Stop'] }).rivela(2);
    p.pesca(); // +2 → 2 pescate obbligatorie
    p.pesca(); // Stop (3): blocco, la seconda pescata è annullata, turno finito
    expect(p.s.giocatori[0].esito).toBe('fermo');
    expect(p.registro()).toContain('1 pescate obbligatorie annullate: lo Stop blocca la pesca.');
  });

  it('+1 impone una pescata obbligatoria; durante le pescate obbligatorie non ci si può fermare', () => {
    const p = new Partita({ cima: ['5', '+1', '2'] }).rivela(2);
    expect(azioniPermesse(p.s)).toEqual([{ tipo: 'pesca', giocatore: 0, obbligatoria: true }]);
    p.pesca();
    expect(p.punti()).toBe(7);
    expect(p.azioni().sort()).toEqual(['fermati', 'pesca']);
    expect(azioniPermesse(p.s).find((a) => a.tipo === 'pesca')!.obbligatoria).toBe(false);
  });

  it('+2 impone due pescate, rivelate una alla volta', () => {
    const p = new Partita({ cima: ['1', '+2', '2', '3'] }).rivela(2).pesca();
    expect(p.s.turno!.coda.length).toBe(1);
    expect(p.punti()).toBe(3);
    p.pesca();
    expect(p.punti()).toBe(6);
    expect(p.s.turno!.coda.length).toBe(0);
  });

  it('le sequenze si sommano: prima si completano le pescate del primo, poi quelle nuove in coda', () => {
    // 1, +2: pescate del +2 = +1 e 2; poi la pescata del +1 = 3
    const p = new Partita({ cima: ['1', '+2', '+1', '2', '3', '9'] }).rivela(2);
    p.pesca(); // +1 (prima del +2)
    expect(p.s.turno!.coda.map((x) => x.origine)).toEqual([
      p.s.giocatori[0].inGioco[1].carta.id,
      p.s.giocatori[0].inGioco[2].carta.id,
    ]);
    p.pesca(); // 2 (seconda del +2)
    p.pesca(); // 3 (del +1)
    expect(p.inGioco()).toEqual(['1', '+2', '+1', '2', '3']);
    expect(p.punti()).toBe(6);
    expect(p.puo('fermati')).toBe(true);
  });

  it('con lo Stop attivo +1 e +2 non hanno effetto', () => {
    const p = new Partita({ cima: ['Stop', '+1'] }).rivela(2);
    expect(p.registro()).toContain('Lo Stop è attivo: il +1 non ha effetto.');
    expect(p.s.giocatori[0].esito).toBe('fermo');
  });

  it('uno Stop pescato durante la sequenza la interrompe', () => {
    const p = new Partita({ cima: ['4', '+2', 'Stop', '9'] }).rivela(2).pesca();
    expect(p.punti()).toBe(4);
    expect(p.s.giocatori[0].esito).toBe('fermo');
    // il 9 non è stato pescato da Anna: è la prima carta iniziale di Bruno
    expect(p.coperteVere(1)[0]).toBe('9');
  });

  it('la sequenza si ferma se il giocatore sballa senza Tagliatette', () => {
    const p = new Partita({ cima: ['5', '+2', '9', '9'] }).rivela(2).pesca();
    expect(p.s.giocatori[0].esito).toBe('sballato');
    expect(p.chi).toBe(1);
  });

  it('D6: +2 come prima carta iniziale – le pescate avvengono prima di poter rivelare la seconda; quelle annullate non tornano', () => {
    const p = new Partita({ cima: ['+2', 'Stop', 'Stop'] }).rivela();
    expect(p.azioni()).toEqual(['pesca']); // niente "rivela" finché la sequenza non è finita
    p.pesca(); // Stop: seconda pescata annullata
    expect(p.s.turno!.coda.length).toBe(0);
    expect(p.azioni().sort()).toEqual(['fermati', 'rivela']);
    p.rivela(); // seconda carta iniziale: Stop → 2 Stop, nessun blocco
    expect(p.s.turno!.coda.length).toBe(0);
    expect(azioniPermesse(p.s).find((a) => a.tipo === 'pesca')).toEqual({ tipo: 'pesca', giocatore: 0, obbligatoria: false });
  });
});
