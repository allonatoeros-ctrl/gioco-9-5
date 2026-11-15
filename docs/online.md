# 9,5 online – come è fatto (Fase C)

Questo documento spiega, in parole semplici, come funziona la versione online. È il "documento dedicato" della Fase C previsto da `CLAUDE.md`.

## 1. I pezzi

| Pezzo | Cosa fa | Dove sta |
| --- | --- | --- |
| **Database** (Supabase) | Ricorda stanze, giocatori, partite e mosse. | progetto Supabase `gioco-9-5`, file `supabase/migrations/` |
| **Server di gioco** (Edge Function `gioco`) | Riceve le mosse, le fa controllare al motore delle regole, salva il risultato. | `supabase/functions/gioco/` |
| **Motore delle regole** | Lo stesso della Fase A, senza nessuna modifica. | `src/engine/` |
| **Logica del server** | Avvio partita, mosse, e la "vista pubblica" che nasconde le carte coperte. | `src/server/` |
| **Collegamento per il telefono** | Le funzioni che la futura schermata online userà: crea stanza, entra, gioca, ascolta. | `src/online/cliente.ts` |
| **Sito** (Vercel) | Pubblicherà le pagine del gioco. Non ancora fatto. | – |

## 2. Come si gioca, passo per passo

1. Il telefono entra con un **accesso anonimo**: niente email o password, ma il dispositivo resta riconosciuto.
2. Chi crea la stanza riceve un **codice di 5 caratteri** (es. `K7M2Q`, senza lettere che si confondono come O e 0).
3. Gli amici entrano con il codice. Massimo 6 (O1).
4. Chi ha creato la stanza avvia la partita; con 4 o più giocatori sceglie l'obiettivo tra 3, 5 e 7 (O2).
5. Il **server** mescola e sceglie il primo giocatore (O3, O9): i telefoni non mescolano mai.
6. Ogni mossa va al server. Il server controlla **chi** la chiede, il motore controlla **se** è permessa.
7. Tutti i telefoni ricevono un avviso **in tempo reale** e ridisegnano la partita.

## 3. Chi vede cosa

- Ogni telefono riceve solo la **vista pubblica**: carte scoperte, riserve, segnalini, quante carte ha il mazzo, di chi è il turno, le mosse permesse.
- Le **carte coperte** e l'**ordine del mazzo** stanno solo nella tabella `partite_segrete`, che nessun telefono può leggere. Nemmeno chi ha le carte davanti vede le proprie coperte (come al tavolo).
- Il mescolamento usa il caso "crittografico" del sistema, quindi non si può indovinare l'ordine del mazzo guardando le carte uscite.
- I telefoni **non possono scrivere** direttamente nel database: possono solo usare le funzioni previste (crea, entra, esci) e chiedere mosse al server.

## 4. Se cade la connessione

- Il dispositivo resta riconosciuto: rientrando con lo stesso codice si ritrova **lo stesso posto** e la partita al punto giusto.
- Ogni mossa ha un numero di **versione**: se due richieste arrivano insieme, ne passa una sola e l'altra riceve "la partita è andata avanti, riprova". Così la partita non si rompe mai.
- Ogni telefono segnala "ci sono" ogni 20 secondi (`ultimo_contatto`): servirà per le regole sulle disconnessioni.

## 5. Le tabelle del database

| Tabella | Contenuto |
| --- | --- |
| `stanze` | codice, chi l'ha creata, stato (attesa → in corso → finita) |
| `giocatori` | chi è seduto, nome, posto (0–5), ultimo contatto |
| `partite` | la vista pubblica e il numero di versione |
| `partite_segrete` | lo stato completo (solo server) |
| `mosse` | lo storico di tutte le mosse, in ordine |

## 6. Cosa NON c'è ancora (va deciso o fatto)

1. **Tempi e disconnessioni (O5, O6, O7, O8)**: nel regolamento sono proposte "da confermare". Il database è pronto (ultimo contatto, versione), ma i timer non sono attivi. Oggi non si può uscire da una partita in corso.
2. **La schermata online**: le pagine per creare/entrare in una stanza e giocare dal telefono. Il collegamento (`src/online/cliente.ts`) è pronto.
3. **Pubblicazione su Vercel**: si fa quando c'è la schermata online.
4. **Carta Spione** (regolamento v1.2): il motore è ancora a 115 carte.

## 7. Comandi utili

- `npm test` – tutte le prove, comprese quelle del database (girano con un Postgres finto, senza internet).
- `npm run prepara-server` – da lanciare quando si cambia il motore: aggiorna il file usato dal server.
- `npx tsx tools/prova-online.ts` – prova dal vivo sul server vero: due giocatori finti giocano una partita intera.
