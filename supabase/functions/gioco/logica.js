// FILE GENERATO da `npm run prepara-server`: non modificarlo a mano.
// deno-lint-ignore-file

// src/engine/carte.ts
var COMPOSIZIONE_MAZZO = [
  { nome: "0", quantita: 4, crea: () => ({ tipo: "numero", valore: 0 }) },
  { nome: "Mezzo", quantita: 8, crea: () => ({ tipo: "numero", valore: 0.5 }) },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => ({
    nome: String(v),
    quantita: 8,
    crea: () => ({ tipo: "numero", valore: v })
  })),
  { nome: "+1", quantita: 8, crea: () => ({ tipo: "piu1" }) },
  { nome: "+2", quantita: 4, crea: () => ({ tipo: "piu2" }) },
  { nome: "Cambio Tetta", quantita: 8, crea: () => ({ tipo: "cambioTetta" }) },
  { nome: "Stop", quantita: 8, crea: () => ({ tipo: "stop" }) },
  { nome: "Giocoliere", quantita: 1, crea: () => ({ tipo: "giocoliere" }) },
  { nome: "Tagliatette", quantita: 2, crea: () => ({ tipo: "tagliatette" }) }
];
function creaMazzo() {
  const carte = [];
  let id = 1;
  for (const voce of COMPOSIZIONE_MAZZO) {
    for (let i = 0; i < voce.quantita; i++) {
      carte.push({ id: id++, ...voce.crea() });
    }
  }
  return carte;
}
var NOMI_SPECIALI = {
  piu1: "+1",
  piu2: "+2",
  cambioTetta: "Cambio Tetta",
  stop: "Stop",
  giocoliere: "Giocoliere",
  tagliatette: "Tagliatette"
};
function nomeCarta(carta) {
  if (carta.tipo === "numero") return String(carta.valore).replace(".", ",");
  return NOMI_SPECIALI[carta.tipo];
}

// src/engine/stato.ts
var LIMITE = 9.5;

// src/engine/regole-provvisorie.ts
function p1_sostituzioneAncheConStopAttivo() {
  return true;
}
function p2_qualeCopertaSostituireDopoGiocoliere(coperte) {
  return coperte[0];
}
function p3_valoreDaTogliere(carta) {
  if (carta.carta.tipo !== "numero" || !carta.scoperta) return 0;
  return carta.carta.valore * carta.fattore;
}

