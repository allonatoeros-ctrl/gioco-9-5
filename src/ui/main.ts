// Prototipo nel browser (Fase B): più giocatori sullo stesso schermo.
// Qui non c'è nessuna regola del gioco: tutto viene dal motore in src/engine/.

import {
  Azione,
  Stato,
  applicaAzione,
  azioniPermesse,
  casoReale,
  creaPartita,
  eNumerica,
  nomeCarta,
  punteggio,
  valutazione,
  ErroreAzione,
  Caso,
  Carta,
} from '../engine';

const app = document.getElementById('app')!;
let stato: Stato | null = null;
let caso: Caso = casoReale();
let registroVisto = 0;
let errore = '';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  classe?: string,
  testo?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (testo !== undefined) e.textContent = testo;
  return e;
}

// ---------------------------------------------------------------------------
// Schermata iniziale
// ---------------------------------------------------------------------------

function mostraImpostazioni() {
  app.replaceChildren();
  const box = el('div', 'centro');
  box.append(el('h1', undefined, '9,5'), el('p', undefined, 'Prototipo – tutti sullo stesso schermo.'));

  const numero = el('select');
  for (let n = 2; n <= 6; n++) numero.append(new Option(`${n} giocatori`, String(n)));
  const campoNumero = el('label', undefined, 'Quanti giocatori?');
  campoNumero.append(numero);

  const nomi = el('div');
  const obiettivo = el('select');
  for (const o of [3, 5, 7]) obiettivo.append(new Option(`${o} punti`, String(o), false, o === 5));
  const campoObiettivo = el('label', undefined, 'Obiettivo punti (da 4 giocatori in su)');
  campoObiettivo.append(obiettivo);

  const aggiorna = () => {
    const n = Number(numero.value);
    const vecchi = Array.from(nomi.querySelectorAll('input')).map((i) => i.value);
    nomi.replaceChildren();
    for (let i = 0; i < n; i++) {
      const l = el('label', undefined, `Nome del giocatore ${i + 1}`);
      const inp = el('input');
      inp.value = vecchi[i] ?? '';
      inp.placeholder = `Giocatore ${i + 1}`;
      l.append(inp);
      nomi.append(l);
    }
    campoObiettivo.style.display = n >= 4 ? 'block' : 'none';
  };
  numero.onchange = aggiorna;
  aggiorna();

  const via = el('button', 'primario', 'Inizia la partita');
  via.onclick = () => {
    const n = Number(numero.value);
    const nomiScelti = Array.from(nomi.querySelectorAll('input')).map(
      (inp, i) => inp.value.trim() || `Giocatore ${i + 1}`,
    );
    if (new Set(nomiScelti).size !== nomiScelti.length) {
      alert('I nomi devono essere diversi tra loro.');
      return;
    }
    caso = casoReale();
    stato = creaPartita({
      giocatori: nomiScelti,
      caso,
      obiettivoPunti: n >= 4 ? Number(obiettivo.value) : undefined,
    });
    registroVisto = 0;
    errore = '';
    disegna();
  };
  box.append(campoNumero, nomi, campoObiettivo, via);
  app.append(box);
}

// ---------------------------------------------------------------------------
// Tavolo
// ---------------------------------------------------------------------------

function fmt(n: number) {
  return String(n).replace('.', ',');
}

function disegnaCarta(carta: Carta, scoperta: boolean, scegli?: () => void) {
  const c = el('div', 'carta');
  if (!scoperta) {
    c.classList.add('coperta');
    c.title = 'Carta coperta';
    c.textContent = '?';
  } else {
    c.textContent = nomeCarta(carta);
    if (!eNumerica(carta)) c.classList.add('speciale');
  }
  if (scegli) {
    c.classList.add('scegli');
    c.title = 'Clicca per scegliere come segnalino';
    c.onclick = scegli;
  }
  return c;
}

function descrizioneStato(s: Stato, i: number): string {
  const g = s.giocatori[i];
  if (g.esito === 'nonPartecipa') return 'Non gioca questa mano';
  if (g.esito === 'daGiocare') return 'Deve ancora giocare';
  if (g.esito === 'inTurno' && !g.inGioco.some((c) => c.scoperta)) return 'In gioco – nessuna carta scoperta';
  const v = valutazione(s, i);
  const punti =
    v.categoria === 'limbo' ? 'solo carte speciali' : v.categoria === 'sballato' ? `sballato (${fmt(v.punteggio)})` : `${fmt(v.punteggio)} punti`;
  const fase = g.esito === 'fermo' ? 'Fermo – ' : g.esito === 'inTurno' ? 'In gioco – ' : '';
  return fase + punti;
}

