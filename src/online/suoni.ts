// Suoni del gioco, creati al momento dal telefono (niente file da scaricare).
// Si accendono e spengono dal menu ☰; la scelta resta salvata sul telefono.
// I telefoni fanno partire l'audio solo dopo il primo tocco: fino ad allora si sta zitti.

export type Suono = 'carta' | 'moneta' | 'monete' | 'crack' | 'vittoria';

const CHIAVE = 'nove-mezzo:suoni';
let contesto: AudioContext | null = null;
let uscita: GainNode | null = null;
let rumore: AudioBuffer | null = null;
const ultimaVolta = new Map<Suono, number>();

export function suoniAccesi(): boolean {
  try { return localStorage.getItem(CHIAVE) !== 'no'; } catch { return true; }
}

export function impostaSuoni(accesi: boolean) {
  try { localStorage.setItem(CHIAVE, accesi ? 'si' : 'no'); } catch { /* memoria non disponibile */ }
  if (accesi) prepara();
}

/** Crea l'audio al primo tocco dello schermo (prima i telefoni non lo permettono). */
function prepara() {
  if (contesto) { if (contesto.state === 'suspended') void contesto.resume(); return; }
  const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!C) return;
  contesto = new C();
  uscita = contesto.createGain();
  uscita.gain.value = 0.35;
  uscita.connect(contesto.destination);
  // Mezzo secondo di fruscio, riusato per carta e crepa.
  rumore = contesto.createBuffer(1, Math.floor(contesto.sampleRate * 0.5), contesto.sampleRate);
  const d = rumore.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

if (typeof window !== 'undefined') {
  const primoTocco = () => { if (suoniAccesi()) prepara(); };
  window.addEventListener('pointerdown', primoTocco, { passive: true });
  window.addEventListener('keydown', primoTocco);
}

function tono(freq: number, inizio: number, durata: number, volume: number, forma: OscillatorType = 'sine') {
  const c = contesto!; const o = c.createOscillator(); const g = c.createGain();
  o.type = forma; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, inizio);
  g.gain.exponentialRampToValueAtTime(volume, inizio + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, inizio + durata);
  o.connect(g).connect(uscita!);
  o.start(inizio); o.stop(inizio + durata + 0.02);
}

function fruscio(inizio: number, durata: number, volume: number, filtro: BiquadFilterType, freq: number) {
  const c = contesto!; const s = c.createBufferSource(); const f = c.createBiquadFilter(); const g = c.createGain();
  s.buffer = rumore; f.type = filtro; f.frequency.value = freq;
  g.gain.setValueAtTime(volume, inizio);
  g.gain.exponentialRampToValueAtTime(0.0001, inizio + durata);
  s.connect(f).connect(g).connect(uscita!);
  s.start(inizio); s.stop(inizio + durata + 0.02);
}

/** Il "tin" di una moneta: due note alte che svaniscono subito. */
function tin(t: number, volume = 0.5) {
  const base = 1900 + Math.random() * 500;
  tono(base, t, 0.22, volume, 'triangle');
  tono(base * 1.5, t, 0.14, volume * 0.5, 'sine');
}

export function suona(s: Suono) {
  if (!suoniAccesi() || !contesto || !uscita || contesto.state !== 'running') return;
  const ora = performance.now();
  if (ora - (ultimaVolta.get(s) ?? 0) < 80) return; // niente raffiche dello stesso suono
  ultimaVolta.set(s, ora);
  const t = contesto.currentTime + 0.01;
  switch (s) {
    case 'carta': fruscio(t, 0.12, 0.5, 'bandpass', 2600); break;
    case 'moneta': tin(t); break;
    case 'monete': for (let k = 0; k < 12; k++) tin(t + k * 0.09 + Math.random() * 0.05, 0.35); break;
    case 'crack':
      fruscio(t, 0.35, 0.9, 'lowpass', 1400);
      tono(90, t, 0.3, 0.8, 'sine');
      break;
    case 'vittoria': [523, 659, 784, 1047].forEach((f, k) => tono(f, t + k * 0.09, 0.35, 0.35, 'triangle')); break;
  }
}