// src/engine/motore.ts
var ErroreAzione = class extends Error {
};
function punteggio(stato, giocatore) {
  const g = stato.giocatori[giocatore];
  let somma = g.correzione;
  for (const c of g.inGioco) {
    if (c.scoperta && c.carta.tipo === "numero") somma += c.carta.valore * c.fattore;
  }
  return somma;
}
function stopScoperti(stato, giocatore) {
  return stato.giocatori[giocatore].inGioco.filter((c) => c.scoperta && c.carta.tipo === "stop").length;
}
function stopAttivo(stato, giocatore) {
  return stopScoperti(stato, giocatore) % 2 === 1;
}
function valutazione(stato, giocatore) {
  const g = stato.giocatori[giocatore];
  const p = punteggio(stato, giocatore);
  if (g.esito === "sballato" || p > LIMITE) return { categoria: "sballato", punteggio: p };
  const haNumeriche = g.inGioco.some((c) => c.scoperta && c.carta.tipo === "numero");
  if (!haNumeriche) return { categoria: "limbo", punteggio: p };
  if (p === 0) return { categoria: "zero", punteggio: p };
  return { categoria: "punti", punteggio: p };
}
var PESO_CATEGORIA = { sballato: 0, limbo: 1, zero: 2, punti: 3 };
function rango(stato, giocatore) {
  const v = valutazione(stato, giocatore);
  return PESO_CATEGORIA[v.categoria] * 100 + (v.categoria === "punti" ? v.punteggio : 0);
}
function haTagliatette(g) {
  return g.riserva.some((c) => c.tipo === "tagliatette");
}
function carteDisponibili(stato) {
  return stato.mazzo.length + stato.scarti.length;
}
function fmt(n) {
  return String(n).replace(".", ",");
}
function azioniPermesse(stato) {
  const azioni = [];
  switch (stato.fase) {
    case "turno": {
      const t = stato.turno;
      const g = stato.giocatori[t.giocatore];
      const coperte = g.inGioco.filter((c) => !c.scoperta).length;
      if (t.coda.length > 0) {
        azioni.push({ tipo: "pesca", giocatore: t.giocatore, obbligatoria: true });
      } else {
        if (coperte > 0) azioni.push({ tipo: "rivela", giocatore: t.giocatore });
        if (coperte === 0 && !stopAttivo(stato, t.giocatore) && carteDisponibili(stato) > 0) {
          azioni.push({ tipo: "pesca", giocatore: t.giocatore, obbligatoria: false });
        }
        if (!t.deveRivelare) azioni.push({ tipo: "fermati", giocatore: t.giocatore });
      }
      if (haTagliatette(g)) azioni.push({ tipo: "usaTagliatette", giocatore: t.giocatore });
      break;
    }
    case "decisioneSballo": {
      const gi = stato.turno.giocatore;
      azioni.push({ tipo: "usaTagliatette", giocatore: gi });
      azioni.push({ tipo: "rinunciaTagliatette", giocatore: gi });
      break;
    }
    case "moneta":
      azioni.push({ tipo: "scegliMoneta", giocatore: stato.moneta.sceglie });
      break;
    case "segnalino": {
      const v = stato.vincitoreMano;
      const scoperte = stato.giocatori[v].inGioco.filter((c) => c.scoperta).map((c) => c.carta.id);
      azioni.push({ tipo: "scegliSegnalino", giocatore: v, carte: scoperte.length > 0 ? scoperte : [null] });
      break;
    }
    case "finita":
      break;
  }
  return azioni;
}
function creaPartita(opzioni) {
  const n = opzioni.giocatori.length;
  if (n < 2 || n > 6) throw new ErroreAzione("Servono da 2 a 6 giocatori (decisione O1).");
  const modalita = n <= 3 ? "esaurimentoMazzo" : "obiettivoPunti";
  const obiettivo = modalita === "obiettivoPunti" ? opzioni.obiettivoPunti ?? 5 : null;
  if (obiettivo !== null && (!Number.isInteger(obiettivo) || obiettivo < 1)) {
    throw new ErroreAzione("L'obiettivo punti deve essere un numero intero positivo.");
  }
  const s = {
    giocatori: opzioni.giocatori.map((nome) => ({
      nome,
      inGioco: [],
      riserva: [],
      segnalini: [],
      correzione: 0,
      esito: "daGiocare"
    })),
    mazzo: [],
    scarti: [],
    modalita,
    obiettivoPunti: obiettivo,
    numeroMano: 0,
    primoGiocatore: 0,
    partecipanti: [],
    ultimaMano: false,
    manoSpareggio: false,
    fase: "turno",
    turno: null,
    moneta: null,
    vincitoreMano: null,
    vincitorePartita: null,
    registro: []
  };
  const caso = opzioni.caso;
  s.mazzo = caso.mescola(creaMazzo());
  registra(s, "inizioPartita", `Partita con ${n} giocatori, modalit\xE0 ${modalita === "esaurimentoMazzo" ? "esaurimento mazzo" : `obiettivo ${obiettivo} punti`}. Mazzo di ${s.mazzo.length} carte mescolato.`);
  s.primoGiocatore = caso.intero(n);
  registra(s, "primoGiocatore", `Estratto a caso il primo giocatore: ${s.giocatori[s.primoGiocatore].nome}.`);
  iniziaMano(s, caso, s.giocatori.map((_, i) => i));
  return s;
}
function applicaAzione(stato, azione, caso) {
  const permessa = azioniPermesse(stato).find(
    (a) => a.tipo === azione.tipo && a.giocatore === azione.giocatore
  );
  if (!permessa) {
    throw new ErroreAzione(
      `Azione "${azione.tipo}" non permessa adesso al giocatore ${azione.giocatore}.`
    );
  }
  if (azione.tipo === "scegliSegnalino" && !permessa.carte.includes(azione.cartaId)) {
    throw new ErroreAzione("Come segnalino si pu\xF2 scegliere solo una propria carta scoperta.");
  }
  const s = structuredClone(stato);
  const gi = azione.giocatore;
  const g = s.giocatori[gi];
  switch (azione.tipo) {
    case "rivela": {
      const carta = g.inGioco.find((c) => !c.scoperta);
      rivelaCarta(s, caso, carta, "rivela");
      dopoAzione(s, caso);
      break;
    }
    case "pesca": {
      const t = s.turno;
      const obbligatoria = t.coda.length > 0;
      if (obbligatoria) t.coda.shift();
      const carta = pescaDalMazzo(s, caso);
      if (carta) {
        const cig = { carta, scoperta: false, fattore: 1, ordine: 0 };
        g.inGioco.push(cig);
        rivelaCarta(s, caso, cig, obbligatoria ? "pescaObbligatoria" : "pesca");
      }
      dopoAzione(s, caso);
      break;
    }
    case "fermati":
      registra(s, "fermati", `${g.nome} si ferma con ${descriviPunteggio(s, gi)}.`, gi);
      g.esito = "fermo";
      concludiTurno(s, caso);
      break;
    case "usaTagliatette": {
      const prima = punteggio(s, gi);
      const i = g.riserva.findIndex((c) => c.tipo === "tagliatette");
      s.scarti.push(g.riserva.splice(i, 1)[0]);
      for (const c of g.inGioco) if (c.scoperta && c.carta.tipo === "numero") c.fattore /= 2;
      g.correzione /= 2;
      registra(
        s,
        "tagliatette",
        `${g.nome} usa un Tagliatette: punteggio ${fmt(prima)} \u2192 ${fmt(punteggio(s, gi))}. Il Tagliatette va negli scarti.`,
        gi
      );
      dopoAzione(s, caso);
      break;
    }
    case "rinunciaTagliatette":
      registra(s, "sballo", `${g.nome} non usa il Tagliatette e resta sballato.`, gi);
      g.esito = "sballato";
      concludiTurno(s, caso);
      break;
    case "scegliMoneta":
      lanciaMoneta(s, caso, azione.scelta);
      break;
    case "scegliSegnalino": {
      let carta = null;
      if (azione.cartaId !== null) {
        const i = g.inGioco.findIndex((c) => c.carta.id === azione.cartaId);
        carta = g.inGioco.splice(i, 1)[0].carta;
      }
      g.segnalini.push({ carta });
      registra(
        s,
        "segnalino",
        `${g.nome} prende come segnalino ${carta ? `la carta ${nomeCarta(carta)}` : "un segnalino senza carta"} (totale ${g.segnalini.length}).`,
        gi
      );
      chiudiMano(s, caso, gi);
      break;
    }
  }
  return s;
}
function registra(s, tipo, testo, giocatore) {
  s.registro.push({ mano: s.numeroMano, tipo, testo, ...giocatore !== void 0 ? { giocatore } : {} });
}
function iniziaMano(s, caso, partecipanti) {
  s.numeroMano++;
  const n = s.giocatori.length;
  s.partecipanti = [];
  for (let k = 0; k < n; k++) {
    const i = (s.primoGiocatore + k) % n;
    if (partecipanti.includes(i)) s.partecipanti.push(i);
  }
  s.giocatori.forEach((g, i) => {
    g.inGioco = [];
    g.correzione = 0;
    g.esito = s.partecipanti.includes(i) ? "daGiocare" : "nonPartecipa";
  });
  s.vincitoreMano = null;
  s.moneta = null;
  const nomi = s.partecipanti.map((i) => s.giocatori[i].nome).join(", ");
  registra(
    s,
    "inizioMano",
    `Inizia la mano ${s.numeroMano}${s.manoSpareggio ? " (spareggio di fine partita)" : ""}${s.ultimaMano ? " (ultima mano)" : ""}. Ordine di gioco: ${nomi}.`
  );
  iniziaTurno(s, caso, s.partecipanti[0]);
}
function iniziaTurno(s, caso, gi) {
  const g = s.giocatori[gi];
  s.fase = "turno";
  s.turno = { giocatore: gi, coda: [], rivelazioniNelGruppo: 0, deveRivelare: true, dopoGiocoliere: false, contatore: 0 };
  g.esito = "inTurno";
  for (let k = 0; k < 2; k++) {
    const carta = pescaDalMazzo(s, caso);
    if (carta) g.inGioco.push({ carta, scoperta: false, fattore: 1, ordine: 0 });
  }
  registra(s, "inizioTurno", `Turno di ${g.nome}: riceve ${g.inGioco.length} carte coperte.`, gi);
  if (g.inGioco.length === 0) {
    s.turno.deveRivelare = false;
  }
}
function concludiTurno(s, caso) {
  const gi = s.turno.giocatore;
  const pos = s.partecipanti.indexOf(gi);
  if (pos + 1 < s.partecipanti.length) iniziaTurno(s, caso, s.partecipanti[pos + 1]);
  else fineMano(s, caso);
}
function pescaDalMazzo(s, caso) {
  if (s.mazzo.length === 0) rimescolaScarti(s, caso);
  const carta = s.mazzo.shift() ?? null;
  if (carta && s.mazzo.length === 0) rimescolaScarti(s, caso);
  return carta;
}
function rimescolaScarti(s, caso) {
  if (s.scarti.length === 0) {
    registra(s, "mazzoVuoto", "Il mazzo \xE8 finito e non ci sono scarti da rimescolare.");
    return;
  }
  s.mazzo = caso.mescola([...s.mazzo, ...s.scarti]);
  s.scarti = [];
  registra(s, "rimescola", `Il mazzo \xE8 finito: si rimescolano gli scarti (${s.mazzo.length} carte).`);
  if (s.modalita === "esaurimentoMazzo" && !s.ultimaMano && !s.manoSpareggio && s.fase !== "finita") {
    s.ultimaMano = true;
    registra(s, "ultimaMano", "Questa mano \xE8 l'ultima della partita.");
  }
}
var VERBI = {
  rivela: "rivela",
  pesca: "pesca",
  pescaObbligatoria: "pesca (pescata obbligatoria)",
  sostitutiva: "pesca la sostitutiva"
};
function rivelaCarta(s, caso, cig, modo) {
  const t = s.turno;
  const gi = t.giocatore;
  const g = s.giocatori[gi];
  cig.scoperta = true;
  cig.ordine = ++t.contatore;
  const primaDelGruppo = t.rivelazioniNelGruppo === 0;
  t.rivelazioniNelGruppo++;
  t.deveRivelare = false;
  registra(s, modo === "rivela" ? "rivela" : "pesca", `${g.nome} ${VERBI[modo]}: ${nomeCarta(cig.carta)}.`, gi);
  const carta = cig.carta;
  switch (carta.tipo) {
    case "numero":
      break;
    case "stop": {
      const n = stopScoperti(s, gi);
      if (n % 2 === 1) {
        registra(s, "stop", `${n} Stop scoperti (dispari): pesca bloccata.`, gi);
        annullaCoda(s, "lo Stop blocca la pesca");
      } else {
        registra(s, "stop", `${n} Stop scoperti (pari): nessun blocco.`, gi);
      }
      break;
    }
    case "piu1":
    case "piu2": {
      const quante = carta.tipo === "piu1" ? 1 : 2;
      if (stopAttivo(s, gi)) {
        registra(s, "senzaEffetto", `Lo Stop \xE8 attivo: il ${nomeCarta(carta)} non ha effetto.`, gi);
      } else {
        for (let k = 0; k < quante; k++) t.coda.push({ origine: carta.id });
        registra(s, "obbligatorie", `${quante} pescate obbligatorie aggiunte in coda (in coda: ${t.coda.length}).`, gi);
      }
      break;
    }
    case "tagliatette":
      g.inGioco.splice(g.inGioco.indexOf(cig), 1);
      g.riserva.push(carta);
      registra(s, "riserva", `Il Tagliatette va nella riserva di ${g.nome}.`, gi);
      break;
    case "cambioTetta":
      applicaCambioTetta(s, caso, cig, primaDelGruppo);
      break;
    case "giocoliere":
      applicaGiocoliere(s, caso, cig);
      break;
  }
}
function annullaCoda(s, motivo) {
  const t = s.turno;
  if (t.coda.length > 0) {
    registra(s, "annullate", `${t.coda.length} pescate obbligatorie annullate: ${motivo}.`, t.giocatore);
    t.coda = [];
  }
}
function applicaCambioTetta(s, caso, ct, primaDelGruppo) {
  const t = s.turno;
  const gi = t.giocatore;
  const g = s.giocatori[gi];
  const coperte = g.inGioco.filter((c) => !c.scoperta);
  let bersaglio;
  let coperta = false;
  if (primaDelGruppo && coperte.length > 0) {
    bersaglio = t.dopoGiocoliere ? p2_qualeCopertaSostituireDopoGiocoliere(coperte) : coperte[0];
    coperta = true;
  } else {
    for (const c of g.inGioco) {
      if (c !== ct && c.scoperta && (!bersaglio || c.ordine > bersaglio.ordine)) bersaglio = c;
    }
  }
  if (!bersaglio) {
    registra(s, "cambioTetta", "Cambio Tetta: nessuna carta in gioco da sostituire, nessun effetto.", gi);
    return;
  }
  if (stopAttivo(s, gi) && !p1_sostituzioneAncheConStopAttivo()) {
    registra(s, "cambioTetta", "Cambio Tetta: lo Stop \xE8 attivo, nessuna sostituzione.", gi);
    return;
  }
  if (bersaglio.scoperta && bersaglio.carta.tipo === "numero") {
    g.correzione += bersaglio.carta.valore * bersaglio.fattore - p3_valoreDaTogliere(bersaglio);
  }
  const pos = g.inGioco.indexOf(bersaglio);
  g.inGioco.splice(pos, 1);
  const prima = t.coda.length;
  t.coda = t.coda.filter((p) => p.origine !== bersaglio.carta.id);
  s.mazzo = caso.mescola([...s.mazzo, bersaglio.carta]);
  registra(
    s,
    "cambioTetta",
    coperta ? "Cambio Tetta: una carta coperta torna nel mazzo senza essere vista; si rimescola il mazzo." : `Cambio Tetta: ${nomeCarta(bersaglio.carta)} torna nel mazzo; si rimescola il mazzo.`,
    gi
  );
  if (t.coda.length < prima) {
    registra(s, "annullate", `${prima - t.coda.length} pescate obbligatorie del ${nomeCarta(bersaglio.carta)} interrotte.`, gi);
  }
  const carta = pescaDalMazzo(s, caso);
  if (!carta) return;
  const sostitutiva = { carta, scoperta: false, fattore: 1, ordine: 0 };
  g.inGioco.splice(pos, 0, sostitutiva);
  rivelaCarta(s, caso, sostitutiva, "sostitutiva");
}
function applicaGiocoliere(s, caso, giocoliere) {
  const t = s.turno;
  const gi = t.giocatore;
  const g = s.giocatori[gi];
  const quante = g.inGioco.length;
  const altre = g.inGioco.filter((c) => c !== giocoliere).map((c) => c.carta);
  g.inGioco = [];
  g.correzione = 0;
  t.coda = [];
  s.scarti.push(giocoliere.carta);
  s.mazzo = caso.mescola([...s.mazzo, ...altre]);
  registra(
    s,
    "giocoliere",
    `Giocoliere: ${altre.length} carte tornano nel mazzo, effetti interrotti, Giocoliere negli scarti. Si rimescola e ${g.nome} riceve ${quante} carte coperte.`,
    gi
  );
  for (let k = 0; k < quante; k++) {
    const carta = pescaDalMazzo(s, caso);
    if (carta) g.inGioco.push({ carta, scoperta: false, fattore: 1, ordine: 0 });
  }
  t.rivelazioniNelGruppo = 0;
  t.deveRivelare = g.inGioco.length > 0;
  t.dopoGiocoliere = true;
}
function dopoAzione(s, caso) {
  const t = s.turno;
  const gi = t.giocatore;
  const g = s.giocatori[gi];
  if (stopAttivo(s, gi)) annullaCoda(s, "lo Stop blocca la pesca");
  const p = punteggio(s, gi);
  if (p > LIMITE) {
    if (haTagliatette(g)) {
      if (s.fase !== "decisioneSballo") {
        registra(s, "sballo", `${g.nome} sballa con ${fmt(p)}: pu\xF2 usare un Tagliatette.`, gi);
      }
      s.fase = "decisioneSballo";
      return;
    }
    registra(s, "sballo", `${g.nome} sballa con ${fmt(p)}. Turno finito.`, gi);
    g.esito = "sballato";
    concludiTurno(s, caso);
    return;
  }
  if (s.fase === "decisioneSballo") {
    s.fase = "turno";
    registra(s, "rientro", `${g.nome} rientra con ${fmt(p)}.`, gi);
  }
  if (t.coda.length > 0 && carteDisponibili(s) === 0) {
    annullaCoda(s, "non ci sono pi\xF9 carte da pescare");
  }
  const coperte = g.inGioco.filter((c) => !c.scoperta).length;
  if (t.coda.length === 0 && coperte === 0 && stopAttivo(s, gi)) {
    registra(s, "fineTurno", `Stop attivo e nessuna carta coperta: turno di ${g.nome} finito con ${descriviPunteggio(s, gi)}.`, gi);
    g.esito = "fermo";
    concludiTurno(s, caso);
  }
}
function descriviPunteggio(s, gi) {
  const v = valutazione(s, gi);
  if (v.categoria === "limbo") return "solo carte speciali (limbo)";
  return `${fmt(v.punteggio)} ${v.punteggio === 1 ? "punto" : "punti"}`;
}
function fineMano(s, caso) {
  s.turno = null;
  const ranghi = s.partecipanti.map((i) => ({ i, r: rango(s, i) }));
  const migliore = Math.max(...ranghi.map((x) => x.r));
  if (migliore < PESO_CATEGORIA.limbo * 100) {
    registra(s, "fineMano", "Tutti i giocatori hanno sballato: nessuno vince la mano.");
    chiudiMano(s, caso, null);
    return;
  }
  const pari = ranghi.filter((x) => x.r === migliore).map((x) => x.i);
  if (pari.length === 1) {
    assegnaVittoria(s, pari[0], `con ${descriviPunteggio(s, pari[0])}`);
  } else if (pari.length === 2) {
    preparaMoneta(s, pari[0], pari[1], "ha raggiunto per secondo quel punteggio");
  } else {
    spareggioCarte(s, caso, pari);
  }
}
function preparaMoneta(s, primo, secondo, perche) {
  s.fase = "moneta";
  s.moneta = { sceglie: secondo, altro: primo };
  registra(
    s,
    "pareggio",
    `Pareggio tra ${s.giocatori[primo].nome} e ${s.giocatori[secondo].nome}: lancio della moneta. Sceglie testa o croce ${s.giocatori[secondo].nome}, che ${perche}.`
  );
}
function lanciaMoneta(s, caso, scelta) {
  const { sceglie, altro } = s.moneta;
  const uscita = caso.moneta();
  const vincitore = uscita === scelta ? sceglie : altro;
  registra(s, "moneta", `${s.giocatori[sceglie].nome} sceglie ${scelta}; esce ${uscita}.`);
  s.moneta = null;
  assegnaVittoria(s, vincitore, "al lancio della moneta");
}
function valoreSpareggio(c) {
  return c.tipo === "numero" ? c.valore : -1;
}
function spareggioCarte(s, caso, pari) {
  const carte = s.partecipanti.flatMap((i) => s.giocatori[i].inGioco.map((c) => c.carta));
  let inGara = pari;
  registra(s, "pareggio", `Pareggio tra ${inGara.length} giocatori: si raccolgono ${carte.length} carte in gioco e si pesca.`);
  for (let giro = 0; giro < 1e3; giro++) {
    if (carte.length < inGara.length) {
      throw new Error(
        "Caso non coperto dal regolamento: per lo spareggio ci sono meno carte in gioco che giocatori in pareggio."
      );
    }
    const mescolate = caso.mescola(carte);
    const pescate = inGara.map((i, k) => ({ i, carta: mescolate[k] }));
    registra(
      s,
      "spareggio",
      pescate.map((p) => `${s.giocatori[p.i].nome} pesca ${nomeCarta(p.carta)}`).join(", ") + "."
    );
    const max = Math.max(...pescate.map((p) => valoreSpareggio(p.carta)));
    const migliori = pescate.filter((p) => valoreSpareggio(p.carta) === max).map((p) => p.i);
    if (migliori.length === 1) {
      assegnaVittoria(s, migliori[0], "allo spareggio con le carte");
      return;
    }
    if (migliori.length === 2) {
      preparaMoneta(s, migliori[0], migliori[1], "ha pescato per secondo");
      return;
    }
    registra(s, "spareggio", `Ancora pareggio tra ${migliori.length}: si rimescola e si ripete.`);
    inGara = migliori;
  }
  throw new Error("Spareggio con le carte ripetuto troppe volte.");
}
function assegnaVittoria(s, vincitore, come) {
  s.vincitoreMano = vincitore;
  s.fase = "segnalino";
  registra(s, "fineMano", `${s.giocatori[vincitore].nome} vince la mano ${come} e sceglie il segnalino.`, vincitore);
}
function chiudiMano(s, caso, vincitore) {
  for (const i of s.partecipanti) {
    const g = s.giocatori[i];
    s.scarti.push(...g.inGioco.map((c) => c.carta));
    g.inGioco = [];
  }
  s.vincitoreMano = vincitore;
  const n = s.giocatori.length;
  if (s.modalita === "obiettivoPunti") {
    if (vincitore !== null && s.giocatori[vincitore].segnalini.length >= s.obiettivoPunti) {
      return terminaPartita(s, vincitore, `raggiunge l'obiettivo di ${s.obiettivoPunti} punti`);
    }
  } else if (s.manoSpareggio) {
    if (vincitore !== null) return terminaPartita(s, vincitore, "vince la mano di spareggio");
    registra(s, "spareggioPartita", "Nessun vincitore nella mano di spareggio: se ne gioca un'altra.");
    return prossimaMano(s, caso, s.partecipanti);
  } else if (s.ultimaMano) {
    const max = Math.max(...s.giocatori.map((g) => g.segnalini.length));
    const primi = s.giocatori.map((g, i) => ({ g, i })).filter((x) => x.g.segnalini.length === max).map((x) => x.i);
    if (primi.length === 1) return terminaPartita(s, primi[0], `ha pi\xF9 segnalini (${max})`);
    s.manoSpareggio = true;
    registra(
      s,
      "spareggioPartita",
      `Parit\xE0 di segnalini (${max}) tra ${primi.map((i) => s.giocatori[i].nome).join(", ")}: mano di spareggio.`
    );
    return prossimaMano(s, caso, primi);
  } else if (s.mazzo.length < 2 * n) {
    s.mazzo = caso.mescola([...s.mazzo, ...s.scarti]);
    s.scarti = [];
    s.ultimaMano = true;
    registra(
      s,
      "rimescola",
      `Le carte non bastano per la prossima mano: si rimescolano scarti e carte rimaste (${s.mazzo.length}). La prossima mano \xE8 l'ultima.`
    );
  }
  prossimaMano(s, caso, s.giocatori.map((_, i) => i));
}
function prossimaMano(s, caso, partecipanti) {
  s.primoGiocatore = (s.primoGiocatore + 1) % s.giocatori.length;
  iniziaMano(s, caso, partecipanti);
}
function terminaPartita(s, vincitore, motivo) {
  s.fase = "finita";
  s.turno = null;
  s.vincitorePartita = vincitore;
  registra(s, "finePartita", `Fine partita: vince ${s.giocatori[vincitore].nome}, che ${motivo}.`, vincitore);
}

