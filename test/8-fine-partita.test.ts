import { describe, expect, it } from 'vitest';
import { azioniPermesse } from '../src/engine';
import { Partita, controllaCarte } from './aiuti';

/** Preparazione: lascia nel mazzo solo le prime n carte, le altre vanno negli scarti. */
function tagliaMazzo(p: Partita, n: number) {
  p.s.scarti.push(...p.s.mazzo.splice(n));
}
function scegliPrimaCarta(p: Partita) {
  const a = azioniPermesse(p.s)[0];
  p.fai('scegliSegnalino', { cartaId: a.carte![0] });
}

describe('Parte 8 – Fine partita, modalità esaurimento mazzo (2–3 giocatori)', () => {
  it('se il mazzo finisce durante una mano si rimescolano gli scarti e quella mano è l\'ultima', () => {
    const p = new Partita({ cima: ['5', '3', '2', '1', '4'] });
    tagliaMazzo(p, 3); // restano 2, 1, 4
    p.rivela(2).fermati(); // Anna 8
    p.rivela(2).pesca(); // Bruno 2, 1, 4 = 7: il mazzo finisce
    expect(p.s.ultimaMano).toBe(true);
    expect(p.registro()).toContain('Questa mano è l\'ultima della partita.');
    expect(p.s.mazzo.length).toBeGreaterThan(0);
    p.fermati();
    scegliPrimaCarta(p);
    expect(p.s.fase).toBe('finita');
    expect(p.s.vincitorePartita).toBe(0);
    controllaCarte(p.s);
  });

  it('D7: se a fine mano restano meno di 2 carte per giocatore, si rimescola tutto e la mano seguente è l\'ultima', () => {
    const p = new Partita({ cima: ['5', '3', '2', '1', '4', '6', '7'], poi: [['9', '8', '5', '2']] });
    tagliaMazzo(p, 5); // restano 2, 1, 4, 6, 7
    p.rivela(2).fermati().rivela(2).fermati(); // Anna 8, Bruno 3; nel mazzo restano 3 carte
    scegliPrimaCarta(p);
    expect(p.registro().some((t) => t.startsWith('Le carte non bastano per la prossima mano'))).toBe(true);
    expect(p.s.numeroMano).toBe(2);
    expect(p.s.ultimaMano).toBe(true);
    // Mano 2: inizia Bruno (9, 8 → sballa), poi Anna (5, 2)
    p.rivela(2).rivela(2).fermati();
    scegliPrimaCarta(p);
    expect(p.s.fase).toBe('finita');
    expect(p.s.vincitorePartita).toBe(0);
    expect(p.s.giocatori[0].segnalini.length).toBe(2);
  });

  it('con 4 carte per 2 giocatori la mano seguente si gioca normalmente', () => {
    const p = new Partita({ cima: ['5', '3', '2', '1', '4', '6', '7', '8'] });
    tagliaMazzo(p, 6);
    p.rivela(2).fermati().rivela(2).fermati();
    scegliPrimaCarta(p);
    expect(p.s.ultimaMano).toBe(false);
  });

  it('vince chi ha più segnalini', () => {
    const p = new Partita({ cima: ['5', '3', '2', '1'] });
    p.s.ultimaMano = true;
    p.s.giocatori[1].segnalini.push({ carta: null }, { carta: null });
    p.rivela(2).fermati().rivela(2).fermati();
    scegliPrimaCarta(p); // Anna 1, Bruno 2
    expect(p.s.vincitorePartita).toBe(1);
  });

  it('in parità di segnalini si gioca una mano di spareggio solo tra i pari', () => {
    const p = new Partita({ giocatori: ['Anna', 'Bruno', 'Carla'], cima: ['5', '3', '2', '1', '9', '0', '6', '2', '4', '4'] });
    p.s.ultimaMano = true;
    p.s.giocatori[0].segnalini.push({ carta: null }, { carta: null });
    p.s.giocatori[1].segnalini.push({ carta: null });
    p.rivela(2).fermati().rivela(2).fermati().rivela(2).fermati(); // Anna 8, Bruno 3, Carla 9
    scegliPrimaCarta(p); // vince Carla: Anna 2, Bruno 1, Carla 1 → nessuna parità in testa
    expect(p.s.vincitorePartita).toBe(0);

    const q = new Partita({ giocatori: ['Anna', 'Bruno', 'Carla'], cima: ['5', '3', '2', '1', '9', '0', '6', '2', '4', '4'] });
    q.s.ultimaMano = true;
    q.s.giocatori[0].segnalini.push({ carta: null });
    q.rivela(2).fermati().rivela(2).fermati().rivela(2).fermati();
    scegliPrimaCarta(q); // Anna 1, Carla 1 → spareggio
    expect(q.s.fase).toBe('turno');
    expect(q.s.manoSpareggio).toBe(true);
    expect(q.s.partecipanti).toEqual([2, 0]); // il primo giocatore è passato a Bruno, che non gioca
    expect(q.s.giocatori[1].esito).toBe('nonPartecipa');
    q.rivela(2).fermati(); // Carla 6, 2 = 8
    q.rivela(2).fermati(); // Anna 4, 4 = 8 → moneta
    q.fai('scegliMoneta', { scelta: 'testa' }); // sceglie Anna (seconda), esce testa
    scegliPrimaCarta(q);
    expect(q.s.fase).toBe('finita');
    expect(q.s.vincitorePartita).toBe(0);
  });

  it('se nella mano di spareggio sballano tutti se ne gioca un\'altra', () => {
    const q = new Partita({ cima: ['5', '3', '6', '2', '9', '9', '8', '8', '5', '1', '2', '2'] });
    q.s.ultimaMano = true;
    q.s.giocatori[1].segnalini.push({ carta: null });
    q.rivela(2).fermati().rivela(2).fermati(); // Anna 8, Bruno 8 → moneta
    q.fai('scegliMoneta', { scelta: 'croce' }); // esce testa: vince Anna → 1 a 1
    scegliPrimaCarta(q);
    expect(q.s.manoSpareggio).toBe(true);
    q.rivela(2).rivela(2); // Bruno 9+9, Anna 8+8: sballano tutti
    expect(q.registro()).toContain('Nessun vincitore nella mano di spareggio: se ne gioca un\'altra.');
    expect(q.s.numeroMano).toBe(3);
    q.rivela(2).fermati().rivela(2).fermati(); // Anna 5+1=6, Bruno 2+2=4
    scegliPrimaCarta(q);
    expect(q.s.vincitorePartita).toBe(0);
  });
});

