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

Poi apri l'indirizzo che compare (di solito http://localhost:5173). Si sceglie il numero di giocatori e i nomi, e si gioca tutti sullo stesso schermo: i pulsanti in basso mostrano solo le mosse permesse. Le carte coperte si vedono come dorso blu. Per vincere un segnalino si clicca una propria carta scoperta.

## Pagina unica senza installazione

`npm run pagina-unica` crea `dist/gioco-singolo.html`: un solo file con dentro tutto il gioco, che si apre con un doppio clic o si pubblica così com'è.
