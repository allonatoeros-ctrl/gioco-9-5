// La schermata del gioco online: ognuno dal proprio telefono o PC.
// Qui non c'è nessuna regola del gioco: le mosse permesse arrivano dal server,
// che le chiede al motore. Questa pagina si limita a mostrarle e a inviarle.

import { Carta, eNumerica, nomeCarta } from '../engine';
import type { AzionePermessa } from '../engine';
import type { VistaPartita } from '../server/vista';
import { ClienteOnline, ErroreOnline, RichiestaMossa, Situazione } from './cliente';

const app = document.getElementById('app')!;
// Con `npm run avvia` e ?finto nell'indirizzo si usa un server finto nel browser (solo per provare).
function vuoleFinto() {
  if (!import.meta.env.DEV) return false;
  try {
    if (new URLSearchParams(location.search).has('finto')) sessionStorage.setItem('finto', '1');
    return sessionStorage.getItem('finto') === '1';
  } catch { return false; }
}
type Cliente = Pick<ClienteOnline, 'accedi' | 'creaStanza' | 'entraInStanza' | 'esciDallaStanza' | 'leggiSituazione' | 'osservaStanza' | 'avvia' | 'inviaMossa'>;
const finto = import.meta.env.DEV && vuoleFinto();
const cliente: Cliente = finto ? new (await import('./cliente-finto')).ClienteFinto() : new ClienteOnline();
// Con il server finto ogni scheda è un giocatore diverso, quindi ognuna ha la sua memoria.
const archivio = () => (finto ? sessionStorage : localStorage);

/** Memoria del browser: nome e ultima stanza, per rientrare dopo un ricaricamento. */
const memoria = {
  leggi(k: string) {
    try { return archivio().getItem(`nove-mezzo:${k}`); } catch { return null; }
  },
  scrivi(k: string, v: string | null) {
    try {
      if (v === null) archivio().removeItem(`nove-mezzo:${k}`);
      else archivio().setItem(`nove-mezzo:${k}`, v);
    } catch { /* senza memoria si va avanti lo stesso */ }
  },
};

let codice: string | null = null;
let situazione: Situazione | null = null;
let smettiDiAscoltare: (() => void) | null = null;
let inInvio = false;
let avviso = '';
let registroVisto = 0;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, classe?: string, testo?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (testo !== undefined) e.textContent = testo;
  return e;
}

function fmt(n: number) {
  return String(n).replace('.', ',');
}

function messaggio(e: unknown): string {
  if (e instanceof ErroreOnline) return e.message;
  if (e instanceof Error) return e.message;
  return String(e);
}

function linkStanza(c: string) {
  const u = new URL(location.href);
  u.search = `?stanza=${c}`;
  u.hash = '';
  return u.toString();
}

// ---------------------------------------------------------------------------
// Pagina iniziale
// ---------------------------------------------------------------------------

function mostraInizio(errore = '', codiceProposto = '') {
  app.replaceChildren();
  const box = el('div', 'centro');
  box.append(el('h1', undefined, '9,5'), el('p', undefined, 'Gioca online con gli amici, ognuno dal suo telefono.'));

  const campoNome = el('label', undefined, 'Il tuo nome');
  const nome = el('input');
  nome.maxLength = 20;
  nome.value = memoria.leggi('nome') ?? '';
  nome.placeholder = 'Come ti chiami?';
  campoNome.append(nome);

  const err = el('div', 'errore', errore);
  const leggiNome = () => {
    const n = nome.value.trim();
    if (!n) {
      err.textContent = 'Scrivi il tuo nome.';
      nome.focus();
      return null;
    }
    memoria.scrivi('nome', n);
    return n;
  };

  const crea = el('button', 'primario largo', 'Crea una stanza');
  crea.onclick = async () => {
    const n = leggiNome();
    if (!n) return;
    crea.disabled = true;
    try {
      const r = await cliente.creaStanza(n);
      apriStanza(r.codice);
    } catch (e) {
      err.textContent = messaggio(e);
      crea.disabled = false;
    }
  };

  const separatore = el('p', 'oppure', 'oppure entra in una stanza');
  const campoCodice = el('label', undefined, 'Codice della stanza');
  const cod = el('input', 'codice');
  cod.maxLength = 5;
  cod.autocapitalize = 'characters';
  cod.placeholder = 'es. K7M2Q';
  cod.value = codiceProposto;
  campoCodice.append(cod);
  const entra = el('button', 'largo', 'Entra');
  const azioneEntra = async () => {
    const n = leggiNome();
    if (!n) return;
    const c = cod.value.trim().toUpperCase();
    if (c.length !== 5) {
      err.textContent = 'Il codice ha 5 caratteri.';
      return;
    }
    entra.disabled = true;
    try {
      const r = await cliente.entraInStanza(c, n);
      apriStanza(r.codice);
    } catch (e) {
      err.textContent = messaggio(e);
      entra.disabled = false;
    }
  };
  entra.onclick = azioneEntra;
  cod.onkeydown = (ev) => { if (ev.key === 'Enter') void azioneEntra(); };

  box.append(campoNome, err, crea, separatore, campoCodice, entra);
  app.append(box);
  if (codiceProposto && !nome.value) nome.focus();
}

