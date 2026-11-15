// La schermata del gioco online: ognuno dal proprio telefono o PC.
// Qui non c'è nessuna regola del gioco: le mosse permesse arrivano dal server,
// che le chiede al motore. Questa pagina si limita a mostrarle e a inviarle,
// con un po' di animazioni e avvisi per capire subito cosa succede.

import './tavolo.css';
import { Carta, eNumerica, nomeCarta } from '../engine';
import type { AzionePermessa, Evento } from '../engine';
import type { VistaPartita, GiocatoreVista } from '../server/vista';
import { illustrazione } from '../ui/illustrazioni';
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

// ---------------------------------------------------------------------------
// Stile grafico (tre direzioni da provare: ?stile=osteria | notte | fumetto)
// ---------------------------------------------------------------------------

const STILI = { osteria: 'Osteria', notte: 'Notte e oro', fumetto: 'Fumetto' } as const;
type Stile = keyof typeof STILI;
function stileScelto(): Stile {
  const dalLink = new URLSearchParams(location.search).get('stile');
  if (dalLink && dalLink in STILI) {
    try { localStorage.setItem('nove-mezzo:stile', dalLink); } catch { /* niente */ }
    return dalLink as Stile;
  }
  let s: string | null = null;
  try { s = localStorage.getItem('nove-mezzo:stile'); } catch { /* niente */ }
  return s && s in STILI ? (s as Stile) : 'osteria';
}
function applicaStile(s: Stile) {
  document.documentElement.dataset.stile = s;
  try { localStorage.setItem('nove-mezzo:stile', s); } catch { /* niente */ }
  const colore = getComputedStyle(document.documentElement).getPropertyValue('--barra-telefono').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colore || '#1f5d3a');
}
applicaStile(stileScelto());

// ---------------------------------------------------------------------------
// Stato della schermata
// ---------------------------------------------------------------------------

let codice: string | null = null;
let situazione: Situazione | null = null;
let smettiDiAscoltare: (() => void) | null = null;
let inInvio: string | null = null;
let avviso = '';
let storiaAperta = false;
/** Ultimo evento già visto, per capire quali sono nuovi (il registro arriva "a finestra"). */
let ultimoEventoVisto: string | null = null;
/** Le carte mostrate l'ultima volta, per animare solo quelle nuove o appena girate. */
let cartePrima: { mano: number; giocatori: string[][] } | null = null;
let turnoPrima: number | null = null;
const annunci: { testo: string; tono: string; sotto?: string }[] = [];
let annuncioInCorso = false;

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

const COLORI_POSTO = ['#d9822b', '#3b82c4', '#c0477a', '#4c9a5b', '#8a5cc2', '#c9a227'];
function avatar(nome: string, posto: number, classe = '') {
  const a = el('span', `avatar ${classe}`.trim(), (nome.trim()[0] ?? '?').toUpperCase());
  a.style.setProperty('--colore', COLORI_POSTO[posto % COLORI_POSTO.length]);
  a.setAttribute('aria-hidden', 'true');
  return a;
}

function vibra(ms: number | number[]) {
  try { navigator.vibrate?.(ms); } catch { /* non tutti i telefoni */ }
}

// ---------------------------------------------------------------------------
// Carte
// ---------------------------------------------------------------------------

type Taglia = 'mini' | 'media' | 'grande';

function disegnaCarta(carta: Carta | null, taglia: Taglia, opz: { fattore?: number; scegli?: () => void; anima?: 'entra' | 'gira' } = {}) {
  const c = el('div', `carta ${taglia}`);
  if (!carta) {
    c.classList.add('coperta');
    c.setAttribute('aria-label', 'Carta coperta');
    c.append(el('span', 'dorso-logo', '9½'));
  } else {
    const nome = nomeCarta(carta);
    c.setAttribute('aria-label', `Carta ${nome}`);
    const disegno = taglia === 'mini' ? undefined : illustrazione(carta);
    if (disegno) {
      const img = el('img');
      img.src = disegno;
      img.alt = '';
      img.draggable = false;
      c.append(img);
      c.classList.add('illustrata');
    } else {
      c.classList.add(eNumerica(carta) ? 'solo-numero' : 'solo-speciale');
      c.append(el('span', 'valore', eNumerica(carta) ? nome : sigla(carta)));
    }
    if (opz.fattore !== undefined && opz.fattore !== 1 && eNumerica(carta)) {
      c.append(el('span', 'fattore', opz.fattore === 0.5 ? '×½' : `×${fmt(opz.fattore)}`));
    }
  }
  if (opz.anima) c.classList.add(`anima-${opz.anima}`);
  if (opz.scegli) {
    c.classList.add('sceglibile');
    c.tabIndex = 0;
    c.setAttribute('role', 'button');
    c.title = 'Tocca per tenerla come segnalino';
    c.onclick = opz.scegli;
    c.onkeydown = (ev) => { if (ev.key === 'Enter' || ev.key === ' ') opz.scegli!(); };
  }
  return c;
}

