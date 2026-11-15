-- =============================================================================
-- Gioco 9,5 online – database (Fase C)
--
-- In breve:
--   stanze           una stanza privata con un codice di 5 caratteri (es. "K7M2Q")
--   giocatori        chi è seduto in una stanza, con il suo posto (0..5)
--   partite          la partita in corso: solo la VISTA PUBBLICA (niente carte coperte)
--   partite_segrete  lo stato completo (mazzo, carte coperte): lo legge solo il server
--   mosse            l'elenco di tutte le mosse fatte, in ordine
--
-- Sicurezza: i telefoni possono solo LEGGERE le stanze in cui sono seduti.
-- Per creare/entrare/uscire usano le funzioni qui sotto; le mosse di gioco passano
-- dal server (Edge Function "gioco"), che usa il motore delle regole.
-- Ogni giocatore è un utente "anonimo" di Supabase: niente email o password,
-- ma lo stesso dispositivo resta riconosciuto e può rientrare se cade la connessione.
-- =============================================================================

-- Schema "privato": funzioni di servizio non raggiungibili dall'esterno.
create schema if not exists privato;
revoke all on schema privato from public;
grant usage on schema privato to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Tabelle
-- -----------------------------------------------------------------------------

create table public.stanze (
  id              uuid primary key default gen_random_uuid(),
  codice          text not null unique check (codice ~ '^[A-HJ-NP-Z2-9]{5}$'),
  host_id         uuid not null references auth.users (id) on delete cascade,
  stato           text not null default 'attesa' check (stato in ('attesa', 'in_corso', 'finita')),
  creata_il       timestamptz not null default now(),
  aggiornata_il   timestamptz not null default now()
);
comment on table public.stanze is 'Stanze private: si entra con il codice. stato: attesa → in_corso → finita.';

create table public.giocatori (
  id               uuid primary key default gen_random_uuid(),
  stanza_id        uuid not null references public.stanze (id) on delete cascade,
  utente_id        uuid not null references auth.users (id) on delete cascade,
  nome             text not null check (char_length(btrim(nome)) between 1 and 20),
  posto            smallint not null check (posto between 0 and 5),
  entrato_il       timestamptz not null default now(),
  ultimo_contatto  timestamptz not null default now(),
  unique (stanza_id, utente_id),
  unique (stanza_id, posto)
);
comment on table public.giocatori is 'Chi è seduto in una stanza. Massimo 6 (decisione O1).';
create index giocatori_utente_idx on public.giocatori (utente_id);

create table public.partite (
  id              uuid primary key default gen_random_uuid(),
  stanza_id       uuid not null unique references public.stanze (id) on delete cascade,
  -- posti[i+1] = posto del giocatore i del motore
  posti           smallint[] not null,
  versione        integer not null default 0,
  vista           jsonb not null,
  finita          boolean not null default false,
  creata_il       timestamptz not null default now(),
  aggiornata_il   timestamptz not null default now()
);
comment on table public.partite is 'Vista pubblica della partita: quello che tutti possono vedere. versione sale di 1 a ogni mossa.';

create table public.partite_segrete (
  partita_id  uuid primary key references public.partite (id) on delete cascade,
  stato       jsonb not null
);
comment on table public.partite_segrete is 'Stato completo (mazzo e carte coperte). Solo il server lo legge.';

create table public.mosse (
  id          bigint generated always as identity primary key,
  partita_id  uuid not null references public.partite (id) on delete cascade,
  numero      integer not null,
  posto       smallint not null,
  azione      jsonb not null,
  fatta_il    timestamptz not null default now(),
  unique (partita_id, numero)
);
comment on table public.mosse is 'Storico delle mosse, in ordine (numero = versione della partita dopo la mossa).';

-- -----------------------------------------------------------------------------
-- Chi può leggere cosa (Row Level Security)
-- -----------------------------------------------------------------------------

create or replace function privato.sono_nella_stanza(p_stanza uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.giocatori g
    where g.stanza_id = p_stanza and g.utente_id = (select auth.uid())
  );
$$;
revoke all on function privato.sono_nella_stanza(uuid) from public;
grant execute on function privato.sono_nella_stanza(uuid) to authenticated;

alter table public.stanze          enable row level security;
alter table public.giocatori       enable row level security;
alter table public.partite         enable row level security;
alter table public.partite_segrete enable row level security;
alter table public.mosse           enable row level security;

create policy "vedo le mie stanze" on public.stanze
  for select to authenticated using (privato.sono_nella_stanza(id));

create policy "vedo chi è nelle mie stanze" on public.giocatori
  for select to authenticated using (privato.sono_nella_stanza(stanza_id));

create policy "vedo le partite delle mie stanze" on public.partite
  for select to authenticated using (privato.sono_nella_stanza(stanza_id));

