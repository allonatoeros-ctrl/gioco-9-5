import { describe, expect, it } from 'vitest';
import { Partita, controllaCarte } from './aiuti';


describe('Parte 9 – Spione (sezione 5.7)', () => {
  it('rivelato tra le carte iniziali va nella riserva, senza sostitutiva, e si gira l\'altra carta', () => {
    const p = new Partita({ cima: ['Spione', '6'] }).rivela();
    expect(p.riserva()).toEqual(['Spione']);
    expect(p.inGioco()).toEqual(['(coperta)']);
    p.rivela();
    expect(p.inGioco()).toEqual(['6']);
    expect(p.punti()).toBe(6);
    controllaCarte(p.s);
  });

  it('pescato va nella riserva e non conta nel punteggio', () => {
    const p = new Partita({ cima: ['2', '3', 'Spione'] }).rivela(2).pesca();
    expect(p.riserva()).toEqual(['Spione']);
    expect(p.inGioco()).toEqual(['2', '3']);
    expect(p.punti()).toBe(5);
  });

  it('esempio del regolamento: con 7,5 guarda la prima carta del mazzo, vede un 4, si ferma a 7,5', () => {
    const p = new Partita({ cima: ['7', 'Mezzo', '4'] }).dammiSpione().rivela(2);
    expect(p.puo('usaSpione')).toBe(true);
    p.usaSpione();
    expect(p.sbirciata()).toBe('4');
    expect(p.s.turno!.sbirciata!.da).toBe('mazzo');
    // Guardare non è pescare: il 4 resta in cima al mazzo e il giocatore decide.
    expect(p.inGioco()).toEqual(['7', '0,5']);
    expect(p.azioni().sort()).toEqual(['fermati', 'pesca']);
    p.fermati();
    expect(p.s.giocatori[0].esito).toBe('fermo');
    expect(p.punti()).toBe(7.5);
    // Lo Spione usato va negli scarti; il 4 è la prima carta che riceve Bruno.
    expect(p.riserva()).toEqual([]);
    expect(p.s.scarti.map((c) => c.tipo)).toEqual(['spione']);
    expect(p.coperteVere(1)[0]).toBe('4');
    controllaCarte(p.s);
  });

  it('dopo aver guardato può anche pescare: pesca proprio la carta vista', () => {
    const p = new Partita({ cima: ['5', '1', '3'] }).dammiSpione().rivela(2).usaSpione();
    expect(p.sbirciata()).toBe('3');
    p.pesca();
    expect(p.inGioco()).toEqual(['5', '1', '3']);
    expect(p.sbirciata()).toBeNull(); // la carta vista non vale più dopo la mossa
  });

  it('con la seconda carta iniziale ancora coperta guarda quella, non il mazzo', () => {
    const p = new Partita({ cima: ['8', '9', '1'] }).dammiSpione().rivela();
    p.usaSpione();
    expect(p.sbirciata()).toBe('9');
    expect(p.s.turno!.sbirciata!.da).toBe('coperta');
    p.fermati(); // non la gira: resta coperta, punteggio 8
    expect(p.punti()).toBe(8);
  });

  it('il registro (visibile a tutti) non dice quale carta è stata vista', () => {
    const p = new Partita({ cima: ['7', 'Mezzo', '4'] }).dammiSpione().rivela(2).usaSpione();
    const ultimo = p.registro().at(-1)!;
    expect(ultimo).toContain('Spione');
    expect(ultimo).not.toContain('4');
  });

  it('non si usa prima di aver girato la prima carta (non c\'è ancora una scelta)', () => {
    const p = new Partita({ cima: ['5', '1'] }).dammiSpione();
    expect(p.puo('usaSpione')).toBe(false);
  });

  it('non si usa durante le pescate obbligatorie', () => {
    const p = new Partita({ cima: ['5', '+1', '2'] }).dammiSpione().rivela(2);
    expect(p.azioni()).toEqual(['pesca']);
  });

  it('non si usa con lo Stop attivo e nessuna carta da girare (non si può pescare)', () => {
    const p = new Partita({ cima: ['Stop', '7', '1', '1'], giocatori: ['Anna', 'Bruno'] }).dammiSpione().rivela();
    expect(p.puo('usaSpione')).toBe(true); // il 7 coperto si può ancora girare
    p.rivela(); // turno finito: Stop attivo, nessuna coperta
    expect(p.chi).toBe(1);
    expect(p.s.giocatori[0].riserva.map((c) => c.tipo)).toEqual(['spione']);
  });

  it('resta in riserva nelle mani successive', () => {
    const p = new Partita({ cima: ['Spione', '6', '2', '3'] }).rivela(2).fermati();
    p.rivela().fermati(); // Bruno: 2, si ferma (Anna vince con 6)
    p.fai('scegliSegnalino', { cartaId: p.s.giocatori[0].inGioco[0].carta.id });
    expect(p.s.numeroMano).toBe(2);
    expect(p.riserva(0)).toEqual(['Spione']);
  });

  it('il Giocoliere non conta lo Spione in riserva', () => {
    const p = new Partita({ cima: ['3', '4', 'Giocoliere'], poi: [['1', '2', '5']] }).dammiSpione().rivela(2).pesca();
    expect(p.inGioco()).toEqual(['(coperta)', '(coperta)', '(coperta)']);
    expect(p.riserva()).toEqual(['Spione']);
  });

  it('con il mazzo vuoto rimescola gli scarti e guarda la nuova prima carta', () => {
    const p = new Partita({ cima: ['5', '1'] }).dammiSpione().rivela(2);
    p.s.scarti.push(...p.s.mazzo.splice(0));
    const q = p.usaSpione();
    expect(q.s.mazzo.length).toBeGreaterThan(0);
    expect(q.s.turno!.sbirciata!.carta.id).toBe(q.s.mazzo[0].id);
    controllaCarte(q.s);
  });
});
