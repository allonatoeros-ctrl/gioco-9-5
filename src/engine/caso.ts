// Il "generatore del caso": mescolamenti, primo giocatore, lancio della moneta.
// È sostituibile: nei test si usa casoFinto per fissare l'ordine esatto delle carte.

import { Carta, corrispondeANome } from './carte';

export type Moneta = 'testa' | 'croce';

export interface Caso {
  /** Restituisce le carte in un nuovo ordine. La prima carta è quella in cima al mazzo. */
  mescola(carte: Carta[]): Carta[];
  /** Un numero intero da 0 a n-1. */
  intero(n: number): number;
  moneta(): Moneta;
}

/**
 * Caso vero. Con un "seme" la sequenza è ripetibile (utile per riprodurre una partita);
 * senza seme è diversa ogni volta.
 */
export function casoReale(seme: number = Math.floor(Math.random() * 2 ** 32)): Caso {
  let s = seme >>> 0;
  // mulberry32: piccolo generatore di numeri casuali ripetibile
  const casuale = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    mescola(carte) {
      const a = [...carte];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(casuale() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    intero: (n) => Math.floor(casuale() * n),
    moneta: () => (casuale() < 0.5 ? 'testa' : 'croce'),
  };
}

export interface CopioneCaso {
  /**
   * Un elenco per ogni mescolamento, nell'ordine in cui avvengono.
   * Ogni elenco dice quali carte mettere in cima, in quell'ordine (es. ["Stop", "7"]);
   * le altre carte restano nell'ordine in cui erano. Finiti gli elenchi, il mescolamento
   * lascia le carte come sono.
   */
  mescolamenti?: string[][];
  /** Risultati di intero(), in ordine. Finiti, restituisce 0 (primo giocatore = il primo in elenco). */
  interi?: number[];
  /** Risultati dei lanci di moneta, in ordine. Finiti, restituisce "testa". */
  monete?: Moneta[];
}

/** Caso finto per i test: tutto è deciso in anticipo dal copione. */
export function casoFinto(copione: CopioneCaso = {}): Caso & { mescolamentiFatti: number } {
  const mescolamenti = [...(copione.mescolamenti ?? [])];
  const interi = [...(copione.interi ?? [])];
  const monete = [...(copione.monete ?? [])];
  const caso = {
    mescolamentiFatti: 0,
    mescola(carte: Carta[]) {
      caso.mescolamentiFatti++;
      const inCima = mescolamenti.shift() ?? [];
      const resto = [...carte];
      const cima: Carta[] = [];
      for (const nome of inCima) {
        const i = resto.findIndex((c) => corrispondeANome(c, nome));
        if (i < 0) throw new Error(`casoFinto: nessuna carta "${nome}" disponibile da mettere in cima`);
        cima.push(resto.splice(i, 1)[0]);
      }
      return [...cima, ...resto];
    },
    intero(n: number) {
      const v = interi.shift() ?? 0;
      if (v < 0 || v >= n) throw new Error(`casoFinto: intero ${v} fuori da 0..${n - 1}`);
      return v;
    },
    moneta: (): Moneta => monete.shift() ?? 'testa',
  };
  return caso;
}
