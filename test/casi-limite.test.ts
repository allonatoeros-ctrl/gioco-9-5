// Casi limite aggiuntivi, oltre a T1–T13.
import { describe, expect, it } from 'vitest';
import { valutazione } from '../src/engine';
import { Partita, controllaCarte } from './aiuti';

describe('Casi limite', () => {
  it('Cambio Tetta (caso A) la cui sostitutiva è il Giocoliere: conta Cambio Tetta + Giocoliere = 2 carte', () => {
    const p = new Partita({ cima: ['CT', '7'], poi: [['Giocoliere'], ['3', '4']] }).rivela();
    expect(p.inGioco()).toEqual(['(coperta)', '(coperta)']);
    expect(p.s.scarti.map((c) => c.tipo)).toEqual(['giocoliere']);
    controllaCarte(p.s);
  });

  it('dopo un Tagliatette, il Giocoliere riporta il punteggio a zero (le carte dimezzate tornano nel mazzo)', () => {
    const p = new Partita({ cima: ['8', '1', 'Giocoliere'], poi: [['2', '3', '4']] })
      .dammiTagliatette()
      .rivela(2)
      .usaTagliatette() // 9 → 4,5
      .pesca() // Giocoliere: 3 carte
      .rivela(3);
    expect(p.punti()).toBe(9);
    expect(p.s.giocatori[0].inGioco.every((c) => c.fattore === 1)).toBe(true);
  });

  it('il Giocoliere pescato con 2 Tagliatette in riserva non li conta e non li tocca', () => {
    const p = new Partita({ cima: ['TT', 'TT', 'Giocoliere'], poi: [['5']] }).rivela(2).pesca();
    expect(p.riserva()).toEqual(['Tagliatette', 'Tagliatette']);
    expect(p.inGioco()).toEqual(['(coperta)']); // solo il Giocoliere era in gioco
  });

  it('una mano di soli limbo e sballati: vince il limbo', () => {
    const p = new Partita({ giocatori: ['A', 'B', 'C'], cima: ['Stop', '+1', '9', '9', '8', '8'] }).rivela(2).rivela(2).rivela(2);
    expect(valutazione(p.s, 0).categoria).toBe('limbo');
    expect(p.s.vincitoreMano).toBe(0);
  });

  it('0,25 batte lo zero ottenuto con una carta 0', () => {
    const p = new Partita({ cima: ['Mezzo', '0', '0', '0'] }).dammiTagliatette().rivela(2).usaTagliatette().fermati().rivela(2).fermati();
    expect(p.punti(0)).toBe(0.25);
    expect(p.s.vincitoreMano).toBe(0);
  });

  it('Cambio Tetta dopo una sequenza già finita sostituisce l\'ultima carta pescata, non il +1', () => {
    // 2, +1 → pescata: 3; poi pesca libera CT → sostituisce il 3 (ultima carta), non il +1
    const p = new Partita({ cima: ['2', '+1', '3', 'CT'], poi: [['1']] }).rivela(2).pesca().pesca();
    expect(p.inGioco()).toEqual(['2', '+1', '1', 'Cambio Tetta']);
    expect(p.punti()).toBe(3);
  });
});
