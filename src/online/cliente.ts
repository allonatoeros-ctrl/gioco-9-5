// Il "telefono" che parla con il server online (Supabase).
// La futura schermata online userà solo queste funzioni: nessuna regola qui dentro.
//
// - accedi():          ogni dispositivo riceve un'identità anonima, ricordata dal browser.
//                      Ricaricando la pagina si resta la stessa persona (serve per rientrare).
// - creaStanza(nome):  crea una stanza e restituisce il codice da passare agli amici.
// - entraInStanza(codice, nome): entra, oppure rientra al proprio posto.
// - osservaStanza(codice, cb): chiama cb ogni volta che cambia qualcosa (giocatori, partita).
// - avvia / inviaMossa: chiedono al server di avviare la partita o di fare una mossa.

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Azione } from '../engine';
import type { VistaPartita } from '../server/vista';
import { CONFIGURAZIONE } from './configurazione';

export interface Stanza {
  id: string;
  codice: string;
  host_id: string;
  stato: 'attesa' | 'in_corso' | 'finita';
}
export interface GiocatoreSeduto {
  utente_id: string;
  nome: string;
  posto: number;
  ultimo_contatto: string;
}
export interface PartitaOnline {
  id: string;
  posti: number[];
  versione: number;
  vista: VistaPartita;
  finita: boolean;
}
export interface Situazione {
  stanza: Stanza;
  giocatori: GiocatoreSeduto[];
  partita: PartitaOnline | null;
  /** Il mio posto nella stanza e il mio indice nella partita (se è iniziata). */
  ioPosto: number;
  ioInPartita: number | null;
}

/** Una mossa come la manda il telefono: il giocatore lo decide il server. */
export type RichiestaMossa =
  | { tipo: Exclude<Azione['tipo'], 'scegliMoneta' | 'scegliSegnalino'> }
  | { tipo: 'scegliMoneta'; scelta: 'testa' | 'croce' }
  | { tipo: 'scegliSegnalino'; cartaId: number | null };

export interface MemoriaAccesso {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

export class ErroreOnline extends Error {
  constructor(messaggio: string, public conflitto = false) { super(messaggio); }
}

export class ClienteOnline {
  readonly sb: SupabaseClient;
  private utente: string | null = null;

  /** memoria: dove ricordare l'identità del dispositivo (di base quella del browser). */
  constructor(url = CONFIGURAZIONE.url, chiave = CONFIGURAZIONE.chiavePubblica, memoria?: MemoriaAccesso) {
    this.sb = createClient(url, chiave, memoria ? { auth: { storage: memoria, persistSession: true } } : undefined);
  }

  /** Entra con l'identità anonima di questo dispositivo (la crea la prima volta). */
  async accedi(): Promise<string> {
    const { data } = await this.sb.auth.getSession();
    if (data.session) {
      this.utente = data.session.user.id;
      return this.utente;
    }
    const { data: nuovo, error } = await this.sb.auth.signInAnonymously();
    if (error || !nuovo.user) throw new ErroreOnline(`Accesso non riuscito: ${error?.message ?? 'sconosciuto'}`);
    this.utente = nuovo.user.id;
    return this.utente;
  }

  async creaStanza(nome: string): Promise<{ codice: string; posto: number }> {
    const { data, error } = await this.sb.rpc('crea_stanza', { p_nome: nome });
    if (error) throw new ErroreOnline(error.message);
    return data[0];
  }

  async entraInStanza(codice: string, nome: string): Promise<{ codice: string; posto: number }> {
    const { data, error } = await this.sb.rpc('entra_in_stanza', { p_codice: codice, p_nome: nome });
    if (error) throw new ErroreOnline(error.message);
    return data[0];
  }

  async esciDallaStanza(codice: string): Promise<void> {
    const { error } = await this.sb.rpc('esci_dalla_stanza', { p_codice: codice });
    if (error) throw new ErroreOnline(error.message);
  }

  async segnalaPresenza(codice: string): Promise<void> {
    await this.sb.rpc('segnala_presenza', { p_codice: codice });
  }

