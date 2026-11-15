// Prova dal vivo sul server vero: due giocatori finti creano una stanza, entrano,
// avviano e giocano una partita intera scegliendo mosse a caso.
// Uso: npx tsx tools/prova-online.ts
// Richiede che in Supabase sia attivo l'accesso anonimo.
import { ClienteOnline } from '../src/online/cliente';

// Ogni "giocatore" ha la sua memoria separata, come due telefoni diversi.
function memoria() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
}
const anna = new ClienteOnline(undefined, undefined, memoria());
const bruno = new ClienteOnline(undefined, undefined, memoria());

await anna.accedi();
await bruno.accedi();
const { codice } = await anna.creaStanza('Anna');
console.log('Stanza creata:', codice);
await bruno.entraInStanza(codice, 'Bruno');
const rientro = await bruno.entraInStanza(codice, 'Bruno');
console.log('Bruno rientra al posto', rientro.posto);

const avvisi: number[] = [];
const smetti = bruno.osservaStanza(codice, (s) => avvisi.push(s.partita?.versione ?? -1));

let { versione, vista } = await anna.avvia(codice);
const clienti = [anna, bruno];
let mosse = 0;
while (vista.fase !== 'finita') {
  const a = vista.azioniPermesse[Math.floor(Math.random() * vista.azioniPermesse.length)];
  let az: any = { tipo: a.tipo };
  if (a.tipo === 'scegliMoneta') az = { tipo: a.tipo, scelta: 'testa' };
  if (a.tipo === 'scegliSegnalino') az = { tipo: a.tipo, cartaId: a.carte![0] };
  if (a.tipo === 'pesca' && !a.obbligatoria && vista.giocatori[a.giocatore].punteggio > 7 && vista.azioniPermesse.some((x) => x.tipo === 'fermati')) az = { tipo: 'fermati' };
  // Prima prova a far muovere il giocatore sbagliato: il server deve rifiutare.
  if (mosse === 0) {
    try { await clienti[1 - a.giocatore].inviaMossa(codice, versione, az); throw new Error('PROBLEMA: mossa accettata dal giocatore sbagliato'); }
    catch (e) { if ((e as Error).message.startsWith('PROBLEMA')) throw e; console.log('Mossa fuori turno rifiutata:', (e as Error).message); }
  }
  ({ versione, vista } = await clienti[a.giocatore].inviaMossa(codice, versione, az));
  mosse++;
}
const s = await bruno.leggiSituazione(codice);
console.log(`Partita finita in ${mosse} mosse. Vince ${vista.giocatori[vista.vincitorePartita!].nome}. Stato stanza: ${s.stanza.stato}.`);
const segrete = await bruno.sb.from('partite_segrete').select('*');
console.log('Bruno prova a leggere lo stato segreto:', segrete.error ? 'rifiutato ✔' : `PROBLEMA: ${JSON.stringify(segrete.data).slice(0, 80)}`);
await new Promise((r) => setTimeout(r, 1500));
console.log('Avvisi in tempo reale ricevuti da Bruno:', avvisi.length);
smetti();
process.exit(0);