create policy "vedo le mosse delle mie stanze" on public.mosse
  for select to authenticated using (
    exists (select 1 from public.partite p where p.id = partita_id and privato.sono_nella_stanza(p.stanza_id))
  );

-- partite_segrete: nessuna regola = nessun telefono può leggerla. In più togliamo ogni permesso.
revoke all on public.partite_segrete from anon, authenticated;
-- I telefoni non scrivono mai direttamente nelle tabelle: solo tramite le funzioni.
revoke insert, update, delete, truncate on public.stanze, public.giocatori, public.partite, public.mosse from anon, authenticated;
revoke all on public.stanze, public.giocatori, public.partite, public.mosse from anon;

-- -----------------------------------------------------------------------------
-- Funzioni per i telefoni (stanze)
-- -----------------------------------------------------------------------------

create or replace function privato.nuovo_codice()
returns text
language plpgsql volatile set search_path = ''
as $$
declare
  alfabeto constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- niente I, O, 0, 1: si confondono
  v_codice text;
begin
  loop
    v_codice := '';
    for i in 1..5 loop
      v_codice := v_codice || substr(alfabeto, 1 + floor(random() * 32)::int, 1);
    end loop;
    exit when not exists (select 1 from public.stanze s where s.codice = v_codice);
  end loop;
  return v_codice;
end;
$$;
revoke all on function privato.nuovo_codice() from public;

