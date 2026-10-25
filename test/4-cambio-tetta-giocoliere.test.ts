import { describe, expect, it } from 'vitest';
import { Partita, controllaCarte } from './aiuti';

describe('Parte 4 – Cambio Tetta', () => {
  it('caso A: prima carta rivelata → la seconda carta coperta torna nel mazzo senza essere vista', () => {
    const p = new Partita({ cima: ['CT', '7'], poi: [['3']] });
    const mescolamentiPrima = (p.caso as any).mescolamentiFatti;
    p.rivela();
    expect(p.inGioco()).toEqual(['Cambio Tetta', '3']);
    expect(p.punti()).toBe(3);
    expect((p.caso as any).mescolamentiFatti).toBe(mescolamentiPrima + 1);
    expect(p.registro()).toContain('Cambio Tetta: una carta coperta torna nel mazzo senza essere vista; si rimescola il mazzo.');
    expect(p.registro().join('\n')).not.toContain('7');
    expect(p.azioni().sort()).toEqual(['fermati', 'pesca']);
    controllaCarte(p.s);
  });

  it('la sostitutiva applica il suo effetto (es. +2)', () => {
    const p = new Partita({ cima: ['CT', '7'], poi: [['+2']] }).rivela();
    expect(p.s.turno!.coda.length).toBe(2);
    expect(p.azioni()).toEqual(['pesca']);
  });

  it('caso B: dopo un\'altra carta sostituisce l\'ultima carta rivelata', () => {
    const p = new Partita({ cima: ['5', 'CT'], poi: [['2']] }).rivela(2);
    expect(p.inGioco()).toEqual(['2', 'Cambio Tetta']);
    expect(p.punti()).toBe(2);
    expect(p.registro()).toContain('Cambio Tetta: 5 torna nel mazzo; si rimescola il mazzo.');
  });

  it('caso B su una carta speciale con effetti residui: un +2 a metà si interrompe', () => {
    const p = new Partita({ cima: ['4', '+2', 'CT'], poi: [['3']] }).rivela(2).pesca();
    expect(p.inGioco()).toEqual(['4', '3', 'Cambio Tetta']);
    expect(p.s.turno!.coda.length).toBe(0);
    expect(p.punti()).toBe(7);
    expect(p.azioni().sort()).toEqual(['fermati', 'pesca']);
  });

  it('D4: la sostitutiva non consuma le pescate obbligatorie in coda', () => {
    // 1, +2: pescate +2 e 3; il secondo +2 aggiunge 2 pescate. La prima di queste è CT: rimette il 3.
    const p = new Partita({ cima: ['1', '+2', '+2', '3', 'CT'], poi: [['2', '1']] }).rivela(2);
    p.pesca(3); // +2, 3, CT (→ sostitutiva 2)
    expect(p.inGioco()).toEqual(['1', '+2', '+2', '2', 'Cambio Tetta']);
    expect(p.s.turno!.coda.length).toBe(1); // resta ancora una pescata del secondo +2
    p.pesca(); // 1
    expect(p.punti()).toBe(4);
    expect(p.s.turno!.coda.length).toBe(0);
  });

  it('esempio del Doppio Stop: il Cambio Tetta rimette il secondo Stop; se la sostitutiva non è Stop il giocatore deve fermarsi', () => {
    const p = new Partita({ cima: ['Stop', 'Stop', 'CT'], poi: [['5']] }).rivela(2).pesca();
    expect(p.inGioco(0)).toEqual(['Stop', '5', 'Cambio Tetta']);
    expect(p.s.giocatori[0].esito).toBe('fermo');
    expect(p.chi).toBe(1);
  });

  it('Doppio Stop: se la sostitutiva è uno Stop si può ancora pescare', () => {
    const p = new Partita({ cima: ['Stop', 'Stop', 'CT'], poi: [['Stop']] }).rivela(2).pesca();
    expect(p.puo('pesca')).toBe(true);
  });

  it('D3: il Cambio Tetta resta in gioco; un secondo Cambio Tetta sostituisce il primo', () => {
    const p = new Partita({ cima: ['5', 'CT'], poi: [['CT'], ['4']] }).rivela(2);
    expect(p.inGioco()).toEqual(['Cambio Tetta', '4']);
    expect(p.punti()).toBe(4);
    controllaCarte(p.s);
  });

  it('D3: il Cambio Tetta rimasto in gioco conta come carta speciale (limbo)', () => {
    const p = new Partita({ cima: ['CT', '7'], poi: [['Stop']] }).rivela();
    // CT + Stop: nessuna numerica, Stop attivo → turno finito in limbo
    expect(p.s.giocatori[0].esito).toBe('fermo');
    expect(p.registro()).toContain('Stop attivo e nessuna carta coperta: turno di Anna finito con solo carte speciali (limbo).');
  });

  it('D2: dopo un Tagliatette, il Cambio Tetta sostituisce l\'ultima carta ancora in gioco', () => {
    const p = new Partita({ cima: ['5', '1', 'TT', 'CT'], poi: [['2']] }).rivela(2).pesca(2);
    expect(p.riserva()).toEqual(['Tagliatette']);
    expect(p.inGioco()).toEqual(['5', '2', 'Cambio Tetta']);
    expect(p.punti()).toBe(7);
  });

  it('D2: carte iniziali Tagliatette e Cambio Tetta → nessuna carta da sostituire, nessun effetto', () => {
    const p = new Partita({ cima: ['TT', 'CT'] });
    const mescolamentiPrima = (p.caso as any).mescolamentiFatti;
    p.rivela(2);
    expect(p.inGioco()).toEqual(['Cambio Tetta']);
    expect(p.riserva()).toEqual(['Tagliatette']);
    expect((p.caso as any).mescolamentiFatti).toBe(mescolamentiPrima);
    expect(p.registro()).toContain('Cambio Tetta: nessuna carta in gioco da sostituire, nessun effetto.');
  });
});

