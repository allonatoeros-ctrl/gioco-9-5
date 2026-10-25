import { describe, expect, it } from 'vitest';
import { regoleProvvisorie } from '../src/engine';
import { Partita } from './aiuti';

describe('Parte 6 – Regole provvisorie (tutte in regole-provvisorie.ts)', () => {
  it('le tre regole stanno in un solo file con nomi chiari', () => {
    expect(Object.keys(regoleProvvisorie).sort()).toEqual([
      'p1_sostituzioneAncheConStopAttivo',
      'p2_qualeCopertaSostituireDopoGiocoliere',
      'p3_valoreDaTogliere',
    ]);
  });

  it('P1: con lo Stop attivo il Cambio Tetta sostituisce comunque (qui sostituisce proprio lo Stop)', () => {
    const p = new Partita({ cima: ['Stop', 'CT'], poi: [['6']] }).rivela(2);
    expect(p.inGioco()).toEqual(['6', 'Cambio Tetta']);
    expect(p.puo('pesca')).toBe(true); // lo Stop è tornato nel mazzo
  });

  it('P1: con lo Stop attivo il Cambio Tetta sostituisce un\'altra carta e la sostitutiva si pesca lo stesso', () => {
    const p = new Partita({ cima: ['3', '4', 'Giocoliere'], poi: [['Stop', '5', 'CT'], ['2']] }).rivela(2).pesca();
    p.rivela(3); // Stop (blocco), 5, Cambio Tetta → rimette il 5 e pesca il 2
    expect(p.inGioco(0)).toEqual(['Stop', '2', 'Cambio Tetta']);
    expect(p.punti(0)).toBe(2);
    expect(p.s.giocatori[0].esito).toBe('fermo');
  });

  it('P2: Cambio Tetta come prima carta dopo un Giocoliere sostituisce la prossima carta coperta, senza guardarla', () => {
    const p = new Partita({ cima: ['3', '4', 'Giocoliere'], poi: [['CT', '7', '2'], ['4']] }).rivela(2).pesca();
    p.rivela();
    expect(p.inGioco()).toEqual(['Cambio Tetta', '4', '(coperta)']);
    expect(p.coperteVere()).toEqual(['2']);
    expect(p.registro().join('\n')).not.toContain(': 7');
  });

  it('P3: esempio del regolamento – 5, +2, 9 (14), Tagliatette → 7, Cambio Tetta toglie metà del 9 → 2,5', () => {
    const p = new Partita({ cima: ['5', '+2', '9', 'CT'], poi: [['0']] }).dammiTagliatette().rivela(2).pesca();
    expect(p.punti()).toBe(14);
    p.usaTagliatette();
    expect(p.punti()).toBe(7);
    p.pesca(); // Cambio Tetta: rimette il 9 (vale 4,5), sostitutiva 0
    expect(p.punti()).toBe(2.5);
    expect(p.inGioco()).toEqual(['5', '+2', '0', 'Cambio Tetta']);
  });

  it('P3: la sostitutiva si aggiunge per intero', () => {
    const p = new Partita({ cima: ['5', '+2', '9', 'CT'], poi: [['1']] }).dammiTagliatette().rivela(2).pesca();
    p.usaTagliatette().pesca();
    expect(p.punti()).toBe(3.5);
  });
});
