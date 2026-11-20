// Un server "finto" che vive nel browser, SOLO per provare la schermata senza internet
// (si attiva con ?finto nell'indirizzo, e solo con `npm run avvia`, mai nel sito pubblicato).
// Tutte le schede dello stesso browser condividono la stessa memoria: ogni scheda è un giocatore.
// Usa la stessa logica del server vero (src/server), quindi le regole sono identiche.

import type { Stato } from '../engine';
import { avviaPartita, eseguiMossa } from '../server/servizio';
import { vistaPubblica } from '../server/vista';
import type { ClienteOnline, GiocatoreSeduto, RichiestaMossa, Situazione, Stanza } from './cliente';
import { ErroreOnline } from './cliente';

interface Mondo {
  stanze: Record<string, Stanza & { giocatori: GiocatoreSeduto[]; partita: null | { versione: number; posti: number[]; stato: Stato; interrotta?: boolean } }>;
}

const CHIAVE = 'nove-mezzo:finto';
const leggi = (): Mondo => JSON.parse(localStorage.getItem(CHIAVE) ?? '{"stanze":{}}');
const scrivi = (m: Mondo) => {
  localStorage.setItem(CHIAVE, JSON.stringify(m));
  window.dispatchEvent(new Event('mondo-finto'));
};

export class ClienteFinto implements Pick<ClienteOnline, 'accedi' | 'creaStanza' | 'entraInStanza' | 'esciDallaStanza' | 'ricominciaStanza' | 'segnalaPresenza' | 'leggiSituazione' | 'osservaStanza' | 'avvia' | 'inviaMossa'> {
  private utente = '';

  async accedi() {
    this.utente = sessionStorage.getItem('finto:utente') ?? crypto.randomUUID();
    sessionStorage.setItem('finto:utente', this.utente);
    return this.utente;
  }

  async creaStanza(nome: string) {
    const m = leggi();
    const codice = Array.from({ length: 5 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
    m.stanze[codice] = {
      id: codice, codice, host_id: this.utente, stato: 'attesa', partita: null,
      giocatori: [{ utente_id: this.utente, nome, posto: 0, ultimo_contatto: new Date().toISOString() }],
    };
    scrivi(m);
    return { codice, posto: 0 };
  }

  async entraInStanza(codice: string, nome: string) {
    const m = leggi();
    const s = m.stanze[codice.toUpperCase()];
    if (!s) throw new ErroreOnline('Nessuna stanza con questo codice.');
    const io = s.giocatori.find((g) => g.utente_id === this.utente);
    if (io) return { codice: s.codice, posto: io.posto };
    if (s.stato !== 'attesa') throw new ErroreOnline('La partita in questa stanza è già iniziata.');
    const posto = [0, 1, 2, 3, 4, 5].find((p) => !s.giocatori.some((g) => g.posto === p));
    if (posto === undefined) throw new ErroreOnline('La stanza è piena (massimo 6 giocatori).');
    s.giocatori.push({ utente_id: this.utente, nome, posto, ultimo_contatto: new Date().toISOString() });
    s.giocatori.sort((a, b) => a.posto - b.posto);
    scrivi(m);
    return { codice: s.codice, posto };
  }

  async esciDallaStanza(codice: string) {
    const m = leggi();
    const s = m.stanze[codice];
    if (!s) return;
    if (!s.giocatori.some((g) => g.utente_id === this.utente)) return;
    s.giocatori = s.giocatori.filter((g) => g.utente_id !== this.utente);
    // Come nel database vero: se si esce a partita in corso, la partita si interrompe per tutti.
    if (s.stato === 'in_corso') {
      s.stato = 'finita';
      if (s.partita) s.partita.interrotta = true;
    }
    if (s.giocatori.length === 0) delete m.stanze[codice];
    else if (s.host_id === this.utente) s.host_id = s.giocatori[0].utente_id;
    scrivi(m);
  }

  async ricominciaStanza(codice: string) {
    const m = leggi();
    const s = m.stanze[codice];
    if (!s || !s.giocatori.some((g) => g.utente_id === this.utente)) throw new ErroreOnline('Non sei in questa stanza.');
    if (s.stato === 'attesa') return;
    if (s.stato !== 'finita') throw new ErroreOnline('La partita non è ancora finita.');
    s.partita = null;
    s.stato = 'attesa';
    scrivi(m);
  }

  async segnalaPresenza() {}

  async leggiSituazione(codice: string): Promise<Situazione> {
    const s = leggi().stanze[codice.toUpperCase()];
    if (!s || !s.giocatori.some((g) => g.utente_id === this.utente)) throw new ErroreOnline('Non sei in questa stanza.');
    const ioPosto = s.giocatori.find((g) => g.utente_id === this.utente)!.posto;
    const p = s.partita;
    const vista = p ? vistaPubblica(p.stato) : null;
    const idx = p ? p.posti.indexOf(ioPosto) : -1;
    return {
      stanza: { id: s.id, codice: s.codice, host_id: s.host_id, stato: s.stato },
      giocatori: s.giocatori,
      partita: p && vista ? { id: s.id, posti: p.posti, versione: p.versione, vista, finita: p.stato.fase === 'finita' || !!p.interrotta } : null,
      ioPosto,
      ioInPartita: idx >= 0 ? idx : null,
    };
  }

  osservaStanza(codice: string, cb: (s: Situazione) => void, errore: (e: Error) => void = console.error) {
    const aggiorna = () => this.leggiSituazione(codice).then(cb, errore);
    window.addEventListener('storage', aggiorna);
    window.addEventListener('mondo-finto', aggiorna);
    void aggiorna();
    return () => {
      window.removeEventListener('storage', aggiorna);
      window.removeEventListener('mondo-finto', aggiorna);
    };
  }

  async avvia(codice: string, obiettivoPunti?: 3 | 5 | 7) {
    const m = leggi();
    const s = m.stanze[codice];
    if (s.host_id !== this.utente) throw new ErroreOnline('Solo chi ha creato la stanza può avviare la partita.');
    const r = avviaPartita(s.giocatori.map((g) => g.nome), obiettivoPunti ?? null);
    s.partita = { versione: 0, posti: s.giocatori.map((g) => g.posto), stato: r.stato };
    s.stato = 'in_corso';
    scrivi(m);
    return { versione: 0, vista: r.vista };
  }

  async inviaMossa(codice: string, versione: number, azione: RichiestaMossa) {
    const m = leggi();
    const s = m.stanze[codice];
    const p = s.partita!;
    if (p.interrotta) throw new ErroreOnline('La partita è stata interrotta.');
    if (p.versione !== versione) throw new ErroreOnline('La partita è andata avanti: aggiorna e riprova.', true);
    const io = s.giocatori.find((g) => g.utente_id === this.utente)!;
    try {
      const r = eseguiMossa(p.stato, p.posti.indexOf(io.posto), azione);
      p.stato = r.stato;
      p.versione++;
      if (r.finita) s.stato = 'finita';
      scrivi(m);
      return { versione: p.versione, vista: r.vista };
    } catch (e) {
      throw new ErroreOnline((e as Error).message);
    }
  }
}