describe('Parte 4 – Giocoliere', () => {
  it('conta le carte in gioco, le rimette nel mazzo, si scarta e ne dà altrettante coperte', () => {
    const p = new Partita({ cima: ['3', '4', 'Giocoliere'], poi: [['1', '2', '5']] }).rivela(2).pesca();
    expect(p.inGioco()).toEqual(['(coperta)', '(coperta)', '(coperta)']);
    expect(p.s.scarti.map((c) => c.tipo)).toEqual(['giocoliere']);
    expect(p.punti()).toBe(0);
    controllaCarte(p.s);
  });

  it('D9: dopo il Giocoliere bisogna rivelare almeno una carta, poi ci si può fermare dopo ogni rivelazione', () => {
    const p = new Partita({ cima: ['3', '4', 'Giocoliere'], poi: [['1', '2', '5']] }).rivela(2).pesca();
    expect(p.azioni()).toEqual(['rivela']);
    p.rivela();
    expect(p.azioni().sort()).toEqual(['fermati', 'rivela']);
    p.rivela();
    expect(p.azioni().sort()).toEqual(['fermati', 'rivela']);
  });

  it('conta anche le carte coperte (Giocoliere come prima carta iniziale → 2 carte)', () => {
    const p = new Partita({ cima: ['Giocoliere', '9'], poi: [['1', '2']] }).rivela();
    expect(p.inGioco()).toEqual(['(coperta)', '(coperta)']);
  });

  it('non conta i Tagliatette in riserva', () => {
    const p = new Partita({ cima: ['TT', '3', 'Giocoliere'], poi: [['1', '2']] }).rivela(2).pesca();
    expect(p.riserva()).toEqual(['Tagliatette']);
    expect(p.inGioco().length).toBe(2); // il 3 e il Giocoliere
  });

  it('interrompe le pescate obbligatorie in corso', () => {
    const p = new Partita({ cima: ['1', '+2', 'Giocoliere'], poi: [['5', '6', '7']] }).rivela(2).pesca();
    expect(p.s.turno!.coda.length).toBe(0);
    expect(p.inGioco()).toEqual(['(coperta)', '(coperta)', '(coperta)']); // 1, +2, Giocoliere
    expect(p.azioni()).toEqual(['rivela']);
  });

  it('uno Stop tra le nuove carte agisce solo quando viene rivelato', () => {
    const p = new Partita({ cima: ['3', '4', 'Giocoliere'], poi: [['2', 'Stop', '5']] }).rivela(2).pesca();
    p.rivela(); // 2
    expect(p.punti()).toBe(2);
    p.rivela(); // Stop
    expect(p.puo('rivela')).toBe(true);
    p.rivela(); // 5
    expect(p.punti()).toBe(7);
    expect(p.s.giocatori[0].esito).toBe('fermo'); // Stop attivo e niente più coperte
  });
});