-- Crea una stanza e ci fa sedere chi la crea (posto 0, è l'"host").
create or replace function public.crea_stanza(p_nome text)
returns table (stanza_id uuid, codice text, posto smallint)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  utente uuid := (select auth.uid());
  nuova public.stanze;
begin
  if utente is null then raise exception 'Accesso richiesto.' using errcode = '28000'; end if;
  insert into public.stanze (codice, host_id) values (privato.nuovo_codice(), utente) returning * into nuova;
  insert into public.giocatori (stanza_id, utente_id, nome, posto) values (nuova.id, utente, btrim(p_nome), 0);
  return query select nuova.id, nuova.codice, 0::smallint;
end;
$$;

-- Entra in una stanza con il codice. Se ci sei già (es. ti era caduta la connessione)
-- ritrovi il tuo posto: è il "rientro".
create or replace function public.entra_in_stanza(p_codice text, p_nome text)
returns table (stanza_id uuid, codice text, posto smallint)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  utente uuid := (select auth.uid());
  s public.stanze;
  mio smallint;
  libero smallint;
begin
  if utente is null then raise exception 'Accesso richiesto.' using errcode = '28000'; end if;
  select * into s from public.stanze st where st.codice = upper(btrim(p_codice)) for update;
  if not found then raise exception 'Nessuna stanza con questo codice.' using errcode = 'P0002'; end if;

  select g.posto into mio from public.giocatori g where g.stanza_id = s.id and g.utente_id = utente;
  if found then
    update public.giocatori g set ultimo_contatto = now()
      where g.stanza_id = s.id and g.utente_id = utente;
    return query select s.id, s.codice, mio;
    return;
  end if;

  if s.stato <> 'attesa' then raise exception 'La partita in questa stanza è già iniziata.' using errcode = 'P0001'; end if;
  select min(n)::smallint into libero
    from generate_series(0, 5) n
    where not exists (select 1 from public.giocatori g where g.stanza_id = s.id and g.posto = n);
  if libero is null then raise exception 'La stanza è piena (massimo 6 giocatori).' using errcode = 'P0001'; end if;

  insert into public.giocatori (stanza_id, utente_id, nome, posto) values (s.id, utente, btrim(p_nome), libero);
  update public.stanze st set aggiornata_il = now() where st.id = s.id;
  return query select s.id, s.codice, libero;
end;
$$;

-- Esce da una stanza ancora in attesa. Se esce l'host, il ruolo passa al primo seduto;
-- se la stanza resta vuota, viene cancellata.
-- Uscire da una partita già iniziata (decisione O8) non è ancora previsto.
create or replace function public.esci_dalla_stanza(p_codice text)
returns void
language plpgsql volatile security definer set search_path = ''
as $$
declare
  utente uuid := (select auth.uid());
  s public.stanze;
  nuovo_host uuid;
begin
  if utente is null then raise exception 'Accesso richiesto.' using errcode = '28000'; end if;
  select * into s from public.stanze st where st.codice = upper(btrim(p_codice)) for update;
  if not found then return; end if;
  if s.stato = 'in_corso' then
    raise exception 'Non si può ancora uscire da una partita in corso.' using errcode = 'P0001';
  end if;
  delete from public.giocatori g where g.stanza_id = s.id and g.utente_id = utente;
  select g.utente_id into nuovo_host from public.giocatori g where g.stanza_id = s.id order by g.posto limit 1;
  if nuovo_host is null then
    delete from public.stanze st where st.id = s.id;
  elsif s.host_id = utente then
    update public.stanze st set host_id = nuovo_host, aggiornata_il = now() where st.id = s.id;
  else
    update public.stanze st set aggiornata_il = now() where st.id = s.id;
  end if;
end;
$$;

-- "Ci sono ancora": il telefono la chiama ogni tanto. Servirà per le disconnessioni (O7).
create or replace function public.segnala_presenza(p_codice text)
returns void
language sql volatile security definer set search_path = ''
as $$
  update public.giocatori g set ultimo_contatto = now()
  from public.stanze s
  where s.codice = upper(btrim(p_codice)) and g.stanza_id = s.id and g.utente_id = (select auth.uid());
$$;

revoke all on function public.crea_stanza(text), public.entra_in_stanza(text, text),
  public.esci_dalla_stanza(text), public.segnala_presenza(text) from public, anon;
grant execute on function public.crea_stanza(text), public.entra_in_stanza(text, text),
  public.esci_dalla_stanza(text), public.segnala_presenza(text) to authenticated;

-- -----------------------------------------------------------------------------
-- Funzioni riservate al server di gioco (Edge Function con chiave di servizio)
-- Ognuna fa tutto in un colpo solo: o riesce tutto o non cambia nulla.
-- -----------------------------------------------------------------------------

create or replace function public.server_avvia_partita(
  p_stanza_id uuid, p_host uuid, p_posti smallint[], p_stato jsonb, p_vista jsonb
)
returns uuid
language plpgsql volatile security definer set search_path = ''
as $$
declare
  s public.stanze;
  nuova uuid;
begin
  select * into s from public.stanze st where st.id = p_stanza_id for update;
  if not found then raise exception 'Stanza inesistente.' using errcode = 'P0002'; end if;
  if s.host_id <> p_host then raise exception 'Solo chi ha creato la stanza può avviare la partita.' using errcode = 'P0001'; end if;
  if s.stato <> 'attesa' then raise exception 'La partita è già iniziata.' using errcode = 'P0001'; end if;
  -- I posti devono essere esattamente quelli seduti adesso (nessuno entrato o uscito nel frattempo).
  if p_posti is distinct from (select array_agg(g.posto order by g.posto) from public.giocatori g where g.stanza_id = s.id) then
    raise exception 'I giocatori sono cambiati: riprova.' using errcode = '40001';
  end if;
  insert into public.partite (stanza_id, posti, vista) values (s.id, p_posti, p_vista) returning id into nuova;
  insert into public.partite_segrete (partita_id, stato) values (nuova, p_stato);
  update public.stanze st set stato = 'in_corso', aggiornata_il = now() where st.id = s.id;
  return nuova;
end;
$$;

-- Salva una mossa solo se nessun altro ha mosso nel frattempo (controllo sulla versione).
create or replace function public.server_registra_mossa(
  p_partita_id uuid, p_versione_attesa integer, p_posto smallint, p_azione jsonb,
  p_stato jsonb, p_vista jsonb, p_finita boolean
)
returns integer
language plpgsql volatile security definer set search_path = ''
as $$
declare
  nuova_versione integer;
  stanza uuid;
begin
  update public.partite p
     set versione = p.versione + 1, vista = p_vista, finita = p_finita, aggiornata_il = now()
   where p.id = p_partita_id and p.versione = p_versione_attesa and not p.finita
  returning p.versione, p.stanza_id into nuova_versione, stanza;
  if not found then
    raise exception 'La partita è cambiata nel frattempo: riprova.' using errcode = '40001';
  end if;
  update public.partite_segrete ps set stato = p_stato where ps.partita_id = p_partita_id;
  insert into public.mosse (partita_id, numero, posto, azione) values (p_partita_id, nuova_versione, p_posto, p_azione);
  update public.giocatori g set ultimo_contatto = now() where g.stanza_id = stanza and g.posto = p_posto;
  update public.stanze st
     set aggiornata_il = now(), stato = case when p_finita then 'finita' else st.stato end
   where st.id = stanza;
  return nuova_versione;
end;
$$;

revoke all on function public.server_avvia_partita(uuid, uuid, smallint[], jsonb, jsonb),
  public.server_registra_mossa(uuid, integer, smallint, jsonb, jsonb, jsonb, boolean)
  from public, anon, authenticated;
grant execute on function public.server_avvia_partita(uuid, uuid, smallint[], jsonb, jsonb),
  public.server_registra_mossa(uuid, integer, smallint, jsonb, jsonb, jsonb, boolean)
  to service_role;

-- -----------------------------------------------------------------------------
-- Tempo reale: i telefoni ricevono un avviso quando cambia stanza, giocatori o partita.
-- (Le regole di lettura qui sopra valgono anche per gli avvisi.)
-- -----------------------------------------------------------------------------
alter publication supabase_realtime add table public.stanze, public.giocatori, public.partite;