  /** Legge tutto quello che serve per disegnare la stanza o la partita. */
  async leggiSituazione(codice: string): Promise<Situazione> {
    const { data: stanza, error } = await this.sb
      .from('stanze').select('id, codice, host_id, stato').eq('codice', codice.trim().toUpperCase()).maybeSingle();
    if (error) throw new ErroreOnline(error.message);
    if (!stanza) throw new ErroreOnline('Non sei in questa stanza.');
    const [g, p] = await Promise.all([
      this.sb.from('giocatori').select('utente_id, nome, posto, ultimo_contatto').eq('stanza_id', stanza.id).order('posto'),
      this.sb.from('partite').select('id, posti, versione, vista, finita').eq('stanza_id', stanza.id).maybeSingle(),
    ]);
    if (g.error) throw new ErroreOnline(g.error.message);
    if (p.error) throw new ErroreOnline(p.error.message);
    const giocatori = g.data as GiocatoreSeduto[];
    const partita = p.data as PartitaOnline | null;
    const ioPosto = giocatori.find((x) => x.utente_id === this.utente)?.posto ?? -1;
    const idx = partita ? partita.posti.indexOf(ioPosto) : -1;
    return { stanza: stanza as Stanza, giocatori, partita, ioPosto, ioInPartita: idx >= 0 ? idx : null };
  }

  /**
   * Resta in ascolto della stanza: cb viene chiamata subito e poi a ogni cambiamento.
   * Se la connessione cade e torna, rilegge tutto (così si riprende da dove si era).
   * Restituisce una funzione per smettere di ascoltare.
   */
  osservaStanza(codice: string, cb: (s: Situazione) => void, errore: (e: Error) => void = console.error): () => void {
    let stanzaId: string | null = null;
    let ultimaVersione = -1;
    const aggiorna = async () => {
      try {
        const s = await this.leggiSituazione(codice);
        stanzaId = s.stanza.id;
        // Gli avvisi possono arrivare in disordine: non tornare mai a una versione vecchia.
        const v = s.partita?.versione ?? -1;
        if (v < ultimaVersione) return;
        ultimaVersione = v;
        cb(s);
      } catch (e) {
        errore(e as Error);
      }
    };
    const canale = this.sb.channel(`stanza-${codice}-${Math.random().toString(36).slice(2)}`);
    for (const tabella of ['stanze', 'giocatori', 'partite']) {
      canale.on('postgres_changes', { event: '*', schema: 'public', table: tabella }, (msg) => {
        const r = (msg.new ?? msg.old) as { id?: string; stanza_id?: string };
        if (!stanzaId || r.stanza_id === stanzaId || r.id === stanzaId) void aggiorna();
      });
    }
    canale.subscribe((stato) => {
      if (stato === 'SUBSCRIBED') void aggiorna();
    });
    const presenza = setInterval(() => void this.segnalaPresenza(codice), 20_000);
    return () => {
      clearInterval(presenza);
      void this.sb.removeChannel(canale);
    };
  }

  private async chiamaServer(corpo: Record<string, unknown>) {
    const { data, error } = await this.sb.functions.invoke('gioco', { body: corpo });
    if (error) {
      let messaggio = error.message;
      let conflitto = false;
      const ctx = (error as { context?: Response }).context;
      if (ctx && typeof ctx.json === 'function') {
        conflitto = ctx.status === 409;
        try { messaggio = (await ctx.json()).errore ?? messaggio; } catch { /* resta il messaggio generico */ }
      }
      throw new ErroreOnline(messaggio, conflitto);
    }
    return data;
  }

  /** Solo l'host. obiettivoPunti (3, 5 o 7) conta solo con 4 o più giocatori. */
  avvia(codice: string, obiettivoPunti?: 3 | 5 | 7): Promise<{ versione: number; vista: VistaPartita }> {
    return this.chiamaServer({ comando: 'avvia', codice, obiettivoPunti });
  }

  /** versione = quella che si sta guardando: se nel frattempo è cambiata, il server rifiuta (conflitto). */
  inviaMossa(codice: string, versione: number, azione: RichiestaMossa): Promise<{ versione: number; vista: VistaPartita }> {
    return this.chiamaServer({ comando: 'mossa', codice, versione, azione });
  }
}
