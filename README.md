# 9,5 – cervello del gioco (Fase A)

Solo le regole del gioco, senza grafica e senza online. Le regole sono quelle di `regolamento.md`.

## Come verificare

Serve Node.js (versione 20 o più recente). Nella cartella del progetto:

```
npm install
npm test
```

Alla fine deve comparire `Tests  114 passed (114)` e nessuna riga rossa.

## Dove sono le cose

- `src/engine/` – il motore delle regole
  - `carte.ts` – le 115 carte
  - `caso.ts` – mescolamento, primo giocatore e moneta (sostituibile nei test)
  - `stato.ts` – com'è fatta la "fotografia" della partita
  - `motore.ts` – azioni permesse, effetti delle carte, fine mano e fine partita
  - `regole-provvisorie.ts` – P1, P2, P3 (sezione 7 del regolamento), tutte qui
- `test/` – i test; `casi-di-prova.test.ts` contiene T1–T13

## Provare il gioco nel browser (Fase B)

```
npm run avvia
```

Poi apri l'indirizzo che compare aggiungendo `/prototipo.html` (di solito http://localhost:5173/prototipo.html). Si sceglie il numero di giocatori e i nomi, e si gioca tutti sullo stesso schermo: i pulsanti in basso mostrano solo le mosse permesse. Le carte coperte si vedono come dorso blu. Per vincere un segnalino si clicca una propria carta scoperta.

## Pagina unica senza installazione

`npm run pagina-unica` crea `dist/gioco-singolo.html`: un solo file con dentro tutto il gioco, che si apre con un doppio clic o si pubblica così com'è.

## Versione online (Fase C, in costruzione)

`npm run avvia` e poi http://localhost:5173 apre il gioco online. Per provarlo senza internet: http://localhost:5173/?finto (server finto nel browser; ogni scheda è un giocatore diverso).

Database e server su Supabase, spiegati in `docs/online.md`.

- `supabase/migrations/` – le tabelle e le regole di sicurezza del database
- `supabase/functions/gioco/` – il server di gioco (usa il motore impacchettato con `npm run prepara-server`)
- `src/server/` – avvio partita, mosse, vista pubblica senza carte coperte
- `src/online/cliente.ts` – il collegamento con il server
- `src/online/schermata.ts` – la schermata online (pagina `index.html`)
