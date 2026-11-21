// Il "cervello" dei giocatori computer.
//
// Il computer gioca onesto: guarda SOLO la vista pubblica (quello che vede anche
// un giocatore vero), mai le carte coperte o l'ordine del mazzo.
// Non c'è nessuna regola qui: sceglie solo tra le mosse che il motore permette.

import { eNumerica } from '../engine';
import type { AzionePermessa } from '../engine';
import type { VistaPartita } from '../server/vista';
import type { RichiestaMossa } from './cliente';
import { calcolaDaBattere, stimaRischio } from './vivo';

/** Nomi dei giocatori computer (il primo avversario è Gino, poi gli altri). */
export const NOMI_COMPUTER = ['Gino', 'Pina', 'Il Conte', 'Rosetta', 'Baffo'];

/**
 * Coraggio di ogni computer: il rischio massimo di sballare che accetta per pescare ancora.
 * Gino è prudente, il Conte è un azzardoso, gli altri stanno in mezzo.
 */
export const CORAGGIO = [0.3, 0.4, 0.5, 0.35, 0.45];

export function decidiMossa(
  v: VistaPartita,
  io: number,
  coraggio = 0.4,
  caso: () => number = Math.random,
): RichiestaMossa | null {
  const mie: AzionePermessa[] = v.azioniPermesse.filter((a) => a.giocatore === io);
  if (mie.length === 0) return null;
  const puo = (t: AzionePermessa['tipo']) => mie.some((a) => a.tipo === t);

  // Pareggio a due: testa o croce a caso.
  if (puo('scegliMoneta')) return { tipo: 'scegliMoneta', scelta: caso() < 0.5 ? 'testa' : 'croce' };

  // Ha vinto la mano: tiene come segnalino la carta numerica più alta.
  const segnalino = mie.find((a) => a.tipo === 'scegliSegnalino');
  if (segnalino) {
    const carte = segnalino.carte ?? [null];
    const mieCarte = v.giocatori[io].inGioco;
    let migliore: number | null = carte[0];
    let valoreMigliore = -Infinity;
    for (const id of carte) {
      const c = mieCarte.find((x) => !x.coperta && x.carta.id === id);
      const val = c && !c.coperta && eNumerica(c.carta) ? c.carta.valore : -1;
      if (val > valoreMigliore) { valoreMigliore = val; migliore = id; }
    }
    return { tipo: 'scegliSegnalino', cartaId: migliore };
  }

  // Ha sballato e ha un Tagliatette: si salva sempre.
  if (puo('rinunciaTagliatette')) return { tipo: 'usaTagliatette' };

  // Pescata obbligatoria (+1 / +2).
  if (mie.some((a) => a.tipo === 'pesca' && a.obbligatoria)) return { tipo: 'pesca' };

  const avanti: RichiestaMossa | null = puo('rivela') ? { tipo: 'rivela' } : puo('pesca') ? { tipo: 'pesca' } : null;
  if (!puo('fermati')) return avanti ?? (puo('usaTagliatette') ? { tipo: 'usaTagliatette' } : null);
  if (!avanti) return { tipo: 'fermati' };

  const me = v.giocatori[io];
  const p = me.punteggio;
  const conNumeri = me.inGioco.some((c) => !c.coperta && eNumerica(c.carta));
  if (conNumeri && p === 9.5) return { tipo: 'fermati' };
  // Solo carte speciali: fermarsi vale quasi niente, conviene sempre provarci.
  if (!conNumeri) return avanti;

  const rischio = stimaRischio(v, io);
  const d = calcolaDaBattere(v, io);
  // Qualcuno ha già fatto di più: fermarsi vuol dire perdere, tanto vale rischiare.
  if (d?.stato === 'sotto') return avanti;
  // Pari: si rischia solo se non è troppo pericoloso (altrimenti si va alla moneta).
  if (d?.stato === 'pari') return rischio < 0.5 ? avanti : { tipo: 'fermati' };
  // È l'ultimo a giocare ed è già in testa: si ferma e vince.
  const dopoDiMe = v.giocatori.filter((g, i) => i !== io && g.esito === 'daGiocare').length;
  if (dopoDiMe === 0 && d?.stato === 'sopra') return { tipo: 'fermati' };
  // Se dopo di lui gioca ancora qualcuno, con un punteggio basso è meglio spingere un po' di più.
  const soglia = dopoDiMe > 0 && p < 7 ? coraggio + 0.1 : coraggio;
  return rischio <= soglia ? avanti : { tipo: 'fermati' };
}
