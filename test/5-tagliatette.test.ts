import { describe, expect, it } from 'vitest';
import { Partita, controllaCarte } from './aiuti';

describe('Parte 5 – Tagliatette', () => {
  it('rivelato va nella riserva; tra le carte iniziali non viene sostituito', () => {
    const p = new Partita({ cima: ['TT', '6'] }).rivela(2);
    expect(p.riserva()).toEqual(['Tagliatette']);
    expect(p.inGioco()).toEqual(['6']);
    expect(p.punti()).toBe(6);
  });

  it('pescato va nella riserva', () => {
    const p = new Partita({ cima: ['2', '3', 'TT'] }).rivela(2).pesca();
    expect(p.riserva()).toEqual(['Tagliatette']);
    expect(p.punti()).toBe(5);
  });

  it('dimezza il punteggio senza arrotondare, poi va negli scarti', () => {
    const p = new Partita({ cima: ['0', 'Mezzo'] }).dammiTagliatette().rivela(2).usaTagliatette();
    expect(p.punti()).toBe(0.25);
    expect(p.riserva()).toEqual([]);
    expect(p.s.scarti.map((c) => c.tipo)).toEqual(['tagliatette']);
    controllaCarte(p.s);
  });

  it('le carte scoperte dopo il dimezzamento valgono per intero', () => {
    const p = new Partita({ cima: ['5', '3', '2'] }).dammiTagliatette().rivela(2).usaTagliatette().pesca();
    expect(p.punti()).toBe(6); // 8 → 4, + 2
  });

  it('se ne possono usare 2 nello stesso turno', () => {
    const p = new Partita({ cima: ['9', 'Mezzo'] }).dammiTagliatette().dammiTagliatette().rivela(2);
    p.usaTagliatette().usaTagliatette();
    expect(p.punti()).toBe(2.375);
  });

  it('D5: si può usare in qualsiasi momento del proprio turno, anche a metà sequenza obbligatoria', () => {
    const p = new Partita({ cima: ['6', '+2', '2', '3'] }).dammiTagliatette().rivela(2).pesca();
    expect(p.azioni().sort()).toEqual(['pesca', 'usaTagliatette']);
    p.usaTagliatette(); // 8 → 4
    p.pesca(); // 3
    expect(p.punti()).toBe(7);
  });

  it('D5: si può usare nello stesso turno in cui lo si è preso', () => {
    const p = new Partita({ cima: ['6', '2', 'TT'] }).rivela(2).pesca();
    expect(p.puo('usaTagliatette')).toBe(true);
    p.usaTagliatette();
    expect(p.punti()).toBe(4);
  });

  it('D5: non si usa durante il turno altrui né dopo che il turno si è chiuso da solo', () => {
    const p = new Partita({ cima: ['Stop', '7', '1', '1'] }).dammiTagliatette().rivela(2);
    expect(p.chi).toBe(1);
    expect(p.s.giocatori[0].riserva.length).toBe(1);
    expect(p.puo('usaTagliatette')).toBe(false); // Bruno non ne ha
  });

  it('salvataggio dallo sballo: il motore chiede se usarlo; usandolo si rientra e la sequenza si completa', () => {
    const p = new Partita({ cima: ['5', '0', '+2', '9', '2'] }).dammiTagliatette().rivela(2).pesca().pesca();
    expect(p.punti()).toBe(14);
    expect(p.s.fase).toBe('decisioneSballo');
    expect(p.azioni().sort()).toEqual(['rinunciaTagliatette', 'usaTagliatette']);
    p.usaTagliatette();
    expect(p.punti()).toBe(7);
    expect(p.s.fase).toBe('turno');
    expect(p.azioni()).toEqual(['pesca']); // la sequenza continua
    p.pesca();
    expect(p.punti()).toBe(9);
  });

  it('rinunciando al Tagliatette il giocatore resta sballato e la sequenza si ferma', () => {
    const p = new Partita({ cima: ['5', '0', '+2', '9', '2', '1'] }).dammiTagliatette().rivela(2).pesca().pesca();
    p.fai('rinunciaTagliatette');
    expect(p.s.giocatori[0].esito).toBe('sballato');
    expect(p.riserva()).toEqual(['Tagliatette']);
    expect(p.chi).toBe(1);
  });

  it('se dopo il dimezzamento è ancora sballato può usare il secondo; senza altri Tagliatette resta sballato', () => {
    const p = new Partita({ cima: ['9', '9', '+2', '9', '9'] }).dammiTagliatette().dammiTagliatette().rivela(2);
    expect(p.s.fase).toBe('decisioneSballo'); // 18
    p.usaTagliatette(); // 9
    p.pesca(); // +2
    p.pesca(); // 9 → 18
    expect(p.s.fase).toBe('decisioneSballo');
    p.usaTagliatette(); // 9
    p.pesca(); // 9 → 18, nessun Tagliatette rimasto
    expect(p.s.giocatori[0].esito).toBe('sballato');
  });

  it('D4: un Tagliatette pescato durante la sequenza conta come una delle pescate', () => {
    const p = new Partita({ cima: ['4', '+2', 'TT', '3'] }).rivela(2).pesca();
    expect(p.riserva()).toEqual(['Tagliatette']);
    expect(p.s.turno!.coda.length).toBe(1);
    p.pesca();
    expect(p.punti()).toBe(7);
    expect(p.s.turno!.coda.length).toBe(0);
  });

  it('resta in riserva anche nelle mani successive e non vale punti', () => {
    const p = new Partita({ cima: ['TT', '6', '2', '3'] }).rivela(2).fermati().rivela(2).fermati();
    p.fai('scegliSegnalino', { cartaId: p.s.giocatori[0].inGioco[0].carta.id });
    expect(p.s.numeroMano).toBe(2);
    expect(p.riserva(0)).toEqual(['Tagliatette']);
    expect(p.s.giocatori[0].segnalini.length).toBe(1);
  });
});
