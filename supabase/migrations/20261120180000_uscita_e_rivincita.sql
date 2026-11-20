-- =============================================================================
-- Gioco 9,5 online – uscire dalla partita e rigiocare
--
-- 1. esci_dalla_stanza ora funziona SEMPRE, anche a partita in corso.
--    Se qualcuno esce mentre si gioca, la partita viene INTERROTTA per tutti
--    (la stanza diventa "finita"): gli altri vedono chi è uscito e possono
--    rigiocare tra loro o tornare all'inizio. È la regola più semplice finché
--    le decisioni sulle disconnessioni (O5–O8) non sono confermate.
-- 2. entra_in_stanza: a partita iniziata si può RIPRENDERE il proprio posto da un
--    altro browser o telefono scrivendo lo stesso nome, se quel giocatore non è
--    collegato da almeno 30 secondi (es. link aperto in un browser diverso).
-- 3. ricomincia_stanza: a partita finita (o interrotta) riporta la stanza in
--    sala d'attesa con le stesse persone, così chi ha creato la stanza può
--    avviare una nuova partita senza dare un nuovo codice.
-- =============================================================================

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
  delete from public.giocatori g where g.stanza_id = s.id and g.utente_id = utente;
  if not found then return; end if;

  -- Partita in corso: si interrompe per tutti (nessuna mossa sarà più accettata).
  if s.stato = 'in_corso' then
    update public.partite p set finita = true, aggiornata_il = now() where p.stanza_id = s.id;
    s.stato := 'finita';
  end if;

  select g.utente_id into nuovo_host from public.giocatori g where g.stanza_id = s.id order by g.posto limit 1;
  if nuovo_host is null then
    delete from public.stanze st where st.id = s.id;
  else
    update public.stanze st
       set host_id = case when s.host_id = utente then nuovo_host else st.host_id end,
           stato = s.stato,
           aggiornata_il = now()
     where st.id = s.id;
  end if;
end;
$$;

-- Rigioca: solo a partita finita, solo chi è seduto. Cancella la partita vecchia
-- (con le sue mosse) e riporta tutti in sala d'attesa.
create or replace function public.ricomincia_stanza(p_codice text)
returns void
language plpgsql volatile security definer set search_path = ''
as $$
declare
  utente uuid := (select auth.uid());
  s public.stanze;
begin
  if utente is null then raise exception 'Accesso richiesto.' using errcode = '28000'; end if;
  select * into s from public.stanze st where st.codice = upper(btrim(p_codice)) for update;
  if not found or not exists (select 1 from public.giocatori g where g.stanza_id = s.id and g.utente_id = utente) then
    raise exception 'Non sei in questa stanza.' using errcode = 'P0002';
  end if;
  if s.stato = 'attesa' then return; end if; -- qualcun altro ha già premuto "Rigioca"
  if s.stato <> 'finita' then raise exception 'La partita non è ancora finita.' using errcode = 'P0001'; end if;
  delete from public.partite p where p.stanza_id = s.id;
  update public.stanze st set stato = 'attesa', aggiornata_il = now() where st.id = s.id;
end;
$$;

create or replace function public.entra_in_stanza(p_codice text, p_nome text)
returns table (stanza_id uuid, codice text, posto smallint)
language plpgsql volatile security definer set search_path = ''
as $$
declare
  utente uuid := (select auth.uid());
  s public.stanze;
  mio smallint;
  libero smallint;
  vecchio uuid;
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

  if s.stato <> 'attesa' then
    -- Rientro da un altro browser/telefono: stesso nome, posto non collegato da 30 secondi.
    select g.posto, g.utente_id into mio, vecchio from public.giocatori g
      where g.stanza_id = s.id and lower(btrim(g.nome)) = lower(btrim(p_nome))
        and g.ultimo_contatto < now() - interval '30 seconds'
      order by g.posto limit 1;
    if found then
      update public.giocatori g set utente_id = utente, ultimo_contatto = now()
        where g.stanza_id = s.id and g.posto = mio;
      update public.stanze st
         set aggiornata_il = now(),
             host_id = case when st.host_id = vecchio then utente else st.host_id end
       where st.id = s.id;
      return query select s.id, s.codice, mio;
      return;
    end if;
    if exists (select 1 from public.giocatori g where g.stanza_id = s.id and lower(btrim(g.nome)) = lower(btrim(p_nome))) then
      raise exception '% risulta ancora collegato: chiudi il gioco sull''altro telefono o aspetta 30 secondi e riprova.', btrim(p_nome) using errcode = 'P0001';
    end if;
    raise exception 'La partita in questa stanza è già iniziata. Se eri dentro, scrivi lo stesso nome di prima.' using errcode = 'P0001';
  end if;
  select min(n)::smallint into libero
    from generate_series(0, 5) n
    where not exists (select 1 from public.giocatori g where g.stanza_id = s.id and g.posto = n);
  if libero is null then raise exception 'La stanza è piena (massimo 6 giocatori).' using errcode = 'P0001'; end if;

  insert into public.giocatori (stanza_id, utente_id, nome, posto) values (s.id, utente, btrim(p_nome), libero);
  update public.stanze st set aggiornata_il = now() where st.id = s.id;
  return query select s.id, s.codice, libero;
end;
$$;

revoke all on function public.entra_in_stanza(text, text) from public, anon;
grant execute on function public.entra_in_stanza(text, text) to authenticated;

revoke all on function public.esci_dalla_stanza(text), public.ricomincia_stanza(text) from public, anon;
grant execute on function public.esci_dalla_stanza(text), public.ricomincia_stanza(text) to authenticated;