// ---------------------------------------------------------------------------
// Stanza: sala d'attesa e tavolo
// ---------------------------------------------------------------------------

function apriStanza(c: string) {
  smettiDiAscoltare?.();
  codice = c;
  situazione = null;
  registroVisto = 0;
  memoria.scrivi('stanza', c);
  history.replaceState(null, '', `?stanza=${c}`);
  app.replaceChildren(el('div', 'centro', 'Collegamento alla stanza…'));
  smettiDiAscoltare = cliente.osservaStanza(
    c,
    (s) => {
      situazione = s;
      disegna();
    },
    (e) => {
      // Se non si è più nella stanza (es. cancellata), si torna all'inizio.
      if (!situazione) esciDallaStanza(messaggio(e));
    },
  );
}

function esciDallaStanza(errore = '') {
  smettiDiAscoltare?.();
  smettiDiAscoltare = null;
  codice = null;
  situazione = null;
  memoria.scrivi('stanza', null);
  history.replaceState(null, '', location.pathname);
  mostraInizio(errore);
}

function disegna() {
  if (!situazione) return;
  if (situazione.partita) disegnaTavolo(situazione);
  else disegnaAttesa(situazione);
}

function connesso(ultimo: string) {
  return Date.now() - new Date(ultimo).getTime() < 60_000;
}

function disegnaAttesa(s: Situazione) {
  app.replaceChildren();
  const box = el('div', 'centro');
  box.append(el('h2', undefined, 'Sala d\'attesa'));
  box.append(el('p', undefined, 'Passa questo codice agli amici:'));
  box.append(el('div', 'codice-grande', s.stanza.codice));

  const condividi = el('button', 'largo', 'Condividi il link della stanza');
  condividi.onclick = async () => {
    const url = linkStanza(s.stanza.codice);
    try {
      if (navigator.share) await navigator.share({ title: '9,5', text: 'Vieni a giocare a 9,5!', url });
      else {
        await navigator.clipboard.writeText(url);
        condividi.textContent = 'Link copiato!';
      }
    } catch { /* condivisione annullata */ }
  };
  box.append(condividi);

  box.append(el('h3', undefined, `Giocatori (${s.giocatori.length} di 6)`));
  const lista = el('ul', 'lista-giocatori');
  for (const g of s.giocatori) {
    const li = el('li');
    li.append(el('span', undefined, g.nome));
    const note: string[] = [];
    if (g.utente_id === s.stanza.host_id) note.push('ha creato la stanza');
    if (g.posto === s.ioPosto) note.push('tu');
    if (!connesso(g.ultimo_contatto)) note.push('non connesso');
    if (note.length) li.append(el('span', 'stato', ` (${note.join(', ')})`));
    lista.append(li);
  }
  box.append(lista);

  const err = el('div', 'errore', avviso);
  avviso = '';
  const sonoHost = s.giocatori.find((g) => g.posto === s.ioPosto)?.utente_id === s.stanza.host_id;
  if (sonoHost) {
    let obiettivo: HTMLSelectElement | null = null;
    if (s.giocatori.length >= 4) {
      const l = el('label', undefined, 'Obiettivo punti');
      obiettivo = el('select');
      for (const o of [3, 5, 7]) obiettivo.append(new Option(`${o} punti`, String(o), false, o === 5));
      l.append(obiettivo);
      box.append(l);
    }
    const avvia = el('button', 'primario largo', 'Avvia la partita');
    avvia.disabled = s.giocatori.length < 2;
    if (s.giocatori.length < 2) box.append(el('p', 'stato', 'Serve almeno un altro giocatore.'));
    avvia.onclick = async () => {
      avvia.disabled = true;
      try {
        await cliente.avvia(s.stanza.codice, obiettivo ? (Number(obiettivo.value) as 3 | 5 | 7) : undefined);
        // La schermata si aggiorna da sola con l'avviso in tempo reale.
      } catch (e) {
        err.textContent = messaggio(e);
        avvia.disabled = false;
      }
    };
    box.append(err, avvia);
  } else {
    const host = s.giocatori.find((g) => g.utente_id === s.stanza.host_id);
    box.append(err, el('p', 'stato', `In attesa che ${host?.nome ?? 'chi ha creato la stanza'} avvii la partita…`));
  }

  const esci = el('button', 'largo', 'Esci dalla stanza');
  esci.onclick = async () => {
    try {
      await cliente.esciDallaStanza(s.stanza.codice);
      esciDallaStanza();
    } catch (e) {
      err.textContent = messaggio(e);
    }
  };
  box.append(esci);
  app.append(box);
}

