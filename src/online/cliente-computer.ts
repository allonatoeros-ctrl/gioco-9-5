// Partita contro il computer: tutto succede dentro il telefono, senza internet e senza database.
// Ha gli stessi comandi del cliente online, così la schermata del tavolo è la stessa.
// Le regole sono quelle del motore (src/engine), usate come fa il server vero.
// La partita resta salvata nel browser: se il telefono ricarica la pagina, si riprende da lì.

import type { Stato } from '../engine';
import { avviaPartita, eseguiMossa } from '../server/servizio';
import { vistaPubblica } from '../server/vista';
import type { GiocatoreSeduto, RichiestaMossa, Situazione, Stanza } from './cliente';
import { ErroreOnline } from './cliente';
import { CORAGGIO, NOMI_COMPUTER, decidiMossa } from './computer';

/** Il codice "finto" della stanza contro il computer (non è una stanza online). */
export const CODICE_COMPUTER = 'PC';
const CHIAVE = 'nove-mezzo:computer';
const IO = 'io';

interface Tavolo {
  stanza: Stanza;
  giocatori: GiocatoreSeduto[];
  obiettivo: 3 | 5 | 7 | null;
  partita: null | { versione: number; posti: number[]; stato: Stato };
}

/** Quanto aspetta il computer prima di ogni mossa, per dare il tempo di vedere cosa fa. */
const PAUSA = { normale: 1100, obbligata: 800, primaDellaMano: 1800 };

