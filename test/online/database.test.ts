// Prova del database online SENZA Supabase: usa PGlite, un vero Postgres che gira
// dentro il test. Prima si "finge" la parte di Supabase che serve (utenti, ruoli),
// poi si applica la stessa migrazione che va su Supabase.
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { beforeAll, describe, expect, it } from 'vitest';

const MIGRAZIONE = ['20261115180000_gioco_online.sql', '20261120180000_uscita_e_rivincita.sql']
  .map((f) => readFileSync(new URL(`../../supabase/migrations/${f}`, import.meta.url), 'utf8'))
  .join('\n');

const FINTO_SUPABASE = `
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  create schema auth; grant usage on schema auth to anon, authenticated, service_role;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant execute on function auth.uid() to anon, authenticated, service_role;
  create publication supabase_realtime;
`;

const ANNA = '00000000-0000-0000-0000-00000000000a';
const BRUNO = '00000000-0000-0000-0000-00000000000b';
const CARLA = '00000000-0000-0000-0000-00000000000c';
const ALTRI = Array.from({ length: 6 }, (_, i) => `00000000-0000-0000-0000-00000000010${i}`);

let db: PGlite;

/** Esegue una query come se fosse il telefono di quell'utente. */
async function come<T = Record<string, unknown>>(utente: string | null, sql: string, params: unknown[] = []) {
  await db.exec('reset role');
  await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [utente ?? '']);
  await db.exec(`set role ${utente ? 'authenticated' : 'anon'}`);
  try {
    return (await db.query<T>(sql, params)).rows;
  } finally {
    await db.exec('reset role');
  }
}

/** Esegue una query come il server di gioco (chiave di servizio). */
async function comeServer<T = Record<string, unknown>>(sql: string, params: unknown[] = []) {
  await db.exec('reset role');
  await db.exec('set role service_role');
  try {
    return (await db.query<T>(sql, params)).rows;
  } finally {
    await db.exec('reset role');
  }
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(FINTO_SUPABASE);
  await db.exec(MIGRAZIONE);
  for (const id of [ANNA, BRUNO, CARLA, ...ALTRI]) await db.query('insert into auth.users values ($1)', [id]);
});

