// Prova della logica del server online: avvio, mosse, e soprattutto che la vista
// mandata ai telefoni non riveli mai carte coperte o l'ordine del mazzo.
import { describe, expect, it } from 'vitest';
import { ErroreAzione, Stato, casoReale } from '../../src/engine';
import { avviaPartita, casoSicuro, eseguiMossa, leggiAzione, VistaPartita } from '../../src/server';

/** Gli id delle carte che nessuno deve vedere: mazzo, scarti e carte coperte. */
function idSegreti(s: Stato): Set<number> {
  const ids = new Set<number>();
  for (const c of s.mazzo) ids.add(c.id);
  for (const c of s.scarti) ids.add(c.id);
  for (const g of s.giocatori) for (const c of g.inGioco) if (!c.scoperta) ids.add(c.carta.id);
  return ids;
}

/** Tutti gli id di carta che compaiono nella vista (in qualunque punto). */
function idNellaVista(v: VistaPartita): Set<number> {
  const ids = new Set<number>();
  const visita = (x: unknown, chiave = '') => {
    if (Array.isArray(x)) x.forEach((y) => visita(y));
    else if (x && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      if ('tipo' in o && typeof o.id === 'number' && chiave !== 'azione') ids.add(o.id);
      for (const [k, y] of Object.entries(o)) visita(y, k);
    }
  };
  visita({ ...v, azioniPermesse: [] });
  return ids;
}

/** Controlla che le carte scoperte e in riserva nella vista non siano tra quelle segrete. */
function controllaSegreti(stato: Stato, vista: VistaPartita) {
  const segreti = idSegreti(stato);
  // Le carte nei segnalini restano visibili e non sono più nel mazzo, quindi non si sovrappongono.
  for (const id of idNellaVista(vista)) expect(segreti.has(id), `carta ${id} visibile ma segreta`).toBe(false);
  const testo = JSON.stringify(vista);
  expect(testo).not.toContain('"mazzo"');
  expect(testo).not.toContain('"scarti"');
  for (const g of vista.giocatori) {
    for (const c of g.inGioco) if (c.coperta) expect(Object.keys(c)).toEqual(['coperta']);
  }
}

describe('Server online', () => {
  it('avvia una partita con 2 giocatori: tutti vedono solo carte coperte e il numero di carte nel mazzo', () => {
    const { stato, vista } = avviaPartita(['Anna', 'Bruno'], null);
    expect(vista.giocatori.map((g) => g.nome)).toEqual(['Anna', 'Bruno']);
    expect(vista.carteNelMazzo).toBe(stato.mazzo.length);
    expect(vista.azioniPermesse.length).toBeGreaterThan(0);
    controllaSegreti(stato, vista);
  });

  it('con 4+ giocatori l\'obiettivo può essere solo 3, 5 o 7 (O2); se manca vale 5', () => {
    expect(avviaPartita(['A', 'B', 'C', 'D'], null).vista.obiettivoPunti).toBe(5);
    expect(avviaPartita(['A', 'B', 'C', 'D'], 7).vista.obiettivoPunti).toBe(7);
    expect(() => avviaPartita(['A', 'B', 'C', 'D'], 4)).toThrow(ErroreAzione);
    expect(avviaPartita(['A', 'B', 'C'], 7).vista.obiettivoPunti).toBeNull();
  });

  it('meno di 2 o più di 6 giocatori: rifiutato (O1)', () => {
    expect(() => avviaPartita(['A'], null)).toThrow(ErroreAzione);
    expect(() => avviaPartita(['A', 'B', 'C', 'D', 'E', 'F', 'G'], null)).toThrow(ErroreAzione);
  });

  it('un giocatore non può muovere al posto di un altro', () => {
    const { stato, vista } = avviaPartita(['Anna', 'Bruno'], null);
    const diTurno = vista.turno!.giocatore;
    const altro = 1 - diTurno;
    expect(() => eseguiMossa(stato, altro, { tipo: 'rivela' })).toThrow(ErroreAzione);
    // Anche se il telefono prova a dire "sono l'altro giocatore", conta solo chi è collegato.
    expect(() => eseguiMossa(stato, altro, { tipo: 'rivela', giocatore: diTurno })).toThrow(ErroreAzione);
    expect(() => eseguiMossa(stato, diTurno, { tipo: 'rivela' })).not.toThrow();
  });

  it('dati strani dal telefono vengono rifiutati', () => {
    expect(() => leggiAzione(null, 0)).toThrow(ErroreAzione);
    expect(() => leggiAzione('rivela', 0)).toThrow(ErroreAzione);
    expect(() => leggiAzione({ tipo: 'bara' }, 0)).toThrow(ErroreAzione);
    expect(() => leggiAzione({ tipo: 'scegliMoneta', scelta: 'bordo' }, 0)).toThrow(ErroreAzione);
    expect(() => leggiAzione({ tipo: 'scegliSegnalino', cartaId: '5' }, 0)).toThrow(ErroreAzione);
    expect(leggiAzione({ tipo: 'scegliSegnalino', cartaId: null }, 2)).toEqual({ tipo: 'scegliSegnalino', giocatore: 2, cartaId: null });
    expect(leggiAzione({ tipo: 'pesca', giocatore: 5 }, 1)).toEqual({ tipo: 'pesca', giocatore: 1 });
  });

  it('il caso sicuro mescola davvero e restituisce tutte le carte', () => {
    const caso = casoSicuro();
    const carte = Array.from({ length: 115 }, (_, i) => ({ id: i + 1, tipo: 'numero' as const, valore: 1 }));
    const m = caso.mescola(carte);
    expect(m.map((c) => c.id).sort((a, b) => a - b)).toEqual(carte.map((c) => c.id));
    expect(m.map((c) => c.id)).not.toEqual(carte.map((c) => c.id));
    for (let i = 0; i < 1000; i++) {
      const n = caso.intero(6);
      expect(n >= 0 && n < 6).toBe(true);
    }
  });

  for (const n of [2, 3, 4, 6]) {
    it(`20 partite complete con ${n} giocatori via server: nessuna carta segreta trapela mai`, () => {
      for (let p = 0; p < 20; p++) {
        const scelte = casoReale(p * 31 + n);
        let { stato, vista, finita } = avviaPartita(Array.from({ length: n }, (_, i) => `G${i}`), n >= 4 ? 3 : null);
        let passi = 0;
        while (!finita) {
          controllaSegreti(stato, vista);
          const a = vista.azioniPermesse[scelte.intero(vista.azioniPermesse.length)];
          let richiesta: Record<string, unknown> = { tipo: a.tipo };
          if (a.tipo === 'scegliMoneta') richiesta = { tipo: a.tipo, scelta: scelte.moneta() };
          if (a.tipo === 'scegliSegnalino') richiesta = { tipo: a.tipo, cartaId: a.carte![0] };
          if (a.tipo === 'pesca' && !a.obbligatoria && vista.giocatori[a.giocatore].punteggio > 7 &&
              vista.azioniPermesse.some((x) => x.tipo === 'fermati')) richiesta = { tipo: 'fermati' };
          ({ stato, vista, finita } = eseguiMossa(stato, a.giocatore, richiesta));
          // Lo stato deve poter essere salvato nel database (JSON) e riletto identico.
          stato = JSON.parse(JSON.stringify(stato));
          if (++passi > 20000) throw new Error('partita troppo lunga');
        }
        expect(vista.vincitorePartita).not.toBeNull();
        expect(() => eseguiMossa(stato, 0, { tipo: 'fermati' })).toThrow('già finita');
      }
    });
  }
});
