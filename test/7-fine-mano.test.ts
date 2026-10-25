import { describe, expect, it } from 'vitest';
import { ErroreAzione, applicaAzione, azioniPermesse } from '../src/engine';
import { Partita, controllaCarte } from './aiuti';

const TRE = ['Anna', 'Bruno', 'Carla'];

describe('Parte 7 – Fine mano e segnalino punto', () => {
  it('il vincitore sceglie una sua carta scoperta come segnalino; le altre vanno negli scarti', () => {
    const p = new Partita({ cima: ['5', '3', '2', '1'] }).rivela(2).fermati().rivela(2).fermati();
    expect(p.s.fase).toBe('segnalino');
    const [cinque, tre] = p.s.giocatori[0].inGioco.map((c) => c.carta.id);
    expect(azioniPermesse(p.s)).toEqual([{ tipo: 'scegliSegnalino', giocatore: 0, carte: [cinque, tre] }]);
    p.fai('scegliSegnalino', { cartaId: tre });
    expect(p.s.giocatori[0].segnalini.map((x) => x.carta!.id)).toEqual([tre]);
    expect(p.s.scarti.map((c) => c.id)).toContain(cinque);
    expect(p.s.scarti.length).toBe(3);
    controllaCarte(p.s);
  });

  it('non si può scegliere come segnalino una carta che non è propria e scoperta', () => {
    const p = new Partita({ cima: ['5', '3', '2', '1'] }).rivela(2).fermati().rivela(2).fermati();
    const diBruno = p.s.giocatori[1].inGioco[0].carta.id;
    expect(() => applicaAzione(p.s, { tipo: 'scegliSegnalino', giocatore: 0, cartaId: diBruno }, p.caso)).toThrow(ErroreAzione);
    expect(() => applicaAzione(p.s, { tipo: 'scegliSegnalino', giocatore: 0, cartaId: null }, p.caso)).toThrow(ErroreAzione);
  });

  it('D10: il segnalino può essere anche una carta speciale scoperta', () => {
    const p = new Partita({ cima: ['Stop', '7', '9', '9'] }).rivela(2).rivela(2);
    const stop = p.s.giocatori[0].inGioco[0].carta.id;
    p.fai('scegliSegnalino', { cartaId: stop });
    expect(p.s.giocatori[0].segnalini[0].carta!.tipo).toBe('stop');
  });

  it('D10: chi vince senza carte scoperte (limbo) prende un segnalino senza carta', () => {
    const p = new Partita({ cima: ['TT', 'TT', '9', '9'] }).rivela(2).fermati().rivela(2);
    expect(p.s.vincitoreMano).toBe(0);
    expect(azioniPermesse(p.s)[0].carte).toEqual([null]);
    p.fai('scegliSegnalino', { cartaId: null });
    expect(p.s.giocatori[0].segnalini).toEqual([{ carta: null }]);
  });

  it('D1: se sballano tutti nessuno vince, nessun segnalino, si passa alla mano dopo', () => {
    const p = new Partita({ cima: ['9', '9', '8', '8'] }).rivela(2).rivela(2);
    expect(p.registro()).toContain('Tutti i giocatori hanno sballato: nessuno vince la mano.');
    expect(p.s.numeroMano).toBe(2);
    expect(p.s.giocatori.every((g) => g.segnalini.length === 0)).toBe(true);
    expect(p.s.scarti.length).toBe(4);
  });
});