function disegnaCarta(carta: Carta | null, scegli?: () => void) {
  const c = el('div', 'carta');
  if (!carta) {
    c.classList.add('coperta');
    c.title = 'Carta coperta';
    c.textContent = '?';
  } else {
    c.textContent = nomeCarta(carta);
    if (!eNumerica(carta)) c.classList.add('speciale');
  }
  if (scegli) {
    c.classList.add('scegli');
    c.title = 'Tocca per tenerla come segnalino';
    c.onclick = scegli;
  }
  return c;
}

function descrizione(v: VistaPartita, i: number): string {
  const g = v.giocatori[i];
  if (g.esito === 'nonPartecipa') return 'Non gioca questa mano';
  if (g.esito === 'daGiocare') return 'Deve ancora giocare';
  const scoperte = g.inGioco.filter((c) => !c.coperta);
  if (g.esito === 'inTurno' && scoperte.length === 0) return 'In gioco – nessuna carta scoperta';
  const numeriche = scoperte.some((c) => !c.coperta && eNumerica(c.carta));
  const punti = g.esito === 'sballato' || g.punteggio > 9.5
    ? `sballato (${fmt(g.punteggio)})`
    : numeriche ? `${fmt(g.punteggio)} punti` : 'solo carte speciali';
  const fase = g.esito === 'fermo' ? 'Fermo – ' : g.esito === 'inTurno' ? 'In gioco – ' : '';
  return fase + punti + (g.stopAttivo && g.esito === 'inTurno' ? ' · Stop attivo' : '');
}

