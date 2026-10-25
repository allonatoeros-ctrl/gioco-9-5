// Strumenti per scrivere i test in modo leggibile.

import { expect } from 'vitest';
import {
  Azione,
  Caso,
  Moneta,
  Stato,
  applicaAzione,
  azioniPermesse,
  casoFinto,
  corrispondeANome,
  creaPartita,
  nomeCarta,
  punteggio,
} from '../src/engine';

export interface Preparazione {
  giocatori?: string[];
  /** Carte in cima al mazzo all'inizio, nell'ordine in cui verranno date e pescate. */
  cima: string[];
  /** Carte da mettere in cima dopo ogni mescolamento successivo (Cambio Tetta, Giocoliere…). */
  poi?: string[][];
  monete?: Moneta[];
  /** Primo giocatore (indice). Se manca è il primo dell'elenco. */
  primo?: number;
  obiettivoPunti?: number;
}

export class Partita {
  s: Stato;
  caso: Caso;
  constructor(p: Preparazione) {
    this.caso = casoFinto({
      mescolamenti: [p.cima, ...(p.poi ?? [])],
      interi: [p.primo ?? 0],
      monete: p.monete,
    });
    this.s = creaPartita({
      giocatori: p.giocatori ?? ['Anna', 'Bruno'],
      caso: this.caso,
      obiettivoPunti: p.obiettivoPunti,
    });
  }
  /** Il giocatore che deve agire adesso. */
  get chi(): number {
    return azioniPermesse(this.s)[0]?.giocatore ?? -1;
  }
  fai(tipo: Azione['tipo'], extra: Record<string, unknown> = {}): this {
    this.s = applicaAzione(this.s, { tipo, giocatore: this.chi, ...extra } as Azione, this.caso);
    return this;
  }
  rivela(volte = 1) {
    for (let k = 0; k < volte; k++) this.fai('rivela');
    return this;
  }
  pesca(volte = 1) {
    for (let k = 0; k < volte; k++) this.fai('pesca');
    return this;
  }
  fermati() {
    return this.fai('fermati');
  }
  usaTagliatette() {
    return this.fai('usaTagliatette');
  }
  /** Azioni permesse adesso, solo i tipi. */
  azioni(): string[] {
    return azioniPermesse(this.s).map((a) => a.tipo);
  }
  puo(tipo: Azione['tipo']): boolean {
    return this.azioni().includes(tipo);
  }
  punti(g = 0): number {
    return punteggio(this.s, g);
  }
  /** Carte in gioco di un giocatore, es. ["5", "Stop", "(coperta)"]. */
  inGioco(g = 0): string[] {
    return this.s.giocatori[g].inGioco.map((c) => (c.scoperta ? nomeCarta(c.carta) : '(coperta)'));
  }
  /** Le carte coperte, con il loro nome vero (solo per i controlli nei test). */
  coperteVere(g = 0): string[] {
    return this.s.giocatori[g].inGioco.filter((c) => !c.scoperta).map((c) => nomeCarta(c.carta));
  }
  riserva(g = 0): string[] {
    return this.s.giocatori[g].riserva.map(nomeCarta);
  }
  /** Prepara la riserva: sposta un Tagliatette dal mazzo alla riserva del giocatore. */
  dammiTagliatette(g = 0) {
    const i = this.s.mazzo.findIndex((c) => c.tipo === 'tagliatette');
    this.s.giocatori[g].riserva.push(...this.s.mazzo.splice(i, 1));
    return this;
  }
  /** Testi del registro eventi. */
  registro(): string[] {
    return this.s.registro.map((e) => e.testo);
  }
  /** Quante carte di un certo nome ci sono nel mazzo. */
  nelMazzo(nome: string): number {
    return this.s.mazzo.filter((c) => corrispondeANome(c, nome)).length;
  }
}

/** Controllo di base: le 115 carte ci sono sempre tutte, da qualche parte. */
export function controllaCarte(s: Stato) {
  const ids = [
    ...s.mazzo,
    ...s.scarti,
    ...s.giocatori.flatMap((g) => [
      ...g.inGioco.map((c) => c.carta),
      ...g.riserva,
      ...g.segnalini.flatMap((x) => (x.carta ? [x.carta] : [])),
    ]),
  ].map((c) => c.id);
  expect(new Set(ids).size).toBe(115);
  expect(ids.length).toBe(115);
}