describe('Parte 7 – Pareggio tra 2 giocatori', () => {
  it('lancio della moneta: sceglie chi ha raggiunto per secondo quel punteggio', () => {
    const p = new Partita({ cima: ['5', '2', '4', '3'], monete: ['testa'] }).rivela(2).fermati().rivela(2).fermati();
    expect(p.s.fase).toBe('moneta');
    expect(azioniPermesse(p.s)).toEqual([{ tipo: 'scegliMoneta', giocatore: 1 }]);
    p.fai('scegliMoneta', { scelta: 'testa' });
    expect(p.s.vincitoreMano).toBe(1);
    expect(p.registro()).toContain('Bruno sceglie testa; esce testa.');
  });

  it('se la moneta non dà ragione a chi sceglie, vince l\'altro', () => {
    const p = new Partita({ cima: ['5', '2', '4', '3'], monete: ['croce'] }).rivela(2).fermati().rivela(2).fermati();
    p.fai('scegliMoneta', { scelta: 'testa' });
    expect(p.s.vincitoreMano).toBe(0);
  });

  it('"per secondo" segue l\'ordine di gioco della mano, non l\'ordine dei nomi', () => {
    const p = new Partita({ cima: ['5', '2', '4', '3'], primo: 1 }).rivela(2).fermati().rivela(2).fermati();
    expect(p.s.moneta).toEqual({ sceglie: 0, altro: 1 });
  });

  it('anche due giocatori in limbo (o entrambi a zero) vanno alla moneta', () => {
    const p = new Partita({ cima: ['Stop', '+1', 'Stop', '+2'] }).rivela(2).rivela(2);
    expect(p.s.fase).toBe('moneta');
    const q = new Partita({ cima: ['0', '0', '0', '0'] }).rivela(2).fermati().rivela(2).fermati();
    expect(q.s.fase).toBe('moneta');
  });
});

describe('Parte 7 – Pareggio tra 3 o più giocatori', () => {
  // Anna: Stop, 5 · Bruno: 0, 5 · Carla: Stop, 5 → tutti a 5
  const cima = ['Stop', '5', '0', '5', 'Stop', '5'];
  const giocaMano = (p: Partita) => p.rivela(2).rivela(2).fermati().rivela(2);

  it('si pescano le carte in gioco: vince il valore più alto, e i numeri (0 compreso) battono le speciali', () => {
    const p = giocaMano(new Partita({ giocatori: TRE, cima, poi: [['Stop', '0', 'Stop']] }));
    expect(p.s.vincitoreMano).toBe(1);
    expect(p.registro()).toContain('Anna pesca Stop, Bruno pesca 0, Carla pesca Stop.');
  });

  it('vince il numero più alto', () => {
    const p = giocaMano(new Partita({ giocatori: TRE, cima, poi: [['0', '5', 'Stop']] }));
    expect(p.s.vincitoreMano).toBe(1);
  });

  it('nuova parità tra 2 → moneta, sceglie chi ha pescato per secondo', () => {
    const p = giocaMano(new Partita({ giocatori: TRE, cima, poi: [['Stop', '5', '5']] }));
    expect(p.s.fase).toBe('moneta');
    expect(p.s.moneta).toEqual({ sceglie: 2, altro: 1 });
  });

  it('nuova parità tra 3 → si rimescola e si ripete', () => {
    const p = giocaMano(new Partita({ giocatori: TRE, cima, poi: [['5', '5', '5'], ['Stop', '0', 'Stop']] }));
    expect(p.registro()).toContain('Ancora pareggio tra 3: si rimescola e si ripete.');
    expect(p.s.vincitoreMano).toBe(1);
  });

  it('D8: si usano tutte le carte in gioco di tutti i giocatori, coperte comprese', () => {
    // Anna 5 (il 9 resta coperto), Bruno 5, Carla 5; Dario sballa. Il 9 coperto di Anna è nel mucchio.
    const p = new Partita({
      giocatori: ['Anna', 'Bruno', 'Carla', 'Dario'],
      cima: ['5', '9', '5', '0', '4', '1', '9', '8'],
      poi: [['9', '1', '0']],
    });
    p.rivela().fermati().rivela(2).fermati().rivela(2).fermati().rivela(2);
    expect(p.registro()).toContain('Pareggio tra 3 giocatori: si raccolgono 8 carte in gioco e si pesca.');
    expect(p.s.vincitoreMano).toBe(0);
  });
});