// src/server/caso-sicuro.ts
function interoSicuro(n) {
  if (!Number.isInteger(n) || n < 1 || n > 2 ** 32) throw new Error(`interoSicuro: n non valido (${n})`);
  const limite = Math.floor(2 ** 32 / n) * n;
  const buf = new Uint32Array(1);
  for (; ; ) {
    crypto.getRandomValues(buf);
    if (buf[0] < limite) return buf[0] % n;
  }
}
function casoSicuro() {
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
    moneta: () => interoSicuro(2) === 0 ? "testa" : "croce"
  };
}

// src/server/vista.ts
var EVENTI_NELLA_VISTA = 300;
function vistaPubblica(stato) {
  return {
    giocatori: stato.giocatori.map((g, i) => ({
      nome: g.nome,
      inGioco: g.inGioco.map(
        (c) => c.scoperta ? { coperta: false, carta: c.carta, fattore: c.fattore, ordine: c.ordine } : { coperta: true }
      ),
      riserva: g.riserva,
      segnalini: g.segnalini,
      esito: g.esito,
      punteggio: punteggio(stato, i),
      stopAttivo: stopAttivo(stato, i)
    })),
    carteNelMazzo: stato.mazzo.length,
    carteNegliScarti: stato.scarti.length,
    modalita: stato.modalita,
    obiettivoPunti: stato.obiettivoPunti,
    numeroMano: stato.numeroMano,
    primoGiocatore: stato.primoGiocatore,
    partecipanti: stato.partecipanti,
    ultimaMano: stato.ultimaMano,
    manoSpareggio: stato.manoSpareggio,
    fase: stato.fase,
    turno: stato.turno ? {
      giocatore: stato.turno.giocatore,
      deveRivelare: stato.turno.deveRivelare,
      pescateObbligatorie: stato.turno.coda.length
    } : null,
    moneta: stato.moneta,
    vincitoreMano: stato.vincitoreMano,
    vincitorePartita: stato.vincitorePartita,
    azioniPermesse: azioniPermesse(stato),
    registro: stato.registro.slice(-EVENTI_NELLA_VISTA)
  };
}

