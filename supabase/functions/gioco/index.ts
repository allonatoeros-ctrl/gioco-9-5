// Edge Function "gioco": il server autoritativo del 9,5 online.
//
// I telefoni le chiedono due cose:
//   { comando: "avvia", codice, obiettivoPunti? }    l'host avvia la partita
//   { comando: "mossa", codice, versione, azione }    il giocatore fa una mossa
//
// Il server riconosce chi chiede (dal suo accesso Supabase), carica lo stato segreto,
// fa decidere al motore delle regole, e salva tutto in un colpo solo.
// Le regole NON sono qui: stanno nel motore, impacchettato in ./logica.js
// (si rigenera con `npm run prepara-server`).

import { createClient } from 'npm:@supabase/supabase-js@2';
import { ErroreAzione, avviaPartita, eseguiMossa } from './logica.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function risposta(stato: number, corpo: unknown) {
  return new Response(JSON.stringify(corpo), { status: stato, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

function chiaveServizio(): string {
  const nuove = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (nuove) {
    try {
      const k = JSON.parse(nuove)['default'];
      if (k) return k;
    } catch { /* si usa la chiave classica */ }
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
}

const admin = createClient(Deno.env.get('SUPABASE_URL')!, chiaveServizio(), {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Errore "previsto" da mostrare al giocatore così com'è. */
class ErroreGioco extends Error {
  constructor(public stato: number, messaggio: string) { super(messaggio); }
}

function controlla<T>(r: { data: T; error: { message: string; code?: string } | null }): T {
  if (r.error) {
    // 40001 = qualcun altro ha mosso nel frattempo; P0001/P0002 = messaggi scritti da noi nel database.
    if (r.error.code === '40001') throw new ErroreGioco(409, r.error.message);
    if (r.error.code === 'P0001' || r.error.code === 'P0002') throw new ErroreGioco(400, r.error.message);
    throw new Error(r.error.message);
  }
  return r.data;
}

async function caricaStanza(codice: unknown) {
  if (typeof codice !== 'string') throw new ErroreGioco(400, 'Codice stanza mancante.');
  const stanza = controlla(
    await admin.from('stanze').select('id, host_id, stato').eq('codice', codice.trim().toUpperCase()).maybeSingle(),
  );
  if (!stanza) throw new ErroreGioco(404, 'Nessuna stanza con questo codice.');
  return stanza as { id: string; host_id: string; stato: string };
}

async function avvia(utente: string, corpo: Record<string, unknown>) {
  const stanza = await caricaStanza(corpo.codice);
  if (stanza.host_id !== utente) throw new ErroreGioco(403, 'Solo chi ha creato la stanza può avviare la partita.');
  if (stanza.stato !== 'attesa') throw new ErroreGioco(400, 'La partita è già iniziata.');
  const seduti = controlla(
    await admin.from('giocatori').select('posto, nome').eq('stanza_id', stanza.id).order('posto'),
  ) as { posto: number; nome: string }[];
  const obiettivo = corpo.obiettivoPunti == null ? null : Number(corpo.obiettivoPunti);
  const { stato, vista } = avviaPartita(seduti.map((g) => g.nome), obiettivo);
  const partitaId = controlla(
    await admin.rpc('server_avvia_partita', {
      p_stanza_id: stanza.id,
      p_host: utente,
      p_posti: seduti.map((g) => g.posto),
      p_stato: stato,
      p_vista: vista,
    }),
  );
  return { partitaId, versione: 0, vista };
}

async function mossa(utente: string, corpo: Record<string, unknown>) {
  const stanza = await caricaStanza(corpo.codice);
  if (stanza.stato !== 'in_corso') throw new ErroreGioco(400, 'Nessuna partita in corso in questa stanza.');
  const io = controlla(
    await admin.from('giocatori').select('posto').eq('stanza_id', stanza.id).eq('utente_id', utente).maybeSingle(),
  ) as { posto: number } | null;
  if (!io) throw new ErroreGioco(403, 'Non sei seduto in questa stanza.');
  const partita = controlla(
    await admin.from('partite').select('id, posti, versione, partite_segrete(stato)').eq('stanza_id', stanza.id).single(),
  ) as { id: string; posti: number[]; versione: number; partite_segrete: { stato: unknown } | null };
  if (typeof corpo.versione === 'number' && corpo.versione !== partita.versione) {
    throw new ErroreGioco(409, 'La partita è andata avanti: aggiorna e riprova.');
  }
  const giocatore = partita.posti.indexOf(io.posto);
  // deno-lint-ignore no-explicit-any
  const risultato = eseguiMossa(partita.partite_segrete!.stato as any, giocatore, corpo.azione);
  const versione = controlla(
    await admin.rpc('server_registra_mossa', {
      p_partita_id: partita.id,
      p_versione_attesa: partita.versione,
      p_posto: io.posto,
      p_azione: risultato.azione,
      p_stato: risultato.stato,
      p_vista: risultato.vista,
      p_finita: risultato.finita,
    }),
  );
  return { versione, vista: risultato.vista };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return risposta(405, { errore: 'Usa POST.' });
  try {
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const { data, error } = token ? await admin.auth.getUser(token) : { data: { user: null }, error: null };
    if (error || !data.user) return risposta(401, { errore: 'Accesso richiesto.' });
    const corpo = await req.json().catch(() => ({}));
    if (corpo.comando === 'avvia') return risposta(200, await avvia(data.user.id, corpo));
    if (corpo.comando === 'mossa') return risposta(200, await mossa(data.user.id, corpo));
    return risposta(400, { errore: 'Comando sconosciuto.' });
  } catch (e) {
    if (e instanceof ErroreGioco) return risposta(e.stato, { errore: e.message });
    if (e instanceof ErroreAzione) return risposta(400, { errore: e.message });
    console.error(e);
    return risposta(500, { errore: 'Errore del server.' });
  }
});