function disegna() {
  const s = stato!;
  app.replaceChildren();
  const tavolo = el('div', 'tavolo');

  const barra = el('div', 'barra');
  const info =
    s.modalita === 'obiettivoPunti' ? `Obiettivo: ${s.obiettivoPunti} punti` : 'Gioca fino a esaurimento del mazzo';
  barra.append(
    el('strong', undefined, `Mano ${s.numeroMano}${s.ultimaMano ? ' – ultima mano' : ''}${s.manoSpareggio ? ' – spareggio' : ''}`),
    el('span', undefined, `${info} · Mazzo: ${s.mazzo.length} carte · Scarti: ${s.scarti.length}`),
  );
  const nuova = el('button', undefined, 'Nuova partita');
  nuova.onclick = () => {
    if (confirm('Vuoi davvero lasciare questa partita?')) mostraImpostazioni();
  };
  barra.append(nuova);
  tavolo.append(barra);

  const permesse = azioniPermesse(s);
  const chiScegliSegnalino = permesse.find((a) => a.tipo === 'scegliSegnalino');
  const inTurno = s.turno?.giocatore;

  const giocatori = el('div', 'giocatori');
  s.giocatori.forEach((g, i) => {
    const box = el('div', 'giocatore');
    if (i === inTurno) box.classList.add('turno');
    if (g.esito === 'nonPartecipa') box.classList.add('fuori');
    const testa = el('div', 'testa');
    testa.append(el('strong', undefined, g.nome + (i === s.primoGiocatore ? ' (primo di mano)' : '')));
    const segn = el('span');
    g.segnalini.forEach(() => segn.append(el('span', 'segn', '★')));
    if (g.segnalini.length === 0) segn.append(el('span', 'stato', 'nessun segnalino'));
    testa.append(segn);
    box.append(testa);

    const carte = el('div', 'carte');
    for (const c of g.inGioco) {
      const sceglibile = chiScegliSegnalino?.giocatore === i && c.scoperta && chiScegliSegnalino.carte!.includes(c.carta.id);
      carte.append(
        disegnaCarta(c.carta, c.scoperta, sceglibile ? () => esegui({ tipo: 'scegliSegnalino', giocatore: i, cartaId: c.carta.id }) : undefined),
      );
    }
    if (g.inGioco.length === 0) carte.append(el('span', 'stato', 'nessuna carta in gioco'));
    box.append(carte);

    const riga = el('div', 'stato');
    const tt = g.riserva.length > 0 ? ` · Riserva: ${g.riserva.length} Tagliatette` : '';
    riga.textContent = descrizioneStato(s, i) + tt;
    box.append(riga);
    giocatori.append(box);
  });
  tavolo.append(giocatori);

  // Registro eventi
  const reg = el('div', 'registro');
  reg.append(el('h3', undefined, 'Cosa è successo'));
  s.registro.forEach((e, k) => {
    const p = el('p', k >= registroVisto ? 'nuova' : undefined, e.testo);
    reg.append(p);
  });
  tavolo.append(reg);
  registroVisto = s.registro.length;
  setTimeout(() => (reg.scrollTop = reg.scrollHeight));

  // Azioni
  tavolo.append(disegnaAzioni(s, permesse));
  app.append(tavolo);
}

function disegnaAzioni(s: Stato, permesse: ReturnType<typeof azioniPermesse>) {
  const box = el('div', 'azioni');
  if (s.fase === 'finita') {
    const v = s.giocatori[s.vincitorePartita!];
    const f = el('div', 'fine', `🏆 Fine partita! Vince ${v.nome} con ${v.segnalini.length} segnalini.`);
    const ancora = el('button', 'primario', 'Gioca ancora');
    ancora.onclick = mostraImpostazioni;
    box.append(f, ancora);
    return box;
  }
  const nome = (i: number) => s.giocatori[i].nome;
  const msg = el('div', 'msg');
  box.append(msg);
  if (errore) box.append(el('div', 'msg', `⚠ ${errore}`));

  const bottone = (testo: string, classe: string, azione: Azione) => {
    const b = el('button', classe, testo);
    b.onclick = () => esegui(azione);
    box.append(b);
  };

  for (const a of permesse) {
    const g = a.giocatore;
    switch (a.tipo) {
      case 'rivela':
        msg.textContent = `Tocca a ${nome(g)}`;
        bottone('Rivela una carta', 'primario', { tipo: 'rivela', giocatore: g });
        break;
      case 'pesca':
        msg.textContent = a.obbligatoria
          ? `${nome(g)} deve pescare (pescata obbligatoria, ne restano ${s.turno!.coda.length})`
          : `Tocca a ${nome(g)}`;
        bottone(a.obbligatoria ? 'Pesca (obbligatoria)' : 'Pesca dal mazzo', 'primario', { tipo: 'pesca', giocatore: g });
        break;
      case 'fermati':
        msg.textContent ||= `Tocca a ${nome(g)}`;
        bottone('Fermati', '', { tipo: 'fermati', giocatore: g });
        break;
      case 'usaTagliatette':
        msg.textContent ||= `Tocca a ${nome(g)}`;
        if (s.fase === 'decisioneSballo') {
          msg.textContent = `${nome(g)} ha sballato con ${fmt(punteggio(s, g))}. Usare il Tagliatette?`;
          bottone('Sì, usa il Tagliatette', 'avviso', { tipo: 'usaTagliatette', giocatore: g });
        } else {
          bottone('Usa il Tagliatette', 'avviso', { tipo: 'usaTagliatette', giocatore: g });
        }
        break;
      case 'rinunciaTagliatette':
        bottone('No, resto sballato', '', { tipo: 'rinunciaTagliatette', giocatore: g });
        break;
      case 'scegliMoneta':
        msg.textContent = `Pareggio! ${nome(g)} sceglie testa o croce`;
        bottone('Testa', 'primario', { tipo: 'scegliMoneta', giocatore: g, scelta: 'testa' });
        bottone('Croce', 'primario', { tipo: 'scegliMoneta', giocatore: g, scelta: 'croce' });
        break;
      case 'scegliSegnalino':
        if (a.carte![0] === null) {
          msg.textContent = `${nome(g)} vince la mano senza carte scoperte e prende un segnalino senza carta`;
          bottone('Prendi il segnalino', 'primario', { tipo: 'scegliSegnalino', giocatore: g, cartaId: null });
        } else {
          msg.textContent = `${nome(g)} vince la mano! Clicca una sua carta scoperta per tenerla come segnalino`;
        }
        break;
    }
  }
  return box;
}

function esegui(azione: Azione) {
  try {
    stato = applicaAzione(stato!, azione, caso);
    errore = '';
  } catch (e) {
    if (e instanceof ErroreAzione) errore = e.message;
    else throw e;
  }
  disegna();
}

mostraImpostazioni();
