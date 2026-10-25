// REGOLE PROVVISORIE (regolamento, sezione 7).
// Sono proposte in attesa di conferma dell'autore. Stanno tutte qui, e solo qui,
// così se l'autore decide diversamente basta cambiare questo file.

import type { CartaInGioco } from './stato';

/**
 * P1 – Cambio Tetta con blocco Stop attivo.
 * Proposta: la sostituzione avviene sempre, perché è uno scambio e non una pescata libera.
 * Vale anche per le pescate del Giocoliere: lì però non serve mai, perché il Giocoliere
 * rimette nel mazzo anche gli Stop e quindi le sue pescate avvengono sempre senza blocco.
 */
export function p1_sostituzioneAncheConStopAttivo(): boolean {
  return true;
}

/**
 * P2 – Cambio Tetta come prima carta rivelata dopo un Giocoliere, con più carte ancora coperte.
 * Proposta: sostituisce la prossima carta coperta in ordine, senza guardarla.
 * Riceve le carte ancora coperte, in ordine, e restituisce quella da sostituire.
 */
export function p2_qualeCopertaSostituireDopoGiocoliere(coperte: CartaInGioco[]): CartaInGioco {
  return coperte[0];
}

/**
 * P3 – Cambio Tetta dopo un Tagliatette rimuove una carta contata prima del dimezzamento.
 * Esempio: 5, +2, esce 9 (14, sballo), Tagliatette → 7, poi Cambio Tetta rimuove il 9.
 * Proposta: si toglie la metà del valore della carta (4,5), quindi il punteggio scende a 2,5.
 * In generale: si toglie il valore della carta per come conta adesso (già dimezzato
 * tante volte quanti Tagliatette sono stati usati dopo che è stata scoperta).
 */
export function p3_valoreDaTogliere(carta: CartaInGioco): number {
  if (carta.carta.tipo !== 'numero' || !carta.scoperta) return 0;
  return carta.carta.valore * carta.fattore;
}
