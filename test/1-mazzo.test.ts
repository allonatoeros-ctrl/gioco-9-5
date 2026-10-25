import { describe, expect, it } from 'vitest';
import { casoFinto, casoReale, creaMazzo, creaPartita, nomeCarta } from '../src/engine';

describe('Parte 1 – Mazzo e mescolamento', () => {
  it('il mazzo ha 115 carte: 84 numeriche e 31 speciali', () => {
    const m = creaMazzo();
    expect(m.length).toBe(115);
    expect(m.filter((c) => c.tipo === 'numero').length).toBe(84);
    expect(m.filter((c) => c.tipo !== 'numero').length).toBe(31);
  });

  it('le quantità di ogni carta sono quelle della sezione 2', () => {
    const conta: Record<string, number> = {};
    for (const c of creaMazzo()) conta[nomeCarta(c)] = (conta[nomeCarta(c)] ?? 0) + 1;
    expect(conta).toEqual({
      '0': 4, '0,5': 8,
      '1': 8, '2': 8, '3': 8, '4': 8, '5': 8, '6': 8, '7': 8, '8': 8, '9': 8,
      '+1': 8, '+2': 4, 'Cambio Tetta': 8, 'Stop': 8, 'Giocoliere': 1, 'Tagliatette': 2,
    });
  });

  it('ogni carta ha un numero di serie diverso', () => {
    expect(new Set(creaMazzo().map((c) => c.id)).size).toBe(115);
  });

  it('il caso vero mescola senza perdere né duplicare carte, ed è ripetibile con lo stesso seme', () => {
    const a = casoReale(42).mescola(creaMazzo());
    const b = casoReale(42).mescola(creaMazzo());
    const c = casoReale(7).mescola(creaMazzo());
    expect(a.map((x) => x.id)).toEqual(b.map((x) => x.id));
    expect(a.map((x) => x.id)).not.toEqual(c.map((x) => x.id));
    expect([...a.map((x) => x.id)].sort((x, y) => x - y)).toEqual(creaMazzo().map((x) => x.id));
  });

  it('il caso finto mette in cima le carte richieste, nell\'ordine richiesto', () => {
    const m = casoFinto({ mescolamenti: [['Stop', '7', 'Mezzo']] }).mescola(creaMazzo());
    expect(m.slice(0, 3).map(nomeCarta)).toEqual(['Stop', '7', '0,5']);
    expect(m.length).toBe(115);
  });

  it('la partita usa il generatore del caso che le viene dato (mescolamento e primo giocatore)', () => {
    const caso = casoFinto({ mescolamenti: [['9', '8']], interi: [1] });
    const s = creaPartita({ giocatori: ['Anna', 'Bruno'], caso });
    expect(s.primoGiocatore).toBe(1);
    expect(s.turno!.giocatore).toBe(1);
    expect(s.giocatori[1].inGioco.map((c) => nomeCarta(c.carta))).toEqual(['9', '8']);
    expect(s.mazzo.length).toBe(113);
  });

  it('accetta da 2 a 6 giocatori (O1) e sceglie la modalità giusta', () => {
    const caso = casoReale(1);
    expect(() => creaPartita({ giocatori: ['A'], caso })).toThrow();
    expect(() => creaPartita({ giocatori: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], caso })).toThrow();
    expect(creaPartita({ giocatori: ['A', 'B', 'C'], caso }).modalita).toBe('esaurimentoMazzo');
    const quattro = creaPartita({ giocatori: ['A', 'B', 'C', 'D'], caso, obiettivoPunti: 3 });
    expect(quattro.modalita).toBe('obiettivoPunti');
    expect(quattro.obiettivoPunti).toBe(3);
  });
});
