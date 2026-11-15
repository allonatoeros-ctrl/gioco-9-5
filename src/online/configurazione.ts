// Dove si trova il server online. Questi due valori sono PUBBLICI per natura
// (finiscono comunque nel sito): la sicurezza la fanno le regole del database.
// Si possono cambiare con le variabili VITE_SUPABASE_URL e VITE_SUPABASE_CHIAVE_PUBBLICA.
const ambiente = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ?? {};

export const CONFIGURAZIONE = {
  url: ambiente.VITE_SUPABASE_URL ?? 'https://jgmzwuglstnygobochqu.supabase.co',
  chiavePubblica: ambiente.VITE_SUPABASE_CHIAVE_PUBBLICA ?? 'sb_publishable_gqQP9GrmIkviMvtWWjVxQg_R0YFamjW',
};