function disegnaTavolo(s: Situazione) {
  const v = s.partita!.vista;
  const io = s.ioInPartita;
  app.replaceChildren();
  const tavolo = el('div', 'tavolo');

  const barra = el('div', 'barra');
  const info = v.modalita === 'obiettivoPunti' ? `Obiettivo: ${v.obiettivoPunti} punti` : 'Fino a esaurimento del mazzo';
  barra.append(
    el('strong', undefined, `Stanza ${s.stanza.codice} · Mano ${v.numeroMano}${v.ultimaMano ? ' – ultima mano' : ''}${v.manoSpareggio ? ' – spareggio' : ''}`),
    el('span', undefined, `${info} · Mazzo: ${v.carteNelMazzo} · Scarti: ${v.carteNegliScarti}`),
  );
  tavolo.append(barra);

  const mie = v.azioniPermesse.filter((a) => a.giocatore === io);
  const segnalino = mie.find((a) => a.tipo === 'scegliSegnalino');
  const inTurno = v.turno?.giocatore;

  const giocatori = el('div', 'giocatori');
  // Il proprio riquadro per primo: sul telefono è quello che conta.
  const ordine = v.giocatori.map((_, i) => i).sort((a, b) => (a === io ? -1 : b === io ? 1 : a - b));
  for (const i of ordine) {
    const g = v.giocatori[i];
    const seduto = s.giocatori.find((x) => x.posto === s.partita!.posti[i]);
    const box = el('div', 'giocatore');
    if (i === inTurno) box.classList.add('turno');
    if (i === io) box.classList.add('io');
    if (g.esito === 'nonPartecipa') box.classList.add('fuori');
    const testa = el('div', 'testa');
    const nome = g.nome + (i === io ? ' (tu)' : '') + (i === v.primoGiocatore ? ' · primo di mano' : '');
    testa.append(el('strong', undefined, nome));
    const destra = el('span');
    if (seduto && !connesso(seduto.ultimo_contatto)) destra.append(el('span', 'stato', 'non connesso '));
    g.segnalini.forEach(() => destra.append(el('span', 'segn', '★')));
    if (g.segnalini.length === 0) destra.append(el('span', 'stato', 'nessun segnalino'));
    testa.append(destra);
    box.append(testa);

    const carte = el('div', 'carte');
    for (const c of g.inGioco) {
      if (c.coperta) {
        carte.append(disegnaCarta(null));
        continue;
      }
      const sceglibile = segnalino && i === io && segnalino.carte!.includes(c.carta.id);
      carte.append(disegnaCarta(c.carta, sceglibile ? () => invia({ tipo: 'scegliSegnalino', cartaId: c.carta.id }) : undefined));
    }
    if (g.inGioco.length === 0) carte.append(el('span', 'stato', 'nessuna carta in gioco'));
    box.append(carte);

    const riserva = g.riserva.length > 0 ? ` · Riserva: ${g.riserva.length} Tagliatette` : '';
    box.append(el('div', 'stato', descrizione(v, i) + riserva));
    giocatori.append(box);
  }
  tavolo.append(giocatori);

  const reg = el('div', 'registro');
  reg.append(el('h3', undefined, 'Cosa è successo'));
  const primoNuovo = v.registro.length - Math.max(0, v.registro.length - registroVisto);
  v.registro.forEach((e, k) => reg.append(el('p', k >= primoNuovo && registroVisto > 0 ? 'nuova' : undefined, e.testo)));
  registroVisto = v.registro.length;
  setTimeout(() => (reg.scrollTop = reg.scrollHeight));

  tavolo.append(reg, disegnaAzioni(s, v, mie));
  app.append(tavolo);
}

