// Il caso usato dal server online (decisione O9: mescola solo il server).
//
// Usa il generatore crittografico del sistema, non un "seme": così nessuno può
// ricostruire l'ordine del mazzo guardando le carte uscite. Lo stato completo della
// partita è comunque salvato dopo ogni mossa, quindi non serve poterla rigiocare.

import type { Caso } from '../engine';

/** Un intero uniforme da 0 a n-1, senza distorsioni (scarta i valori "di troppo"). */
function interoSicuro(n: number): number {
  if (!Number.isInteger(n) || n < 1 || n > 2 ** 32) throw new Error(`interoSicuro: n non valido (${n})`);
  const limite = Math.floor(2 ** 32 / n) * n;
  const buf = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limite) return buf[0] % n;
  }
}

export function casoSicuro(): Caso {
  return {
    mescola(carte) {
      const a = [...carte];
      for (let i = a.length - 1; i > 0; i--) {
        const j = interoSicuro(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    intero: interoSicuro,
    moneta: () => (interoSicuro(2) === 0 ? 'testa' : 'croce'),
  };
}
