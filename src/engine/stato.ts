// Lo "stato" della partita: una fotografia completa, fatta solo di dati.

import type { Carta } from './carte';
import type { Moneta } from './caso';

export const LIMITE = 9.5;

export interface CartaInGioco {
  carta: Carta;
  scoperta: boolean;
  /** Per le numeriche: 1, poi dimezzato a ogni Tagliatette usato dopo che è stata scoperta. */
  fattore: number;
  /** In che ordine è stata rivelata o pescata in questo turno (0 = ancora coperta). */
  ordine: number;
}

/** Un segnalino punto. carta è null quando il vincitore non aveva carte scoperte (decisione D10). */
export interface Segnalino {
  carta: Carta | null;
}

export type EsitoTurno = 'nonPartecipa' | 'daGiocare' | 'inTurno' | 'fermo' | 'sballato';

export interface Giocatore {
  nome: string;
  inGioco: CartaInGioco[];
  /** Tagliatette tenuti da parte; restano anche nelle mani successive. */
  riserva: Carta[];
  segnalini: Segnalino[];
  /** Usata solo dalla regola provvisoria P3 se l'autore cambierà la proposta; normalmente 0. */
  correzione: number;
  esito: EsitoTurno;
}

/** Una pescata obbligatoria in coda, con la carta (+1 o +2) che l'ha imposta. */
export interface PescataObbligatoria {
  origine: number;
}

export interface Turno {
  giocatore: number;
  coda: PescataObbligatoria[];
  /** Carte rivelate o pescate dall'inizio del turno, o dall'ultimo Giocoliere. */
  rivelazioniNelGruppo: number;
  /** Vero finché il giocatore deve ancora rivelare la prima carta (carte iniziali o dopo un Giocoliere). */
  deveRivelare: boolean;
  dopoGiocoliere: boolean;
  contatore: number;
}

export type Fase = 'turno' | 'decisioneSballo' | 'moneta' | 'segnalino' | 'finita';

export interface Evento {
  mano: number;
  tipo: string;
  testo: string;
  giocatore?: number;
}

export interface Stato {
  giocatori: Giocatore[];
  mazzo: Carta[];
  scarti: Carta[];
  modalita: 'esaurimentoMazzo' | 'obiettivoPunti';
  obiettivoPunti: number | null;
  numeroMano: number;
  primoGiocatore: number;
  /** Chi gioca questa mano, nell'ordine di gioco. */
  partecipanti: number[];
  ultimaMano: boolean;
  /** Mano di spareggio di fine partita (modalità esaurimento mazzo). */
  manoSpareggio: boolean;
  fase: Fase;
  turno: Turno | null;
  /** Durante un pareggio a 2: chi sceglie testa o croce, e l'altro giocatore. */
  moneta: { sceglie: number; altro: number } | null;
  vincitoreMano: number | null;
  vincitorePartita: number | null;
  registro: Evento[];
}

export type Azione =
  | { tipo: 'rivela'; giocatore: number }
  | { tipo: 'pesca'; giocatore: number }
  | { tipo: 'fermati'; giocatore: number }
  | { tipo: 'usaTagliatette'; giocatore: number }
  | { tipo: 'rinunciaTagliatette'; giocatore: number }
  | { tipo: 'scegliMoneta'; giocatore: number; scelta: Moneta }
  | { tipo: 'scegliSegnalino'; giocatore: number; cartaId: number | null };

export interface AzionePermessa {
  tipo: Azione['tipo'];
  giocatore: number;
  /** Per "pesca": vero se è una pescata obbligatoria (+1/+2). */
  obbligatoria?: boolean;
  /** Per "scegliSegnalino": le carte che si possono scegliere (null = segnalino senza carta). */
  carte?: (number | null)[];
}