export class ClienteComputer {
  private tavolo: Tavolo | null;
  private ascoltatori = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.tavolo = ClienteComputer.leggi();
  }

  /** C'è una partita contro il computer salvata in questo browser? */
  static esiste(): boolean {
    return ClienteComputer.leggi() !== null;
  }

  private static leggi(): Tavolo | null {
    try {
      const t = localStorage.getItem(CHIAVE);
      return t ? (JSON.parse(t) as Tavolo) : null;
    } catch {
      return null;
    }
  }

  private salva() {
    try {
      if (this.tavolo) localStorage.setItem(CHIAVE, JSON.stringify(this.tavolo));
      else localStorage.removeItem(CHIAVE);
    } catch { /* senza memoria si gioca lo stesso, ma non si riprende dopo un ricaricamento */ }
    for (const f of this.ascoltatori) f();
    this.programmaComputer();
  }

  async accedi() {
    return IO;
  }

  /** Prepara il tavolo: io al posto 0 e "avversari" computer (da 1 a 5). */
  async creaStanza(nome: string, avversari = 1) {
    const n = Math.max(1, Math.min(5, Math.floor(avversari)));
    const adesso = new Date().toISOString();
    this.tavolo = {
      stanza: { id: CODICE_COMPUTER, codice: CODICE_COMPUTER, host_id: IO, stato: 'attesa' },
      giocatori: [
        { utente_id: IO, nome, posto: 0, ultimo_contatto: adesso },
        ...NOMI_COMPUTER.slice(0, n).map((nc, k) => ({ utente_id: `computer-${k + 1}`, nome: `${nc} 🤖`, posto: k + 1, ultimo_contatto: adesso })),
      ],
      obiettivo: null,
      partita: null,
    };
    this.salva();
    return { codice: CODICE_COMPUTER, posto: 0 };
  }

  async entraInStanza(_codice: string, _nome: string) {
    if (!this.tavolo) throw new ErroreOnline('Non c\'è nessuna partita contro il computer da riprendere.');
    return { codice: CODICE_COMPUTER, posto: 0 };
  }

  /** Uscire chiude la partita contro il computer e la cancella. */
  async esciDallaStanza(_codice: string) {
    this.tavolo = null;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.salva();
  }

  /** Rigioca: con il computer si riparte subito, senza sala d'attesa. */
  async ricominciaStanza(_codice: string) {
    if (!this.tavolo) throw new ErroreOnline('Non c\'è nessuna partita contro il computer.');
    await this.avvia(CODICE_COMPUTER, this.tavolo.obiettivo ?? undefined);
  }

  async leggiSituazione(_codice: string): Promise<Situazione> {
    const t = this.tavolo;
    if (!t) throw new ErroreOnline('La partita contro il computer non c\'è più.');
    const adesso = new Date().toISOString();
    const p = t.partita;
    return {
      stanza: t.stanza,
      giocatori: t.giocatori.map((g) => ({ ...g, ultimo_contatto: adesso })),
      partita: p ? { id: CODICE_COMPUTER, posti: p.posti, versione: p.versione, vista: vistaPubblica(p.stato), finita: p.stato.fase === 'finita' } : null,
      ioPosto: 0,
      ioInPartita: p ? p.posti.indexOf(0) : null,
    };
  }

  osservaStanza(codice: string, cb: (s: Situazione) => void, errore: (e: Error) => void = console.error) {
    const aggiorna = () => this.leggiSituazione(codice).then(cb, errore);
    this.ascoltatori.add(aggiorna);
    void aggiorna();
    // Dopo un ricaricamento della pagina, se toccava al computer riprende a giocare.
    this.programmaComputer();
    return () => {
      this.ascoltatori.delete(aggiorna);
    };
  }

  async avvia(_codice: string, obiettivoPunti?: 3 | 5 | 7) {
    const t = this.tavolo;
    if (!t) throw new ErroreOnline('Non c\'è nessuna partita contro il computer.');
    const nomi = t.giocatori.map((g) => g.nome);
    const obiettivo = nomi.length >= 4 ? obiettivoPunti ?? 5 : null;
    const r = avviaPartita(nomi, obiettivo);
    t.obiettivo = obiettivo;
    t.partita = { versione: (t.partita?.versione ?? 0) + 1, posti: t.giocatori.map((g) => g.posto), stato: r.stato };
    t.stanza.stato = 'in_corso';
    this.salva();
    return { versione: t.partita.versione, vista: r.vista };
  }

  async inviaMossa(_codice: string, versione: number, azione: RichiestaMossa) {
    const p = this.tavolo?.partita;
    if (!p) throw new ErroreOnline('Non c\'è nessuna partita in corso.');
    if (p.versione !== versione) throw new ErroreOnline('La partita è andata avanti: riprova.', true);
    return this.applica(p.posti.indexOf(0), azione);
  }

  private applica(giocatore: number, azione: RichiestaMossa) {
    const t = this.tavolo!;
    const p = t.partita!;
    try {
      const r = eseguiMossa(p.stato, giocatore, azione);
      p.stato = r.stato;
      p.versione++;
      if (r.finita) t.stanza.stato = 'finita';
      this.salva();
      return { versione: p.versione, vista: r.vista };
    } catch (e) {
      throw new ErroreOnline((e as Error).message);
    }
  }

  /** Se tocca a un computer, fa la sua mossa dopo una breve pausa. */
  private programmaComputer() {
    if (this.timer) return;
    const p = this.tavolo?.partita;
    if (!p || p.stato.fase === 'finita' || this.ascoltatori.size === 0) return;
    const vista = vistaPubblica(p.stato);
    const io = p.posti.indexOf(0);
    const chi = vista.azioniPermesse.find((a) => a.giocatore !== io)?.giocatore;
    if (chi === undefined) return;
    const obbligata = vista.azioniPermesse.some((a) => a.tipo === 'pesca' && a.obbligatoria);
    const inizioMano = vista.registro[vista.registro.length - 1]?.tipo === 'inizioMano';
    const pausa = inizioMano ? PAUSA.primaDellaMano : obbligata ? PAUSA.obbligata : PAUSA.normale;
    const versione = p.versione;
    this.timer = setTimeout(() => {
      this.timer = null;
      const ora = this.tavolo?.partita;
      if (!ora || ora.versione !== versione) return this.programmaComputer();
      const mossa = decidiMossa(vistaPubblica(ora.stato), chi, CORAGGIO[(ora.posti[chi] - 1) % CORAGGIO.length]);
      if (!mossa) return;
      try {
        this.applica(chi, mossa);
      } catch (e) {
        console.error('Mossa del computer rifiutata', e);
      }
    }, pausa);
  }
}
