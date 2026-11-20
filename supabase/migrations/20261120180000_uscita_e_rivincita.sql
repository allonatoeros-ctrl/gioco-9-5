-- =============================================================================
-- Gioco 9,5 online – uscire dalla partita e rigiocare
--
-- 1. esci_dalla_stanza ora funziona SEMPRE, anche a partita in corso.
--    Se qualcuno esce mentre si gioca, la partita viene INTERROTTA per tutti
--    (la stanza diventa "finita"): gli altri vedono chi è uscito e possono
--    rigiocare tra loro o tornare all'inizio. È la regola più semplice finché
--    le decisioni sulle disconnessioni (O5–O8) non sono confermate.
-- 2. ricomincia_stanza: a partita finita (o interrotta) riporta la stanza in
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

revoke all on function public.esci_dalla_stanza(text), public.ricomincia_stanza(text) from public, anon;
grant execute on function public.esci_dalla_stanza(text), public.ricomincia_stanza(text) to authenticated;
