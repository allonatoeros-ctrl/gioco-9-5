// Le carte del gioco 9,5 (regolamento, sezione 2).

export type TipoSpeciale =
  | 'piu1'
  | 'piu2'
  | 'cambioTetta'
  | 'stop'
  | 'giocoliere'
  | 'tagliatette';

export type Carta =
  | { id: number; tipo: 'numero'; valore: number }
  | { id: number; tipo: TipoSpeciale };

/** Composizione del mazzo, identica alla tabella della sezione 2. */
export const COMPOSIZIONE_MAZZO: ReadonlyArray<{ nome: string; quantita: number; crea: () => Omit<Carta, 'id'> }> = [
  { nome: '0', quantita: 4, crea: () => ({ tipo: 'numero', valore: 0 }) },
  { nome: 'Mezzo', quantita: 8, crea: () => ({ tipo: 'numero', valore: 0.5 }) },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => ({
    nome: String(v),
    quantita: 8,
    crea: () => ({ tipo: 'numero' as const, valore: v }),
  })),
  { nome: '+1', quantita: 8, crea: () => ({ tipo: 'piu1' }) },
  { nome: '+2', quantita: 4, crea: () => ({ tipo: 'piu2' }) },
  { nome: 'Cambio Tetta', quantita: 8, crea: () => ({ tipo: 'cambioTetta' }) },
  { nome: 'Stop', quantita: 8, crea: () => ({ tipo: 'stop' }) },
  { nome: 'Giocoliere', quantita: 1, crea: () => ({ tipo: 'giocoliere' }) },
  { nome: 'Tagliatette', quantita: 2, crea: () => ({ tipo: 'tagliatette' }) },
];

/** Crea le 115 carte, in ordine fisso (prima di qualsiasi mescolamento). */
export function creaMazzo(): Carta[] {
  const carte: Carta[] = [];
  let id = 1;
  for (const voce of COMPOSIZIONE_MAZZO) {
    for (let i = 0; i < voce.quantita; i++) {
      carte.push({ id: id++, ...voce.crea() } as Carta);
    }
  }
  return carte;
}

const NOMI_SPECIALI: Record<TipoSpeciale, string> = {
  piu1: '+1',
  piu2: '+2',
  cambioTetta: 'Cambio Tetta',
  stop: 'Stop',
  giocoliere: 'Giocoliere',
  tagliatette: 'Tagliatette',
};

/** Nome leggibile di una carta, es. "7", "0,5", "Stop". */
export function nomeCarta(carta: Carta): string {
  if (carta.tipo === 'numero') return String(carta.valore).replace('.', ',');
  return NOMI_SPECIALI[carta.tipo];
}

export function eNumerica(carta: Carta): carta is Extract<Carta, { tipo: 'numero' }> {
  return carta.tipo === 'numero';
}

/**
 * Controlla se una carta corrisponde a un nome breve, usato nei test e nel caso finto:
 * "0", "0,5" (o "0.5" o "Mezzo"), "1"…"9", "+1", "+2", "CT", "Stop", "Giocoliere", "TT".
 */
export function corrispondeANome(carta: Carta, nome: string): boolean {
  const n = nome.trim().toLowerCase();
  if (carta.tipo === 'numero') {
    if (n === 'mezzo') return carta.valore === 0.5;
    if (!/^\d+([.,]5)?$/.test(n)) return false;
    return Number(n.replace(',', '.')) === carta.valore;
  }
  const alias: Record<TipoSpeciale, string[]> = {
    piu1: ['+1'],
    piu2: ['+2'],
    cambioTetta: ['ct', 'cambio tetta'],
    stop: ['stop', 'suora'],
    giocoliere: ['giocoliere'],
    tagliatette: ['tt', 'tagliatette'],
  };
  return alias[carta.tipo].includes(n);
}
