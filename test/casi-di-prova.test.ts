// Casi di prova T1–T13 (regolamento, sezione 9), con il mazzo in ordine fissato.
import { describe, expect, it } from 'vitest';
import { valutazione } from '../src/engine';
import { Partita, controllaCarte } from './aiuti';

describe('Casi di prova del regolamento (sezione 9)', () => {
  it('T1 – Carte iniziali Stop, poi 7: il 7 si rivela, punteggio 7, nessuna pescata, turno finito', () => {
    const p = new Partita({ cima: ['Stop', '7'] }).rivela();
    expect(p.puo('rivela')).toBe(true); // lo Stop non blocca la rivelazione
    p.rivela();
    expect(p.registro()).toContain('Anna rivela: 7.');
    expect(p.punti(0)).toBe(7);
    expect(p.s.giocatori[0].esito).toBe('fermo');
    expect(p.chi).toBe(1); // turno finito: tocca a Bruno
  });

  it('T2 – Carte iniziali Stop, poi +2: il +2 non ha effetto, limbo, turno finito', () => {
    const p = new Partita({ cima: ['Stop', '+2'] }).rivela(2);
    expect(p.registro()).toContain('Lo Stop è attivo: il +2 non ha effetto.');
    expect(valutazione(p.s, 0).categoria).toBe('limbo');
    expect(p.s.giocatori[0].esito).toBe('fermo');
    expect(p.chi).toBe(1);
  });

  it('T3 – 4, +2, prima pescata Stop: seconda pescata annullata, punteggio 4, turno finito', () => {
    const p = new Partita({ cima: ['4', '+2', 'Stop'] }).rivela(2).pesca();
    expect(p.registro()).toContain('1 pescate obbligatorie annullate: lo Stop blocca la pesca.');
    expect(p.inGioco(0)).toEqual(['4', '+2', 'Stop']);
    expect(p.punti(0)).toBe(4);
    expect(p.chi).toBe(1);
  });

  it('T4 – Carte iniziali Stop, Stop: nessun blocco, limbo, può pescare', () => {
    const p = new Partita({ cima: ['Stop', 'Stop'] }).rivela(2);
    expect(valutazione(p.s, 0).categoria).toBe('limbo');
    expect(p.puo('pesca')).toBe(true);
    expect(p.chi).toBe(0);
  });

  it('T5 – Come T4, poi pesca un terzo Stop: blocco, turno finito', () => {
    const p = new Partita({ cima: ['Stop', 'Stop', 'Stop'] }).rivela(2).pesca();
    expect(p.registro()).toContain('3 Stop scoperti (dispari): pesca bloccata.');
    expect(p.s.giocatori[0].esito).toBe('fermo');
    expect(p.chi).toBe(1);
  });

  it('T6 – 5 e 2; pesca +2; pescate +1 e 1; pescata del +1: 0,5 → 8,5 e il giocatore può scegliere', () => {
    const p = new Partita({ cima: ['5', '2', '+2', '+1', '1', 'Mezzo'] }).rivela(2);
    expect(p.punti()).toBe(7);
    p.pesca(); // +2
    p.pesca(); // +1
    p.pesca(); // 1
    p.pesca(); // 0,5 (pescata del +1)
    expect(p.inGioco()).toEqual(['5', '2', '+2', '+1', '1', '0,5']);
    expect(p.punti()).toBe(8.5);
    expect(p.s.turno!.coda.length).toBe(0);
    expect(p.azioni().sort()).toEqual(['fermati', 'pesca']);
  });

  it('T7 – 5; pesca +2; prima pescata 9 (14); usa il Tagliatette; seconda pescata 2 → 14 → 7 → 9', () => {
    const p = new Partita({ cima: ['5', '0', '+2', '9', '2'] }).dammiTagliatette().rivela(2).pesca().pesca();
    expect(p.punti()).toBe(14);
    p.usaTagliatette();
    expect(p.punti()).toBe(7);
    p.pesca();
    expect(p.punti()).toBe(9);
    expect(p.riserva()).toEqual([]);
    expect(p.s.scarti.map((c) => c.tipo)).toEqual(['tagliatette']);
  });

  it('T8 – Prima carta iniziale Cambio Tetta: la seconda coperta torna nel mazzo senza essere vista, si rimescola, si pesca la sostitutiva', () => {
    const p = new Partita({ cima: ['CT', '8'], poi: [['3']] });
    const otto = p.s.giocatori[0].inGioco[1].carta.id;
    const mescolamenti = (p.caso as any).mescolamentiFatti;
    p.rivela();
    expect(p.s.mazzo.some((c) => c.id === otto)).toBe(true);
    expect((p.caso as any).mescolamentiFatti).toBe(mescolamenti + 1);
    expect(p.registro().join('\n')).not.toContain('8');
    expect(p.inGioco()).toEqual(['Cambio Tetta', '3']);
    controllaCarte(p.s);
  });

  it('T9 – Carte iniziali 5, poi Cambio Tetta: il 5 torna nel mazzo, si rimescola, si pesca la sostitutiva', () => {
    const p = new Partita({ cima: ['5', 'CT'], poi: [['6']] });
    const cinque = p.s.giocatori[0].inGioco[0].carta.id;
    const mescolamenti = (p.caso as any).mescolamentiFatti;
    p.rivela(2);
    expect(p.s.mazzo.some((c) => c.id === cinque)).toBe(true);
    expect((p.caso as any).mescolamentiFatti).toBe(mescolamenti + 1);
    expect(p.inGioco()).toEqual(['6', 'Cambio Tetta']);
    expect(p.punti()).toBe(6);
  });

  it('T10 – 3 e 4 scoperti; pesca Giocoliere: 3 e 4 nel mazzo, Giocoliere negli scarti, 3 carte coperte; può fermarsi dopo averne rivelata una', () => {
    const p = new Partita({ cima: ['3', '4', 'Giocoliere'], poi: [['1', '2', '5']] }).rivela(2);
    const [tre, quattro] = p.s.giocatori[0].inGioco.map((c) => c.carta.id);
    p.pesca();
    expect(p.s.mazzo.some((c) => c.id === tre)).toBe(true);
    expect(p.s.mazzo.some((c) => c.id === quattro)).toBe(true);
    expect(p.s.scarti.map((c) => c.tipo)).toEqual(['giocoliere']);
    expect(p.inGioco()).toEqual(['(coperta)', '(coperta)', '(coperta)']);
    expect(p.puo('fermati')).toBe(false);
    p.rivela();
    expect(p.puo('fermati')).toBe(true);
    p.fermati();
    expect(p.punti(0)).toBe(1);
  });

  it('T11 – Dopo un Giocoliere la prima carta rivelata è Stop: può rivelare le altre ma non pescare', () => {
    const p = new Partita({ cima: ['3', '4', 'Giocoliere'], poi: [['Stop', '2', '5']] }).rivela(2).pesca().rivela();
    expect(p.puo('rivela')).toBe(true);
    expect(p.puo('pesca')).toBe(false);
    p.rivela();
    expect(p.puo('rivela')).toBe(true);
    expect(p.puo('pesca')).toBe(false);
    p.rivela();
    expect(p.punti(0)).toBe(7);
    expect(p.s.giocatori[0].esito).toBe('fermo'); // nessuna carta coperta e Stop attivo
  });

  it('T12 – Carte iniziali Tagliatette, poi 6: Tagliatette in riserva, nessuna sostitutiva, punteggio 6', () => {
    const p = new Partita({ cima: ['TT', '6'] });
    const mazzoPrima = p.s.mazzo.length;
    p.rivela(2);
    expect(p.riserva()).toEqual(['Tagliatette']);
    expect(p.s.mazzo.length).toBe(mazzoPrima); // nessuna carta pescata al suo posto
    expect(p.inGioco()).toEqual(['6']);
    expect(p.punti()).toBe(6);
  });

  it('T13 – Fine mano: A ha 0 (carta 0), B solo speciali, C sballa → vince A', () => {
    const p = new Partita({ giocatori: ['A', 'B', 'C'], cima: ['0', '0', 'Stop', '+2', '9', '8'] });
    p.rivela(2).fermati(); // A: 0 + 0 = 0
    p.rivela(2); // B: Stop, +2 → limbo
    p.rivela(2); // C: 17 → sballa
    expect(valutazione(p.s, 0).categoria).toBe('zero');
    expect(valutazione(p.s, 1).categoria).toBe('limbo');
    expect(valutazione(p.s, 2).categoria).toBe('sballato');
    expect(p.s.vincitoreMano).toBe(0);
  });
});
