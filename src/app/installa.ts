// Registra il service worker (solo nel sito pubblicato, non mentre si sviluppa):
// serve per aprire l'app installata anche senza internet.
export function registraServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* senza service worker il gioco funziona lo stesso */ });
  });
}