// src/server/servizio.ts
var OBIETTIVI_PERMESSI = [3, 5, 7];
function avviaPartita(nomi, obiettivoPunti, caso = casoSicuro()) {
  if (nomi.length >= 4) {
    const ob = obiettivoPunti ?? 5;
    if (!OBIETTIVI_PERMESSI.includes(ob)) {
      throw new ErroreAzione("L'obiettivo punti pu\xF2 essere 3, 5 o 7.");
    }
    obiettivoPunti = ob;
  }
  const stato = creaPartita({ giocatori: nomi, obiettivoPunti: obiettivoPunti ?? void 0, caso });
  return { stato, vista: vistaPubblica(stato), finita: stato.fase === "finita" };
}
function leggiAzione(richiesta, giocatore) {
  if (typeof richiesta !== "object" || richiesta === null) throw new ErroreAzione("Mossa non valida.");
  const r = richiesta;
  switch (r.tipo) {
    case "rivela":
    case "pesca":
    case "fermati":
    case "usaTagliatette":
    case "rinunciaTagliatette":
      return { tipo: r.tipo, giocatore };
    case "scegliMoneta":
      if (r.scelta !== "testa" && r.scelta !== "croce") throw new ErroreAzione("Scegli testa o croce.");
      return { tipo: "scegliMoneta", giocatore, scelta: r.scelta };
    case "scegliSegnalino":
      if (r.cartaId !== null && !Number.isInteger(r.cartaId)) throw new ErroreAzione("Carta non valida.");
      return { tipo: "scegliSegnalino", giocatore, cartaId: r.cartaId };
    default:
      throw new ErroreAzione("Mossa sconosciuta.");
  }
}
function eseguiMossa(stato, giocatore, richiesta, caso = casoSicuro()) {
  if (stato.fase === "finita") throw new ErroreAzione("La partita \xE8 gi\xE0 finita.");
  const azione = leggiAzione(richiesta, giocatore);
  const nuovo = applicaAzione(stato, azione, caso);
  return { stato: nuovo, vista: vistaPubblica(nuovo), finita: nuovo.fase === "finita", azione };
}
export {
  EVENTI_NELLA_VISTA,
  ErroreAzione,
  OBIETTIVI_PERMESSI,
  avviaPartita,
  casoSicuro,
  eseguiMossa,
  leggiAzione,
  vistaPubblica
};