describe('Database online', () => {
  let codice = '';
  let stanzaId = '';

  it('Anna crea una stanza: riceve un codice di 5 caratteri e il posto 0', async () => {
    const [r] = await come<{ stanza_id: string; codice: string; posto: number }>(ANNA, `select * from crea_stanza('Anna')`);
    expect(r.codice).toMatch(/^[A-HJ-NP-Z2-9]{5}$/);
    expect(r.posto).toBe(0);
    codice = r.codice;
    stanzaId = r.stanza_id;
  });

  it('chi non è collegato non può creare stanze', async () => {
    await expect(come(null, `select * from crea_stanza('X')`)).rejects.toThrow();
  });

  it('Bruno entra con il codice (anche scritto in minuscolo) e prende il posto 1', async () => {
    const [r] = await come<{ posto: number }>(BRUNO, `select * from entra_in_stanza($1, 'Bruno')`, [codice.toLowerCase()]);
    expect(r.posto).toBe(1);
  });

  it('se Bruno rientra ritrova lo stesso posto', async () => {
    const [r] = await come<{ posto: number }>(BRUNO, `select * from entra_in_stanza($1, 'Bruno')`, [codice]);
    expect(r.posto).toBe(1);
  });

  it('un codice sbagliato dà un errore chiaro', async () => {
    await expect(come(BRUNO, `select * from entra_in_stanza('ZZZZZ', 'Bruno')`)).rejects.toThrow('Nessuna stanza');
  });

  it('chi è nella stanza la vede, chi non c\'è no', async () => {
    expect(await come(ANNA, 'select * from stanze')).toHaveLength(1);
    expect(await come(BRUNO, 'select * from giocatori')).toHaveLength(2);
    expect(await come(CARLA, 'select * from stanze')).toHaveLength(0);
    expect(await come(CARLA, 'select * from giocatori')).toHaveLength(0);
  });

  it('i telefoni non possono scrivere direttamente nelle tabelle', async () => {
    await expect(come(ANNA, `update stanze set stato = 'finita'`)).rejects.toThrow();
    await expect(come(ANNA, `insert into giocatori (stanza_id, utente_id, nome, posto) values ($1, $2, 'X', 3)`, [stanzaId, CARLA])).rejects.toThrow();
    await expect(come(ANNA, `delete from giocatori`)).rejects.toThrow();
  });

  it('i telefoni non possono usare le funzioni del server', async () => {
    await expect(
      come(ANNA, `select server_avvia_partita($1, $2, '{0,1}', '{}', '{}')`, [stanzaId, ANNA]),
    ).rejects.toThrow();
  });

  it('solo l\'host può avviare, e con i giocatori giusti', async () => {
    await expect(
      comeServer(`select server_avvia_partita($1, $2, '{0,1}', '{}', '{}')`, [stanzaId, BRUNO]),
    ).rejects.toThrow('Solo chi ha creato');
    await expect(
      comeServer(`select server_avvia_partita($1, $2, '{0,1,2}', '{}', '{}')`, [stanzaId, ANNA]),
    ).rejects.toThrow('giocatori sono cambiati');
  });

  let partitaId = '';
  it('il server avvia la partita: la vista è leggibile, lo stato segreto no', async () => {
    const [r] = await comeServer<{ id: string }>(
      `select server_avvia_partita($1, $2, '{0,1}', '{"mazzo":["segreto"]}', '{"fase":"turno"}') as id`,
      [stanzaId, ANNA],
    );
    partitaId = r.id;
    const viste = await come<{ vista: unknown; versione: number }>(BRUNO, 'select vista, versione from partite');
    expect(viste).toEqual([{ vista: { fase: 'turno' }, versione: 0 }]);
    await expect(come(BRUNO, 'select * from partite_segrete')).rejects.toThrow();
    expect(await come(CARLA, 'select * from partite')).toHaveLength(0);
    const [st] = await come<{ stato: string }>(ANNA, 'select stato from stanze');
    expect(st.stato).toBe('in_corso');
  });

  it('a partita iniziata nessuno nuovo può entrare, ma chi c\'era rientra', async () => {
    await expect(come(CARLA, `select * from entra_in_stanza($1, 'Carla')`, [codice])).rejects.toThrow('già iniziata');
    const [r] = await come<{ posto: number }>(ANNA, `select * from entra_in_stanza($1, 'Anna')`, [codice]);
    expect(r.posto).toBe(0);
  });

  it('una mossa viene salvata solo se la versione è quella attesa', async () => {
    const [r] = await comeServer<{ v: number }>(
      `select server_registra_mossa($1, 0, 0::smallint, '{"tipo":"rivela"}', '{}', '{"fase":"turno"}', false) as v`,
      [partitaId],
    );
    expect(r.v).toBe(1);
    // Due mosse "contemporanee" sulla stessa versione: la seconda viene rifiutata.
    await expect(
      comeServer(`select server_registra_mossa($1, 0, 0::smallint, '{"tipo":"rivela"}', '{}', '{}', false)`, [partitaId]),
    ).rejects.toThrow('cambiata nel frattempo');
    const mosse = await come<{ numero: number }>(BRUNO, 'select numero from mosse');
    expect(mosse).toEqual([{ numero: 1 }]);
  });

  it('a fine partita la stanza diventa "finita" e non si accettano altre mosse', async () => {
    await comeServer(`select server_registra_mossa($1, 1, 1::smallint, '{"tipo":"fermati"}', '{}', '{"fase":"finita"}', true)`, [partitaId]);
    const [st] = await come<{ stato: string }>(ANNA, 'select stato from stanze');
    expect(st.stato).toBe('finita');
    await expect(
      comeServer(`select server_registra_mossa($1, 2, 0::smallint, '{}', '{}', '{}', false)`, [partitaId]),
    ).rejects.toThrow();
  });

  it('massimo 6 giocatori, e se esce l\'host il ruolo passa al seduto successivo', async () => {
    const [r] = await come<{ codice: string }>(ALTRI[0], `select * from crea_stanza('Host')`);
    for (let i = 1; i < 6; i++) await come(ALTRI[i], `select * from entra_in_stanza($1, $2)`, [r.codice, `G${i}`]);
    await expect(come(CARLA, `select * from entra_in_stanza($1, 'Carla')`, [r.codice])).rejects.toThrow('piena');
    await come(ALTRI[0], `select esci_dalla_stanza($1)`, [r.codice]);
    const [s] = await come<{ host_id: string }>(ALTRI[1], `select host_id from stanze where codice = $1`, [r.codice]);
    expect(s.host_id).toBe(ALTRI[1]);
    // Ora c'è un posto libero (lo 0) e Carla prende quello.
    const [c] = await come<{ posto: number }>(CARLA, `select * from entra_in_stanza($1, 'Carla')`, [r.codice]);
    expect(c.posto).toBe(0);
  });

  it('se escono tutti la stanza sparisce', async () => {
    const [r] = await come<{ codice: string; stanza_id: string }>(CARLA, `select * from crea_stanza('Carla')`);
    await come(CARLA, `select esci_dalla_stanza($1)`, [r.codice]);
    const righe = (await db.query('select 1 from stanze where id = $1', [r.stanza_id])).rows;
    expect(righe).toHaveLength(0);
  });

  it('a fine partita "Rigioca" riporta tutti in sala d\'attesa e si può ripartire', async () => {
    await expect(come(CARLA, `select ricomincia_stanza($1)`, [codice])).rejects.toThrow('Non sei in questa stanza');
    await come(BRUNO, `select ricomincia_stanza($1)`, [codice]);
    const [st] = await come<{ stato: string }>(ANNA, 'select stato from stanze where codice = $1', [codice]);
    expect(st.stato).toBe('attesa');
    expect(await come(ANNA, 'select 1 from partite')).toHaveLength(0);
    // Premuto due volte (da due telefoni): nessun errore.
    await come(ANNA, `select ricomincia_stanza($1)`, [codice]);
    const [nuova] = await comeServer<{ id: string }>(
      `select server_avvia_partita(s.id, $2, array[0,1]::smallint[], '{}', '{"fase":"turno"}') as id from stanze s where s.codice = $1`,
      [codice, ANNA],
    );
    expect(nuova.id).toBeTruthy();
    // A partita in corso "Rigioca" non si può usare.
    await expect(come(ANNA, `select ricomincia_stanza($1)`, [codice])).rejects.toThrow('non è ancora finita');
  });

  it('se qualcuno esce a partita in corso, la partita si interrompe per tutti', async () => {
    await come(BRUNO, `select esci_dalla_stanza($1)`, [codice]);
    const [st] = await come<{ stato: string }>(ANNA, 'select stato from stanze where codice = $1', [codice]);
    expect(st.stato).toBe('finita');
    const [p] = await come<{ finita: boolean; posti: number[] }>(ANNA, 'select finita, posti from partite');
    expect(p.finita).toBe(true);
    // Anna vede che il posto 1 (Bruno) non è più seduto.
    const seduti = await come<{ posto: number }>(ANNA, 'select posto from giocatori order by posto');
    expect(seduti).toEqual([{ posto: 0 }]);
    // Bruno non vede più la stanza, e non si accettano altre mosse.
    expect(await come(BRUNO, 'select 1 from stanze where codice = $1', [codice])).toHaveLength(0);
    await expect(
      comeServer(`select server_registra_mossa(p.id, p.versione, 0::smallint, '{}', '{}', '{}', false) from partite p`),
    ).rejects.toThrow();
    // Anna può tornare all'inizio: la stanza sparisce.
    await come(ANNA, `select esci_dalla_stanza($1)`, [codice]);
    expect((await db.query('select 1 from stanze where codice = $1', [codice])).rows).toHaveLength(0);
  });

  it('i nomi devono avere da 1 a 20 caratteri', async () => {
    await expect(come(CARLA, `select * from crea_stanza('   ')`)).rejects.toThrow();
    await expect(come(CARLA, `select * from crea_stanza($1)`, ['x'.repeat(21)])).rejects.toThrow();
  });
});