function disegnaAzioni(s: Situazione, v: VistaPartita, mie: AzionePermessa[]) {
  const box = el('div', 'azioni');
  if (v.fase === 'finita') {
    const w = v.giocatori[v.vincitorePartita!];
    box.append(el('div', 'fine', `🏆 Fine partita! Vince ${w.nome} con ${w.segnalini.length} segnalini.`));
    const nuova = el('button', 'primario', 'Torna all\'inizio');
    nuova.onclick = () => esciDallaStanza();
    box.append(nuova);
    return box;
  }
  const msg = el('div', 'msg');
  box.append(msg);
  if (avviso) box.append(el('div', 'errore', `⚠ ${avviso}`));

  if (s.ioInPartita === null) {
    msg.textContent = 'Stai guardando la partita.';
    return box;
  }
  if (mie.length === 0) {
    const chi = v.azioniPermesse[0]?.giocatore;
    msg.textContent = chi !== undefined ? `Tocca a ${v.giocatori[chi].nome}…` : 'Attendi…';
    return box;
  }

  const bottone = (testo: string, classe: string, mossa: RichiestaMossa) => {
    const b = el('button', classe, testo);
    b.disabled = inInvio;
    b.onclick = () => invia(mossa);
    box.append(b);
  };
  msg.textContent = 'Tocca a te!';
  for (const a of mie) {
    switch (a.tipo) {
      case 'rivela':
        bottone('Rivela una carta', 'primario', { tipo: 'rivela' });
        break;
      case 'pesca':
        if (a.obbligatoria) msg.textContent = `Devi pescare (pescate obbligatorie: ${v.turno!.pescateObbligatorie})`;
        bottone(a.obbligatoria ? 'Pesca (obbligatoria)' : 'Pesca dal mazzo', 'primario', { tipo: 'pesca' });
        break;
      case 'fermati':
        bottone('Fermati', '', { tipo: 'fermati' });
        break;
      case 'usaTagliatette':
        if (v.fase === 'decisioneSballo') {
          msg.textContent = `Hai sballato con ${fmt(v.giocatori[a.giocatore].punteggio)}. Usare il Tagliatette?`;
          bottone('Sì, usa il Tagliatette', 'avviso', { tipo: 'usaTagliatette' });
        } else {
          bottone('Usa il Tagliatette', 'avviso', { tipo: 'usaTagliatette' });
        }
        break;
      case 'rinunciaTagliatette':
        bottone('No, resto sballato', '', { tipo: 'rinunciaTagliatette' });
        break;
      case 'scegliMoneta':
        msg.textContent = 'Pareggio! Scegli testa o croce';
        bottone('Testa', 'primario', { tipo: 'scegliMoneta', scelta: 'testa' });
        bottone('Croce', 'primario', { tipo: 'scegliMoneta', scelta: 'croce' });
        break;
      case 'scegliSegnalino':
        if (a.carte![0] === null) {
          msg.textContent = 'Hai vinto la mano senza carte scoperte: prendi un segnalino senza carta';
          bottone('Prendi il segnalino', 'primario', { tipo: 'scegliSegnalino', cartaId: null });
        } else {
          msg.textContent = 'Hai vinto la mano! Tocca una tua carta scoperta per tenerla come segnalino';
        }
        break;
    }
  }
  return box;
}

async function invia(mossa: RichiestaMossa) {
  if (inInvio || !situazione?.partita || !codice) return;
  inInvio = true;
  avviso = '';
  disegna();
  try {
    const r = await cliente.inviaMossa(codice, situazione.partita.versione, mossa);
    // Mostra subito il risultato, senza aspettare l'avviso in tempo reale.
    if (situazione.partita && r.versione > situazione.partita.versione) {
      situazione = { ...situazione, partita: { ...situazione.partita, versione: r.versione, vista: r.vista } };
    }
  } catch (e) {
    avviso = e instanceof ErroreOnline && e.conflitto ? 'La partita era andata avanti: riprova.' : messaggio(e);
    try { situazione = await cliente.leggiSituazione(codice); } catch { /* si riprova al prossimo avviso */ }
  } finally {
    inInvio = false;
    disegna();
  }
}

// ---------------------------------------------------------------------------
// Avvio
// ---------------------------------------------------------------------------

async function avvio() {
  app.replaceChildren(el('div', 'centro', 'Collegamento…'));
  try {
    await cliente.accedi();
  } catch (e) {
    app.replaceChildren(el('div', 'centro errore', `Non riesco a collegarmi al server: ${messaggio(e)}`));
    return;
  }
  const dalLink = new URLSearchParams(location.search).get('stanza')?.toUpperCase() ?? null;
  const ricordata = memoria.leggi('stanza');
  const nome = memoria.leggi('nome');
  const daProvare = dalLink ?? ricordata;
  if (daProvare && nome) {
    // Rientro: se ero già nella stanza ritrovo il mio posto; se non c'ero, entro.
    try {
      const r = await cliente.entraInStanza(daProvare, nome);
      apriStanza(r.codice);
      return;
    } catch (e) {
      memoria.scrivi('stanza', null);
      if (dalLink) return mostraInizio(messaggio(e), dalLink);
    }
  }
  mostraInizio('', dalLink ?? '');
}

// Quando si torna sulla pagina (es. telefono sbloccato) si rilegge tutto.
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && codice) {
    try {
      situazione = await cliente.leggiSituazione(codice);
      disegna();
    } catch { /* ci pensa l'ascolto in tempo reale */ }
  }
});

void avvio();
