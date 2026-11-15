// Le operazioni del server di gioco, senza database: ricevono uno stato e restituiscono
// il nuovo stato più la vista pubblica. Il database (Supabase) le chiama dalla
// "Edge Function" in supabase/functions/gioco/.
//
// Qui non c'è nessuna regola del gioco: tutto viene dal motore in src/engine/.
// Il server si limita a controllare CHI sta chiedendo la mossa.

import { Azione, Caso, ErroreAzione, Stato, applicaAzione, creaPartita } from '../engine';
import { casoSicuro } from './caso-sicuro';
import { VistaPartita, vistaPubblica } from './vista';

/** Decisione O2: con 4 o più giocatori l'obiettivo si sceglie tra 3, 5 e 7. */
export const OBIETTIVI_PERMESSI = [3, 5, 7] as const;

export interface Risultato {
  stato: Stato;
  vista: VistaPartita;
  finita: boolean;
}

export function avviaPartita(nomi: string[], obiettivoPunti: number | null, caso: Caso = casoSicuro()): Risultato {
  if (nomi.length >= 4) {
    const ob = obiettivoPunti ?? 5;
    if (!(OBIETTIVI_PERMESSI as readonly number[]).includes(ob)) {
      throw new ErroreAzione('L\'obiettivo punti può essere 3, 5 o 7.');
    }
    obiettivoPunti = ob;
  }
  const stato = creaPartita({ giocatori: nomi, obiettivoPunti: obiettivoPunti ?? undefined, caso });
  return { stato, vista: vistaPubblica(stato), finita: stato.fase === 'finita' };
}

/**
 * Trasforma quello che arriva dal telefono (dati non fidati) in un'Azione del motore.
 * Il giocatore NON lo decide il telefono: è quello collegato all'utente che ha fatto la richiesta.
 */
export function leggiAzione(richiesta: unknown, giocatore: number): Azione {
  if (typeof richiesta !== 'object' || richiesta === null) throw new ErroreAzione('Mossa non valida.');
  const r = richiesta as Record<string, unknown>;
  switch (r.tipo) {
    case 'rivela':
    case 'pesca':
    case 'fermati':
    case 'usaTagliatette':
    case 'rinunciaTagliatette':
      return { tipo: r.tipo, giocatore };
    case 'scegliMoneta':
      if (r.scelta !== 'testa' && r.scelta !== 'croce') throw new ErroreAzione('Scegli testa o croce.');
      return { tipo: 'scegliMoneta', giocatore, scelta: r.scelta };
    case 'scegliSegnalino':
      if (r.cartaId !== null && !Number.isInteger(r.cartaId)) throw new ErroreAzione('Carta non valida.');
      return { tipo: 'scegliSegnalino', giocatore, cartaId: r.cartaId as number | null };
    default:
      throw new ErroreAzione('Mossa sconosciuta.');
  }
}

/** Applica la mossa di un giocatore. Il motore rifiuta (ErroreAzione) ogni mossa non permessa. */
export function eseguiMossa(stato: Stato, giocatore: number, richiesta: unknown, caso: Caso = casoSicuro()): Risultato & { azione: Azione } {
  if (stato.fase === 'finita') throw new ErroreAzione('La partita è già finita.');
  const azione = leggiAzione(richiesta, giocatore);
  const nuovo = applicaAzione(stato, azione, caso);
  return { stato: nuovo, vista: vistaPubblica(nuovo), finita: nuovo.fase === 'finita', azione };
}