function sigla(carta: Carta): string {
  switch (carta.tipo) {
    case 'piu1': return '+1';
    case 'piu2': return '+2';
    case 'cambioTetta': return '⇄';
    case 'stop': return 'STOP';
    case 'giocoliere': return '🤹';
    case 'tagliatette': return '✂';
    default: return nomeCarta(carta);
  }
}

/** Chiave di ogni carta mostrata: "C" se coperta, altrimenti l'id della carta. */
function chiaviCarte(v: VistaPartita) {
  return v.giocatori.map((g) => g.inGioco.map((c) => (c.coperta ? 'C' : String(c.carta.id))));
}

function animazioneCarta(v: VistaPartita, gi: number, k: number): 'entra' | 'gira' | undefined {
  if (!cartePrima || cartePrima.mano !== v.numeroMano) return cartePrima ? 'entra' : undefined;
  const prima = cartePrima.giocatori[gi]?.[k];
  const ora = v.giocatori[gi].inGioco[k];
  const chiave = ora.coperta ? 'C' : String(ora.carta.id);
  if (prima === undefined) return 'entra';
  if (prima === 'C' && chiave !== 'C') return 'gira';
  if (prima !== chiave) return 'entra';
  return undefined;
}

// ---------------------------------------------------------------------------
// Pagina iniziale
// ---------------------------------------------------------------------------

function ventaglio() {
  const v = el('div', 'ventaglio');
  const esempi: Carta[] = [
    { id: -1, tipo: 'numero', valore: 9 },
    { id: -2, tipo: 'giocoliere' },
    { id: -3, tipo: 'numero', valore: 0.5 },
  ];
  esempi.forEach((c) => v.append(disegnaCarta(c, 'grande')));
  return v;
}

function mostraInizio(errore = '', codiceProposto = '') {
  app.replaceChildren();
  const pagina = el('main', 'pagina inizio');
  const testa = el('div', 'marchio');
  testa.append(ventaglio(), el('h1', 'titolo', '9½'), el('p', 'motto', 'Il gioco di carte da fare con gli amici, ognuno dal suo telefono.'));

  const box = el('div', 'pannello');
  const campoNome = el('label', 'campo');
  campoNome.append(el('span', undefined, 'Il tuo nome'));
  const nome = el('input');
  nome.maxLength = 20;
  nome.setAttribute('autocomplete', 'nickname');
  nome.value = memoria.leggi('nome') ?? '';
  nome.placeholder = 'Come ti chiami?';
  campoNome.append(nome);

  const err = el('div', 'errore', errore);
  err.setAttribute('role', 'alert');
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

  const crea = el('button', 'tasto primario grande', 'Crea una stanza');
  crea.onclick = async () => {
    const n = leggiNome();
    if (!n) return;
    crea.disabled = true;
    crea.classList.add('attesa');
    try {
      const r = await cliente.creaStanza(n);
      apriStanza(r.codice);
    } catch (e) {
      err.textContent = messaggio(e);
      crea.disabled = false;
      crea.classList.remove('attesa');
    }
  };

  const separatore = el('div', 'oppure');
  separatore.append(el('span', undefined, 'oppure entra con un codice'));
  const riga = el('div', 'riga-codice');
  const cod = el('input', 'codice');
  cod.maxLength = 5;
  cod.autocapitalize = 'characters';
  cod.autocomplete = 'off';
  cod.spellcheck = false;
  cod.placeholder = 'K7M2Q';
  cod.setAttribute('aria-label', 'Codice della stanza');
  cod.value = codiceProposto;
  cod.oninput = () => { cod.value = cod.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); };
  const entra = el('button', 'tasto', 'Entra');
  const azioneEntra = async () => {
    const n = leggiNome();
    if (!n) return;
    const c = cod.value.trim().toUpperCase();
    if (c.length !== 5) {
      err.textContent = 'Il codice ha 5 caratteri.';
      cod.focus();
      return;
    }
    entra.disabled = true;
    entra.classList.add('attesa');
    try {
      const r = await cliente.entraInStanza(c, n);
      apriStanza(r.codice);
    } catch (e) {
      err.textContent = messaggio(e);
      entra.disabled = false;
      entra.classList.remove('attesa');
    }
  };
  entra.onclick = azioneEntra;
  cod.onkeydown = (ev) => { if (ev.key === 'Enter') void azioneEntra(); };
  riga.append(cod, entra);

  box.append(campoNome, err, crea, separatore, riga);
  pagina.append(testa, box, sceltaStile());
  app.append(pagina);
  if (codiceProposto && !nome.value) nome.focus();
}

function sceltaStile() {
  const box = el('div', 'scelta-stile');
  box.append(el('span', undefined, 'Stile:'));
  for (const [k, nome] of Object.entries(STILI) as [Stile, string][]) {
    const b = el('button', 'chip', nome);
    if (document.documentElement.dataset.stile === k) b.classList.add('attivo');
    b.onclick = () => {
      applicaStile(k);
      box.querySelectorAll('.chip').forEach((x) => x.classList.toggle('attivo', x === b));
    };
    box.append(b);
  }
  return box;
}

