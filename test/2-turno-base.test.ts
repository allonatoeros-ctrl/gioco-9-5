import { describe, expect, it } from 'vitest';
import { ErroreAzione, applicaAzione, valutazione } from '../src/engine';
import { Partita, controllaCarte } from './aiuti';

describe('Parte 2 – Turno base', () => {
  it('il giocatore riceve 2 carte coperte e deve rivelare la prima', () => {
    const p = new Partita({ cima: ['5', '3'] });
    expect(p.inGioco()).toEqual(['(coperta)', '(coperta)']);
    expect(p.azioni()).toEqual(['rivela']);
  });

  it('dopo la prima carta può fermarsi o rivelare la seconda, ma non pescare', () => {
    const p = new Partita({ cima: ['5', '3'] }).rivela();
    expect(p.inGioco()).toEqual(['5', '(coperta)']);
    expect(p.azioni().sort()).toEqual(['fermati', 'rivela']);
  });

  it('rivelate tutte le carte può pescare o fermarsi', () => {
    const p = new Partita({ cima: ['5', '3'] }).rivela(2);
    expect(p.punti()).toBe(8);
    expect(p.azioni().sort()).toEqual(['fermati', 'pesca']);
  });

  it('la carta pescata viene rivelata subito e conta nel punteggio', () => {
    const p = new Partita({ cima: ['5', '3', 'Mezzo'] }).rivela(2).pesca();
    expect(p.inGioco()).toEqual(['5', '3', '0,5']);
    expect(p.punti()).toBe(8.5);
  });

  it('le carte coperte non rivelate non contano e a fine mano vanno negli scarti', () => {
    const p = new Partita({ cima: ['5', '9', '2', '1'] }).rivela().fermati();
    expect(p.punti(0)).toBe(5);
    expect(p.chi).toBe(1);
    p.rivela(2).fermati();
    // Anna vince con 5 (Bruno ha 3): il 9 coperto è finito negli scarti senza essere mostrato
    expect(p.s.vincitoreMano).toBe(0);
    p.fai('scegliSegnalino', { cartaId: p.s.giocatori[0].inGioco[0].carta.id });
    expect(p.s.scarti.map((c) => c.tipo === 'numero' && c.valore)).toContain(9);
    expect(p.registro().join('\n')).not.toMatch(/rivela: 9/);
    controllaCarte(p.s);
  });

  it('esattamente 9,5 non è sballo', () => {
    const p = new Partita({ cima: ['9', 'Mezzo'] }).rivela(2);
    expect(p.punti()).toBe(9.5);
    expect(p.s.giocatori[0].esito).toBe('inTurno');
  });

  it('sopra 9,5 il giocatore sballa e il turno finisce', () => {
    const p = new Partita({ cima: ['9', '1', '4', '4'] }).rivela(2);
    expect(p.s.giocatori[0].esito).toBe('sballato');
    expect(p.chi).toBe(1);
    expect(p.registro().some((t) => t.includes('sballa con 10'))).toBe(true);
  });

  it('dopo essersi fermato il giocatore non può più agire', () => {
    const p = new Partita({ cima: ['5', '3', '4', '4'] }).rivela(2).fermati();
    expect(() => applicaAzione(p.s, { tipo: 'pesca', giocatore: 0 }, p.caso)).toThrow(ErroreAzione);
  });

  it('un\'azione non permessa viene rifiutata e lo stato non cambia', () => {
    const p = new Partita({ cima: ['5', '3'] });
    const prima = JSON.stringify(p.s);
    expect(() => applicaAzione(p.s, { tipo: 'pesca', giocatore: 0 }, p.caso)).toThrow(ErroreAzione);
    expect(() => applicaAzione(p.s, { tipo: 'rivela', giocatore: 1 }, p.caso)).toThrow(ErroreAzione);
    expect(JSON.stringify(p.s)).toBe(prima);
  });

  it('ogni azione produce un nuovo stato e non tocca quello vecchio', () => {
    const p = new Partita({ cima: ['5', '3'] });
    const vecchio = p.s;
    const copia = JSON.stringify(vecchio);
    p.rivela();
    expect(p.s).not.toBe(vecchio);
    expect(JSON.stringify(vecchio)).toBe(copia);
  });

  it('gerarchia: punti > zero con carta numerica > limbo > sballo', () => {
    // Anna: 0 e Mezzo → 0,5. Bruno: 0 e 0 → zero.
    const p = new Partita({ cima: ['0', 'Mezzo', '0', '0'] }).rivela(2).fermati().rivela(2).fermati();
    expect(valutazione(p.s, 0)).toEqual({ categoria: 'punti', punteggio: 0.5 });
    expect(valutazione(p.s, 1)).toEqual({ categoria: 'zero', punteggio: 0 });
    expect(p.s.vincitoreMano).toBe(0);

    const q = new Partita({ cima: ['Stop', '+1', '9', '9'] }).rivela(2).rivela(2);
    expect(valutazione(q.s, 0).categoria).toBe('limbo');
    expect(valutazione(q.s, 1).categoria).toBe('sballato');
    expect(q.s.vincitoreMano).toBe(0);
  });

  it('il vincitore della mano è chi ha il punteggio più alto', () => {
    const p = new Partita({ cima: ['5', '3', '9', '0'] }).rivela(2).fermati().rivela(2).fermati();
    expect(p.s.fase).toBe('segnalino');
    expect(p.s.vincitoreMano).toBe(1);
  });

  it('il primo giocatore è estratto a caso e a fine mano il ruolo passa al successivo', () => {
    const p = new Partita({ cima: ['5', '3', '9', '0'], giocatori: ['A', 'B', 'C'], primo: 2 });
    expect(p.s.partecipanti).toEqual([2, 0, 1]);
    p.rivela().fermati().rivela().fermati().rivela().fermati();
    p.fai('scegliSegnalino', { cartaId: p.s.giocatori[p.s.vincitoreMano!].inGioco.find((c) => c.scoperta)!.carta.id });
    expect(p.s.numeroMano).toBe(2);
    expect(p.s.partecipanti).toEqual([0, 1, 2]);
  });

  it('il registro eventi racconta il turno in modo leggibile', () => {
    const p = new Partita({ cima: ['5', '3'] }).rivela(2).fermati();
    const r = p.registro().join('\n');
    expect(r).toContain('Anna rivela: 5.');
    expect(r).toContain('Anna rivela: 3.');
    expect(r).toContain('Anna si ferma con 8 punti.');
  });
});
