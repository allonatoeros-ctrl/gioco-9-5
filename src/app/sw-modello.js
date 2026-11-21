// Service worker del gioco 9½ (modello: vite.config.ts inserisce VERSIONE e FILE a ogni build).
//
// Cosa fa, in breve:
// - tiene in memoria la pagina del gioco, i suoi file e le icone, così l'app si apre anche senza internet
//   (e si può giocare contro il computer);
// - la pagina viene sempre chiesta prima a internet, così chi ha la rete vede subito l'ultima versione;
// - NON tocca nulla che non sia del sito: il server online (Supabase) passa sempre diretto.
const VERSIONE = '__VERSIONE__';
const FILE = __FILE__;
const PREFISSO = 'gioco-9-5-';
const CACHE = PREFISSO + VERSIONE;
const PAGINA = '/';
const ATTESA_RETE_MS = 4000;

self.addEventListener('install', (evento) => {
  evento.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(FILE.map((f) => new Request(f, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil((async () => {
    for (const nome of await caches.keys()) {
      if (nome.startsWith(PREFISSO) && nome !== CACHE) await caches.delete(nome);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (evento) => {
  const richiesta = evento.request;
  if (richiesta.method !== 'GET') return;
  const url = new URL(richiesta.url);
  if (url.origin !== self.location.origin) return; // Supabase e tutto il resto: diretti, senza cache.

  if (richiesta.mode === 'navigate') {
    // Solo la pagina del gioco (anche con ?stanza=...); il prototipo resta com'è.
    if (url.pathname !== '/' && url.pathname !== '/index.html') return;
    evento.respondWith(paginaDalVivo(richiesta));
    return;
  }
  evento.respondWith(fileDaCache(richiesta, url));
});

/** La pagina: prima internet (con un limite di attesa), se non c'è quella salvata. */
async function paginaDalVivo(richiesta) {
  const cache = await caches.open(CACHE);
  try {
    const risposta = await conLimite(fetch(richiesta), ATTESA_RETE_MS);
    if (risposta.ok) await cache.put(PAGINA, risposta.clone());
    return risposta;
  } catch {
    const salvata = await cache.match(PAGINA, { ignoreVary: true });
    if (salvata) return salvata;
    return fetch(richiesta);
  }
}

/** Gli altri file del sito: quelli salvati subito, gli altri da internet (e si salvano). */
async function fileDaCache(richiesta, url) {
  const cache = await caches.open(CACHE);
  const salvata = await cache.match(richiesta, { ignoreSearch: url.pathname.startsWith('/assets/'), ignoreVary: true });
  if (salvata) return salvata;
  const risposta = await fetch(richiesta);
  if (risposta.ok && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icone/'))) {
    await cache.put(richiesta, risposta.clone());
  }
  return risposta;
}

function conLimite(promessa, ms) {
  return new Promise((risolvi, rifiuta) => {
    const t = setTimeout(() => rifiuta(new Error('rete lenta')), ms);
    promessa.then((r) => { clearTimeout(t); risolvi(r); }, (e) => { clearTimeout(t); rifiuta(e); });
  });
}
