// La "vista pubblica" della partita: quello che TUTTI i giocatori possono vedere.
//
// Il server tiene per sé lo stato completo (mazzo in ordine, carte coperte, scarti).
// Ai telefoni dei giocatori arriva solo questa vista, così nessuno può sbirciare
// le carte coperte o l'ordine del mazzo, nemmeno guardando i dati che riceve.
//
// Regolamento, sezione 3: "Tutte le carte scoperte, le riserve e i segnalini sono
// visibili a tutti in ogni momento". Le carte coperte non le vede nessuno, neanche chi le ha.

import {
  AzionePermessa,
  Carta,
  EsitoTurno,
  Evento,
  Fase,
  Segnalino,
  Stato,
  azioniPermesse,
  punteggio,
  stopAttivo,
} from '../engine';

export type CartaVista =
  | { coperta: true }
  | { coperta: false; carta: Carta; fattore: number; ordine: number };

export interface GiocatoreVista {
  nome: string;
  inGioco: CartaVista[];
  riserva: Carta[];
  segnalini: Segnalino[];
  esito: EsitoTurno;
  punteggio: number;
  stopAttivo: boolean;
}

export interface VistaPartita {
  giocatori: GiocatoreVista[];
  carteNelMazzo: number;
  carteNegliScarti: number;
  modalita: Stato['modalita'];
  obiettivoPunti: number | null;
  numeroMano: number;
  primoGiocatore: number;
  partecipanti: number[];
  ultimaMano: boolean;
  manoSpareggio: boolean;
  fase: Fase;
  turno: null | {
    giocatore: number;
    deveRivelare: boolean;
    pescateObbligatorie: number;
  };
  moneta: Stato['moneta'];
  vincitoreMano: number | null;
  vincitorePartita: number | null;
  /** Le mosse che si possono fare adesso (sempre e solo dal motore). */
  azioniPermesse: AzionePermessa[];
  /** Gli ultimi eventi della partita, per il racconto a schermo. */
  registro: Evento[];
}

/** Quanti eventi del registro mandare ai giocatori (i più recenti). */
export const EVENTI_NELLA_VISTA = 300;

export function vistaPubblica(stato: Stato): VistaPartita {
  return {
    giocatori: stato.giocatori.map((g, i) => ({
      nome: g.nome,
      inGioco: g.inGioco.map((c) =>
        c.scoperta
          ? { coperta: false, carta: c.carta, fattore: c.fattore, ordine: c.ordine }
          : { coperta: true },
      ),
      riserva: g.riserva,
      segnalini: g.segnalini,
      esito: g.esito,
      punteggio: punteggio(stato, i),
      stopAttivo: stopAttivo(stato, i),
    })),
    carteNelMazzo: stato.mazzo.length,
    carteNegliScarti: stato.scarti.length,
    modalita: stato.modalita,
    obiettivoPunti: stato.obiettivoPunti,
    numeroMano: stato.numeroMano,
    primoGiocatore: stato.primoGiocatore,
    partecipanti: stato.partecipanti,
    ultimaMano: stato.ultimaMano,
    manoSpareggio: stato.manoSpareggio,
    fase: stato.fase,
    turno: stato.turno
      ? {
          giocatore: stato.turno.giocatore,
          deveRivelare: stato.turno.deveRivelare,
          pescateObbligatorie: stato.turno.coda.length,
        }
      : null,
    moneta: stato.moneta,
    vincitoreMano: stato.vincitoreMano,
    vincitorePartita: stato.vincitorePartita,
    azioniPermesse: azioniPermesse(stato),
    registro: stato.registro.slice(-EVENTI_NELLA_VISTA),
  };
}
