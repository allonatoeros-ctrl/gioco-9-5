import { defineConfig } from 'vite';

// Due pagine: index.html = gioco online, prototipo.html = tutti sullo stesso schermo (Fase B).
export default defineConfig({
  build: {
    rollupOptions: {
      input: { online: 'index.html', prototipo: 'prototipo.html' },
    },
  },
});