describe('Parte 8 – Fine partita, modalità obiettivo punti (4 o più giocatori)', () => {
  const QUATTRO = ['Anna', 'Bruno', 'Carla', 'Dario'];

  it('la partita continua finché nessuno raggiunge l\'obiettivo', () => {
    const p = new Partita({ giocatori: QUATTRO, obiettivoPunti: 2, cima: ['5', '3', '2', '1', '4', '1', '1', '1'] });
    p.rivela(2).fermati().rivela(2).fermati().rivela(2).fermati().rivela(2).fermati();
    scegliPrimaCarta(p); // Anna vince con 8: 1 punto su 2
    expect(p.s.fase).toBe('turno');
    expect(p.s.numeroMano).toBe(2);
    expect(p.s.ultimaMano).toBe(false);
  });

  it('il primo che raggiunge l\'obiettivo vince', () => {
    const p = new Partita({ giocatori: QUATTRO, obiettivoPunti: 3, cima: ['5', '3', '2', '1', '4', '1', '1', '1'] });
    p.s.giocatori[0].segnalini.push({ carta: null }, { carta: null });
    p.s.giocatori[1].segnalini.push({ carta: null }, { carta: null });
    p.rivela(2).fermati().rivela(2).fermati().rivela(2).fermati().rivela(2).fermati();
    scegliPrimaCarta(p);
    expect(p.s.fase).toBe('finita');
    expect(p.s.vincitorePartita).toBe(0);
    expect(p.registro()).toContain('Fine partita: vince Anna, che raggiunge l\'obiettivo di 3 punti.');
  });

  it('se il mazzo finisce si rimescolano gli scarti e la partita continua', () => {
    const p = new Partita({ giocatori: QUATTRO, obiettivoPunti: 5, cima: ['5', '3', '2', '1', '4'] });
    p.s.scarti.push(...p.s.mazzo.splice(4)); // restano 2, 1, 4 e una carta
    p.rivela(2).fermati(); // Anna
    p.rivela(2).fermati(); // Bruno: 2, 1
    p.rivela(2).fermati(); // Carla: il mazzo finisce durante la sua distribuzione
    expect(p.registro().some((t) => t.startsWith('Il mazzo è finito: si rimescolano gli scarti'))).toBe(true);
    expect(p.s.ultimaMano).toBe(false);
    controllaCarte(p.s);
  });
});