// ---------------------------------------------------------------------------
// Stanza: sala d'attesa e tavolo
// ---------------------------------------------------------------------------

function apriStanza(c: string) {
  smettiDiAscoltare?.();
  codice = c;
  situazione = null;
  ultimoEventoVisto = null;
  cartePrima = null;
  turnoPrima = null;
  memoria.scrivi('stanza', c);
  history.replaceState(null, '', `?stanza=${c}`);
  app.replaceChildren(caricamento('Entro nella stanza…'));
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

function caricamento(testo: string) {
  const box = el('div', 'pagina caricamento');
  box.append(el('div', 'girella'), el('p', undefined, testo));
  return box;
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
  const pagina = el('main', 'pagina sala');
  pagina.append(el('h2', 'titolo-pagina', 'Sala d\'attesa'));

  const biglietto = el('div', 'pannello biglietto');
  biglietto.append(el('p', 'etichetta', 'Codice della stanza'));
  const lettere = el('button', 'codice-grande');
  lettere.setAttribute('aria-label', `Codice ${s.stanza.codice}, tocca per copiarlo`);
  for (const ch of s.stanza.codice) lettere.append(el('span', undefined, ch));
  const copiato = el('p', 'suggerimento', 'Tocca il codice per copiarlo');
  lettere.onclick = async () => {
    try {
      await navigator.clipboard.writeText(s.stanza.codice);
      copiato.textContent = 'Codice copiato ✓';
    } catch { /* niente */ }
  };
  const condividi = el('button', 'tasto primario grande', 'Invita gli amici');
  condividi.prepend(el('span', 'icona', '📨'));
  condividi.onclick = async () => {
    const url = linkStanza(s.stanza.codice);
    try {
      if (navigator.share) await navigator.share({ title: '9½', text: `Vieni a giocare a 9½! Codice ${s.stanza.codice}`, url });
      else {
        await navigator.clipboard.writeText(url);
        condividi.textContent = 'Link copiato! Incollalo nella chat';
      }
    } catch { /* condivisione annullata */ }
  };
  biglietto.append(lettere, copiato, condividi);
  pagina.append(biglietto);

  const posti = el('div', 'pannello');
  posti.append(el('h3', undefined, `Giocatori ${s.giocatori.length} di 6`));
  const griglia = el('ul', 'posti');
  for (let p = 0; p < 6; p++) {
    const g = s.giocatori[p];
    const li = el('li', g ? 'posto pieno' : 'posto libero');
    if (g) {
      const av = avatar(g.nome, g.posto);
      if (g.utente_id === s.stanza.host_id) av.append(el('span', 'corona-host', '👑'));
      li.append(av);
      const testo = el('span', 'nome', g.nome);
      li.append(testo);
      const note = el('span', 'note');
      if (g.posto === s.ioPosto) note.append(el('span', 'tag tu', 'tu'));
      if (!connesso(g.ultimo_contatto)) note.append(el('span', 'tag spento', 'non connesso'));
      li.append(note);
      li.style.animationDelay = `${p * 60}ms`;
    } else {
      li.append(el('span', 'avatar vuoto', '+'), el('span', 'nome', 'posto libero'));
    }
    griglia.append(li);
  }
  posti.append(griglia);
  pagina.append(posti);

  const err = el('div', 'errore', avviso);
  err.setAttribute('role', 'alert');
  avviso = '';
  const sonoHost = s.giocatori.find((g) => g.posto === s.ioPosto)?.utente_id === s.stanza.host_id;
  const fondo = el('div', 'fondo-fisso');
  if (sonoHost) {
    let obiettivo: 3 | 5 | 7 | undefined;
    if (s.giocatori.length >= 4) {
      obiettivo = 5;
      const scelta = el('div', 'pannello');
      scelta.append(el('h3', undefined, 'Si vince a…'));
      const chips = el('div', 'segmenti');
      for (const o of [3, 5, 7] as const) {
        const b = el('button', 'chip grande', `${o} segnalini`);
        if (o === obiettivo) b.classList.add('attivo');
        b.onclick = () => {
          obiettivo = o;
          chips.querySelectorAll('.chip').forEach((x) => x.classList.toggle('attivo', x === b));
        };
        chips.append(b);
      }
      scelta.append(chips);
      pagina.append(scelta);
    } else {
      fondo.append(el('p', 'nota', 'Con 2 o 3 giocatori si gioca finché finisce il mazzo.'));
    }
    const avvia = el('button', 'tasto primario grande', s.giocatori.length < 2 ? 'Aspetta almeno un amico…' : `Inizia la partita (${s.giocatori.length} giocatori)`);
    avvia.disabled = s.giocatori.length < 2;
    avvia.onclick = async () => {
      avvia.disabled = true;
      avvia.classList.add('attesa');
      try {
        await cliente.avvia(s.stanza.codice, obiettivo);
        // La schermata si aggiorna da sola con l'avviso in tempo reale.
      } catch (e) {
        err.textContent = messaggio(e);
        avvia.disabled = false;
        avvia.classList.remove('attesa');
      }
    };
    fondo.append(err, avvia);
  } else {
    const host = s.giocatori.find((g) => g.utente_id === s.stanza.host_id);
    const att = el('div', 'in-attesa');
    att.append(el('span', 'puntini'), el('span', undefined, `Aspettiamo che ${host?.nome ?? 'chi ha creato la stanza'} inizi la partita`));
    fondo.append(err, att);
  }

  const esci = el('button', 'tasto leggero', 'Esci dalla stanza');
  esci.onclick = async () => {
    try {
      await cliente.esciDallaStanza(s.stanza.codice);
      esciDallaStanza();
    } catch (e) {
      err.textContent = messaggio(e);
    }
  };
  pagina.append(esci, fondo);
  app.append(pagina);
}

// ---------------------------------------------------------------------------
// Tavolo
// ---------------------------------------------------------------------------

function statoGiocatore(g: GiocatoreVista, inTurno: boolean): { testo: string; classe: string } {
  if (g.esito === 'nonPartecipa') return { testo: 'fuori mano', classe: 'fuori' };
  if (g.esito === 'daGiocare') return { testo: 'aspetta', classe: 'aspetta' };
  if (g.esito === 'sballato') return { testo: 'sballato', classe: 'sballato' };
  if (g.esito === 'fermo') return { testo: 'fermo', classe: 'fermo' };
  return { testo: inTurno ? 'sta giocando' : 'in gioco', classe: 'gioca' };
}

function haNumeriche(g: GiocatoreVista) {
  return g.inGioco.some((c) => !c.coperta && eNumerica(c.carta));
}

/** Il punteggio come si vede sul tavolo: "7,5", "sballato 10" o "–" se non ci sono numeri. */
function punti(g: GiocatoreVista) {
  if (g.inGioco.length === 0) return '';
  if (!haNumeriche(g)) return '–';
  return fmt(g.punteggio);
}

function segnaliniPiccoli(g: GiocatoreVista) {
  const s = el('span', 'segnalini');
  s.setAttribute('aria-label', `${g.segnalini.length} segnalini`);
  s.append(el('span', 'gettone', '★'), el('span', 'conta', String(g.segnalini.length)));
  return s;
}

function disegnaTavolo(s: Situazione) {
  const v = s.partita!.vista;
  const io = s.ioInPartita;
  const inTurno = v.turno?.giocatore ?? null;
  const mie = v.azioniPermesse.filter((a) => a.giocatore === io);
  const segnalino = mie.find((a) => a.tipo === 'scegliSegnalino');
  const postoDi = (i: number) => s.partita!.posti[i];
  const sedutoDi = (i: number) => s.giocatori.find((x) => x.posto === postoDi(i));

  raccogliAnnunci(v, io);

  app.replaceChildren();
  const gioco = el('main', 'gioco');
  if (io !== null && inTurno === io) gioco.classList.add('mio-turno');

  // --- testata
  const testata = el('header', 'testata');
  const mano = el('div', 'info-mano');
  mano.append(el('strong', undefined, `Mano ${v.numeroMano}`));
  if (v.ultimaMano) mano.append(el('span', 'tag caldo', 'ultima'));
  if (v.manoSpareggio) mano.append(el('span', 'tag caldo', 'spareggio'));
  const meta = el('div', 'info-meta');
  meta.append(el('span', 'chip-info', v.modalita === 'obiettivoPunti' ? `Si vince a ${v.obiettivoPunti} ★` : 'Fino a fine mazzo'));
  const storia = el('button', 'tasto-icona', '☰');
  storia.setAttribute('aria-label', 'Storia della partita e opzioni');
  storia.onclick = () => { storiaAperta = true; disegna(); };
  testata.append(mano, meta, storia);
  gioco.append(testata);

  // --- avversari
  const altri = v.giocatori.map((_, i) => i).filter((i) => i !== io);
  const fila = el('section', 'avversari');
  fila.setAttribute('aria-label', 'Gli altri giocatori');
  for (const i of altri) {
    const g = v.giocatori[i];
    const st = statoGiocatore(g, i === inTurno);
    const box = el('div', `avversario ${st.classe}`);
    if (i === inTurno) box.classList.add('turno');
    if (v.vincitoreMano === i) box.classList.add('vincitore');
    const seduto = sedutoDi(i);
    const riga1 = el('div', 'riga');
    riga1.append(avatar(g.nome, postoDi(i), seduto && !connesso(seduto.ultimo_contatto) ? 'spento' : ''));
    const nome = el('span', 'nome', g.nome);
    riga1.append(nome, el('span', `stato ${st.classe}`, st.testo));
    const riga2 = el('div', 'riga');
    const p = punti(g);
    const mini = el('div', 'carte-mini');
    g.inGioco.forEach((c, k) => mini.append(disegnaCarta(c.coperta ? null : c.carta, 'mini', { anima: animazioneCarta(v, i, k) })));
    riga2.append(mini);
    if (p) riga2.append(el('span', `punti ${g.esito === 'sballato' ? 'sballato' : ''}`, p));
    riga2.append(segnaliniPiccoli(g));
    box.append(riga1, riga2);
    if (i === v.primoGiocatore) box.append(el('span', 'mazziere', '1°'));
    fila.append(box);
  }
  gioco.append(fila);

  // --- centro del tavolo
  const centro = el('section', 'centro-tavolo');
  const mazzo = el('div', 'mazzo');
  mazzo.setAttribute('aria-label', `${v.carteNelMazzo} carte nel mazzo`);
  const pila = el('div', 'pila');
  for (let k = 0; k < Math.min(3, Math.ceil(v.carteNelMazzo / 30)); k++) pila.append(disegnaCarta(null, 'media'));
  if (v.carteNelMazzo === 0) pila.append(el('div', 'carta media vuota'));
  mazzo.append(pila, el('span', 'conta-mazzo', `${v.carteNelMazzo}`));
  centro.append(mazzo);

  const riflettore = el('div', 'riflettore');
  if (v.fase === 'finita') {
    riflettore.append(el('p', 'grande-testo', 'Partita finita'));
  } else if (inTurno !== null && inTurno !== io) {
    const g = v.giocatori[inTurno];
    const chi = el('div', 'chi');
    chi.append(avatar(g.nome, postoDi(inTurno)), el('span', undefined, `Sta giocando ${g.nome}`));
    const carte = el('div', 'carte-riflettore');
    g.inGioco.forEach((c, k) => carte.append(disegnaCarta(c.coperta ? null : c.carta, 'media', { fattore: c.coperta ? undefined : c.fattore, anima: animazioneCarta(v, inTurno, k) })));
    riflettore.append(chi, carte, misuratore(g));
  } else if (inTurno !== null && inTurno === io) {
    centro.classList.add('compatto');
    const riga = el('p', 'tocca-riga');
    riga.append(el('strong', 'tocca-a-te', 'Tocca a te!'), el('span', 'sotto-testo', suggerimento(v, mie)));
    riflettore.append(riga);
  } else {
    riflettore.append(el('p', 'grande-testo', testoFase(v, io)));
  }
  centro.append(riflettore);

  const ultimo = v.registro[v.registro.length - 1];
  if (ultimo) {
    const cronaca = el('button', 'cronaca', ultimo.testo);
    cronaca.title = 'Apri la storia della partita';
    cronaca.onclick = () => { storiaAperta = true; disegna(); };
    centro.append(cronaca);
  }
  gioco.append(centro);

  // --- le mie carte
  if (io !== null) {
    const g = v.giocatori[io];
    const st = statoGiocatore(g, inTurno === io);
    const mio = el('section', `mio ${st.classe}`);
    if (inTurno === io) mio.classList.add('turno');
    if (segnalino) mio.classList.add('scegli-segnalino');
    const testa = el('div', 'riga');
    testa.append(avatar(g.nome, postoDi(io)), el('span', 'nome', `${g.nome} (tu)`), el('span', `stato ${st.classe}`, st.testo));
    if (g.stopAttivo && g.esito === 'inTurno') testa.append(el('span', 'tag stop', 'STOP'));
    if (g.riserva.length) testa.append(el('span', 'tag riserva', `✂ ${g.riserva.length}`));
    testa.append(segnaliniPiccoli(g));
    const carte = el('div', 'carte-mie');
    if (g.inGioco.length > 5) carte.classList.add('fitte');
    g.inGioco.forEach((c, k) => {
      const scegli = segnalino && !c.coperta && segnalino.carte!.includes(c.carta.id)
        ? () => invia({ tipo: 'scegliSegnalino', cartaId: c.carta.id }, 'segnalino')
        : undefined;
      carte.append(disegnaCarta(c.coperta ? null : c.carta, 'grande', { fattore: c.coperta ? undefined : c.fattore, scegli, anima: animazioneCarta(v, io, k) }));
    });
    if (g.inGioco.length === 0) carte.append(el('p', 'vuoto', g.esito === 'nonPartecipa' ? 'Questa mano la guardi da fuori' : 'Nessuna carta davanti a te'));
    mio.append(testa, carte, misuratore(g));
    gioco.append(mio);
  }

  // --- pulsanti
  gioco.append(disegnaAzioni(s, v, mie));

  if (storiaAperta) gioco.append(disegnaStoria(v));
  if (v.fase === 'finita') gioco.append(disegnaFinePartita(s, v));
  app.append(gioco);

  // Memoria per le animazioni della prossima volta.
  cartePrima = { mano: v.numeroMano, giocatori: chiaviCarte(v) };
  if (inTurno !== turnoPrima && inTurno === io && io !== null && turnoPrima !== null) {
    vibra(60);
    annunci.push({ testo: 'Tocca a te!', tono: 'oro' });
  }
  turnoPrima = inTurno;
  mostraAnnunci();
}

/** Barra del punteggio verso 9,5: verde, poi arancio vicino al limite, rossa se si sballa. */
function misuratore(g: GiocatoreVista) {
  const box = el('div', 'misuratore');
  if (g.inGioco.length === 0) return box;
  const numeri = haNumeriche(g);
  const p = g.punteggio;
  const sballato = g.esito === 'sballato' || p > 9.5;
  const barra = el('div', 'barra');
  const pieno = el('div', 'pieno');
  pieno.style.width = `${Math.min(100, (p / 9.5) * 100)}%`;
  pieno.classList.add(sballato ? 'rosso' : p >= 8 ? 'caldo' : 'ok');
  barra.append(pieno);
  const etichetta = el('span', 'etichetta-punti');
  etichetta.append(el('strong', undefined, numeri ? fmt(p) : '–'), document.createTextNode(sballato ? ' sballato!' : ' / 9,5'));
  box.append(barra, etichetta);
  if (sballato) box.classList.add('sballato');
  return box;
}

function testoFase(v: VistaPartita, io: number | null): string {
  if (v.fase === 'moneta' && v.moneta) {
    const chi = v.giocatori[v.moneta.sceglie].nome;
    return v.moneta.sceglie === io ? 'Pareggio! Scegli testa o croce' : `Pareggio! ${chi} sceglie testa o croce`;
  }
  if (v.fase === 'segnalino' && v.vincitoreMano !== null) {
    return v.vincitoreMano === io ? 'Hai vinto la mano! 🎉' : `${v.giocatori[v.vincitoreMano].nome} vince la mano e sceglie il segnalino`;
  }
  if (v.fase === 'decisioneSballo') {
    const chi = v.azioniPermesse[0]?.giocatore;
    if (chi !== undefined) return chi === io ? 'Hai sballato… ma hai un Tagliatette!' : `${v.giocatori[chi].nome} decide se usare il Tagliatette`;
  }
  return 'Attendi…';
}

function suggerimento(v: VistaPartita, mie: AzionePermessa[]): string {
  if (v.turno?.deveRivelare) return 'Gira una delle tue carte coperte.';
  if (mie.some((a) => a.tipo === 'pesca' && a.obbligatoria)) {
    const n = v.turno!.pescateObbligatorie;
    return n === 1 ? 'Devi pescare ancora 1 carta.' : `Devi pescare ancora ${n} carte.`;
  }
  if (mie.some((a) => a.tipo === 'pesca')) return 'Pesca un\'altra carta o fermati.';
  if (mie.some((a) => a.tipo === 'fermati')) return 'Puoi solo fermarti.';
  return '';
}

function disegnaAzioni(s: Situazione, v: VistaPartita, mie: AzionePermessa[]) {
  const box = el('footer', 'azioni');
  if (v.fase === 'finita') return box;
  const msg = el('div', 'msg');
  box.append(msg);
  if (avviso) {
    const a = el('div', 'errore', `⚠ ${avviso}`);
    a.setAttribute('role', 'alert');
    box.append(a);
  }
  const tasti = el('div', 'tasti');
  box.append(tasti);

  if (s.ioInPartita === null) {
    msg.textContent = 'Stai guardando la partita.';
    return box;
  }
  if (mie.length === 0) {
    box.classList.add('aspetta');
    const chi = v.azioniPermesse[0]?.giocatore;
    msg.append(el('span', 'puntini'), document.createTextNode(chi !== undefined ? ` Tocca a ${v.giocatori[chi].nome}` : ' Attendi'));
    return box;
  }

  const bottone = (testo: string, classe: string, mossa: RichiestaMossa, chiave: string, icona?: string) => {
    const b = el('button', `tasto grande ${classe}`, testo);
    if (icona) b.prepend(el('span', 'icona', icona));
    b.disabled = inInvio !== null;
    if (inInvio === chiave) b.classList.add('attesa');
    b.onclick = () => invia(mossa, chiave);
    tasti.append(b);
  };
  msg.textContent = 'Tocca a te!';
  for (const a of mie) {
    switch (a.tipo) {
      case 'rivela':
        msg.textContent = 'Gira una carta';
        bottone('Gira una carta', 'primario', { tipo: 'rivela' }, 'rivela', '🂠');
        break;
      case 'pesca':
        if (a.obbligatoria) msg.textContent = `Pescata obbligatoria (ancora ${v.turno!.pescateObbligatorie})`;
        bottone(a.obbligatoria ? 'Pesca (obbligatoria)' : 'Pesca', 'primario', { tipo: 'pesca' }, 'pesca', '＋');
        break;
      case 'fermati':
        bottone('Stai', 'secondario', { tipo: 'fermati' }, 'fermati', '✋');
        break;
      case 'usaTagliatette':
        if (v.fase === 'decisioneSballo') {
          msg.textContent = `Hai sballato con ${fmt(v.giocatori[a.giocatore].punteggio)}! Usi il Tagliatette?`;
          bottone('Usa il Tagliatette', 'caldo', { tipo: 'usaTagliatette' }, 'tt', '✂');
        } else {
          bottone('Tagliatette', 'caldo', { tipo: 'usaTagliatette' }, 'tt', '✂');
        }
        break;
      case 'rinunciaTagliatette':
        bottone('No, resto sballato', 'secondario', { tipo: 'rinunciaTagliatette' }, 'no-tt');
        break;
      case 'scegliMoneta':
        msg.textContent = 'Pareggio! Testa o croce?';
        bottone('Testa', 'primario moneta', { tipo: 'scegliMoneta', scelta: 'testa' }, 'testa', '🪙');
        bottone('Croce', 'primario moneta', { tipo: 'scegliMoneta', scelta: 'croce' }, 'croce', '✖');
        break;
      case 'scegliSegnalino':
        if (a.carte![0] === null) {
          msg.textContent = 'Hai vinto la mano!';
          bottone('Prendi il segnalino', 'primario', { tipo: 'scegliSegnalino', cartaId: null }, 'segnalino', '★');
        } else {
          msg.textContent = 'Hai vinto! Tocca una tua carta da tenere come segnalino ↑';
        }
        break;
    }
  }
  return box;
}

// ---------------------------------------------------------------------------
// Storia, annunci, fine partita
// ---------------------------------------------------------------------------

function disegnaStoria(v: VistaPartita) {
  const velo = el('div', 'velo');
  velo.onclick = (ev) => { if (ev.target === velo) { storiaAperta = false; disegna(); } };
  const foglio = el('div', 'foglio');
  foglio.setAttribute('role', 'dialog');
  foglio.setAttribute('aria-label', 'Storia della partita');
  const testa = el('div', 'riga');
  testa.append(el('h3', undefined, 'Cosa è successo'));
  const chiudi = el('button', 'tasto-icona', '✕');
  chiudi.setAttribute('aria-label', 'Chiudi');
  chiudi.onclick = () => { storiaAperta = false; disegna(); };
  testa.append(chiudi);
  const lista = el('ol', 'storia');
  let manoCorrente = -1;
  for (const e of v.registro) {
    if (e.mano !== manoCorrente) {
      manoCorrente = e.mano;
      if (e.mano > 0) lista.append(el('li', 'sezione', `Mano ${e.mano}`));
    }
    lista.append(el('li', `ev ev-${e.tipo}`, e.testo));
  }
  const info = el('p', 'nota', `Stanza ${situazione?.stanza.codice ?? ''} · Mazzo ${v.carteNelMazzo} · Scarti ${v.carteNegliScarti}`);
  foglio.append(testa, lista, info, sceltaStile());
  velo.append(foglio);
  setTimeout(() => (lista.scrollTop = lista.scrollHeight));
  return velo;
}

const chiaveEvento = (e: Evento) => `${e.mano}|${e.tipo}|${e.giocatore ?? ''}|${e.testo}`;

/** Trova gli eventi nuovi e prepara gli annunci grandi per quelli importanti. */
function raccogliAnnunci(v: VistaPartita, io: number | null) {
  const reg = v.registro;
  if (reg.length === 0) return;
  const ultimaChiave = chiaveEvento(reg[reg.length - 1]);
  if (ultimoEventoVisto === null) {
    // Prima volta (anche dopo un ricaricamento): niente annunci del passato.
    ultimoEventoVisto = ultimaChiave;
    return;
  }
  let da = reg.length;
  for (let k = reg.length - 1; k >= 0; k--) {
    if (chiaveEvento(reg[k]) === ultimoEventoVisto) { da = k + 1; break; }
    if (k === 0) da = Math.max(0, reg.length - 3);
  }
  ultimoEventoVisto = ultimaChiave;
  const nome = (i?: number) => (i === undefined ? '' : i === io ? 'Tu' : v.giocatori[i].nome);
  for (const e of reg.slice(da)) {
    switch (e.tipo) {
      case 'inizioMano':
        annunci.push({ testo: `Mano ${e.mano}`, tono: 'neutro', sotto: v.ultimaMano ? 'È l\'ultima mano!' : undefined });
        break;
      case 'sballo':
        if (/sballa con/.test(e.testo)) annunci.push({ testo: e.giocatore === io ? 'Hai sballato!' : `${nome(e.giocatore)} sballa!`, tono: 'rosso', sotto: e.testo.match(/con ([\d,]+)/)?.[0] });
        break;
      case 'tagliatette':
        annunci.push({ testo: '✂ Tagliatette!', tono: 'caldo', sotto: e.testo.match(/punteggio .*?→ [\d,]+/)?.[0] });
        break;
      case 'fineMano':
        if (e.giocatore === undefined) annunci.push({ testo: 'Tutti sballati!', tono: 'rosso', sotto: 'Nessuno vince la mano' });
        else annunci.push({ testo: e.giocatore === io ? 'Hai vinto la mano! 🎉' : `${nome(e.giocatore)} vince la mano!`, tono: 'oro' });
        break;
      case 'segnalino':
        if (e.giocatore !== undefined) annunci.push({ testo: '★ Segnalino!', tono: 'oro', sotto: `${nome(e.giocatore)}: ${v.giocatori[e.giocatore].segnalini.length} in tutto` });
        break;
      case 'pareggio':
        annunci.push({ testo: 'Pareggio!', tono: 'caldo' });
        break;
      case 'moneta':
        annunci.push({ testo: `Esce ${e.testo.match(/esce (\w+)/)?.[1] ?? ''}!`, tono: 'caldo' });
        break;
      case 'rimescola':
        annunci.push({ testo: 'Si rimescola il mazzo', tono: 'neutro' });
        break;
      case 'stop':
        if (/bloccata/.test(e.testo)) annunci.push({ testo: '✋ STOP!', tono: 'rosso', sotto: 'Pesca bloccata' });
        break;
    }
  }
  if (annunci.length > 4) annunci.splice(0, annunci.length - 4);
}

function mostraAnnunci() {
  if (annuncioInCorso || annunci.length === 0) return;
  const a = annunci.shift()!;
  annuncioInCorso = true;
  const box = el('div', `annuncio ${a.tono}`);
  box.setAttribute('role', 'status');
  box.append(el('strong', undefined, a.testo));
  if (a.sotto) box.append(el('span', undefined, a.sotto));
  document.body.append(box);
  if (a.tono === 'oro') vibra([40, 60, 40]);
  setTimeout(() => {
    box.classList.add('via');
    setTimeout(() => {
      box.remove();
      annuncioInCorso = false;
      mostraAnnunci();
    }, 300);
  }, 1500);
}

function disegnaFinePartita(s: Situazione, v: VistaPartita) {
  const velo = el('div', 'velo fine-partita');
  const box = el('div', 'pannello podio');
  const w = v.vincitorePartita!;
  const coriandoli = el('div', 'coriandoli');
  for (let k = 0; k < 40; k++) {
    const c = el('i');
    c.style.left = `${Math.random() * 100}%`;
    c.style.animationDelay = `${Math.random() * 2}s`;
    c.style.background = COLORI_POSTO[k % COLORI_POSTO.length];
    coriandoli.append(c);
  }
  box.append(el('div', 'corona', '🏆'));
  box.append(el('h2', undefined, w === s.ioInPartita ? 'Hai vinto la partita!' : `Vince ${v.giocatori[w].nome}!`));
  const classifica = el('ol', 'classifica');
  const ordine = v.giocatori.map((g, i) => ({ g, i })).sort((a, b) => b.g.segnalini.length - a.g.segnalini.length || (a.i === w ? -1 : b.i === w ? 1 : 0));
  for (const { g, i } of ordine) {
    const li = el('li', i === w ? 'primo' : '');
    li.append(avatar(g.nome, s.partita!.posti[i]), el('span', 'nome', g.nome + (i === s.ioInPartita ? ' (tu)' : '')));
    const carte = el('span', 'trofei');
    for (const sg of g.segnalini) carte.append(sg.carta ? disegnaCarta(sg.carta, 'mini') : el('span', 'gettone', '★'));
    li.append(carte, el('strong', 'conta', String(g.segnalini.length)));
    classifica.append(li);
  }
  const nuova = el('button', 'tasto primario grande', 'Nuova partita');
  nuova.onclick = () => esciDallaStanza();
  const storia = el('button', 'tasto leggero', 'Rivedi come è andata');
  storia.onclick = () => { storiaAperta = true; disegna(); };
  box.append(classifica, nuova, storia);
  velo.append(coriandoli, box);
  return velo;
}

// ---------------------------------------------------------------------------
// Mosse
// ---------------------------------------------------------------------------

async function invia(mossa: RichiestaMossa, chiave: string) {
  if (inInvio || !situazione?.partita || !codice) return;
  inInvio = chiave;
  avviso = '';
  vibra(15);
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
    inInvio = null;
    disegna();
  }
}

// ---------------------------------------------------------------------------
// Avvio
// ---------------------------------------------------------------------------

async function avvio() {
  app.replaceChildren(caricamento('Collegamento…'));
  try {
    await cliente.accedi();
  } catch (e) {
    const box = caricamento('');
    box.replaceChildren(el('p', 'errore', `Non riesco a collegarmi al server: ${messaggio(e)}`));
    const riprova = el('button', 'tasto primario', 'Riprova');
    riprova.onclick = () => location.reload();
    box.append(riprova);
    app.replaceChildren(box);
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
