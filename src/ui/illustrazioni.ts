// Illustrazioni delle carte: il mazzo "a china", ricalcato dagli schizzi a matita di Eros.
// Ogni carta è un'immagine WebP già pronta (disegno + cornice oro + numeri blu notte),
// in src/ui/carte/. Vite le copia in /assets con un nome che cambia quando cambia il disegno,
// e il service worker le tiene in memoria sul telefono insieme al resto del gioco.

import type { Carta } from '../engine';

const FILE = import.meta.glob('./carte/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

/** Chiave della carta → indirizzo dell'immagine. Numeri: "0", "0.5", "1"…; speciali: "piu1", "stop"… */
const IMMAGINI = new Map<string, string>(
  Object.entries(FILE).map(([percorso, url]) => [percorso.slice('./carte/'.length, -'.webp'.length), url]),
);

function chiave(carta: Carta): string {
  return carta.tipo === 'numero' ? String(carta.valore) : carta.tipo;
}

/** Illustrazione di una carta, se esiste; altrimenti la carta si mostra col solo nome. */
export function illustrazione(carta: Carta): string | undefined {
  return IMMAGINI.get(chiave(carta));
}

/** Tenute in memoria perché il telefono non debba ridisegnarle da capo a ogni mossa. */
const giaDecodificate: HTMLImageElement[] = [];

/**
 * Prepara in anticipo tutte le illustrazioni, una alla volta e quando il telefono
 * non ha altro da fare: così, quando una carta si gira, il disegno è già pronto.
 */
export function preparaIllustrazioni() {
  if (typeof Image === 'undefined') return;
  const coda = [...IMMAGINI.values()];
  const quandoLibero = (f: () => void) => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => void };
    if (w.requestIdleCallback) w.requestIdleCallback(f); else setTimeout(f, 50);
  };
  const prossima = () => {
    const url = coda.shift();
    if (!url) return;
    const img = new Image();
    img.src = url;
    giaDecodificate.push(img);
    img.decode().catch(() => {}).finally(() => quandoLibero(prossima));
  };
  quandoLibero(prossima);
}
