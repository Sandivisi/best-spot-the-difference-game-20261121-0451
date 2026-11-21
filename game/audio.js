// audio.js — efek suara sintetis lewat WebAudio, tanpa file suara apa pun.
// Semua bunyi dibuat dari osilator, jadi game tetap jalan tanpa network.

let audioContext = null;
let soundOn = true;

export function setSoundOn(on) {
  soundOn = on;
}

export function isSoundOn() {
  return soundOn;
}

function ensureContext() {
  if (!audioContext) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(freq, startAt, duration, type, volume) {
  const ctx = ensureContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

function playIfOn(fn) {
  if (soundOn) fn();
}

export function playFound() {
  playIfOn(() => {
    tone(660, 0, 0.12, "sine", 0.22);
    tone(880, 0.09, 0.16, "sine", 0.22);
    tone(1320, 0.18, 0.2, "triangle", 0.14);
  });
}

export function playWrong() {
  playIfOn(() => {
    tone(180, 0, 0.16, "sawtooth", 0.1);
    tone(140, 0.1, 0.2, "sawtooth", 0.08);
  });
}

export function playHint() {
  playIfOn(() => {
    tone(520, 0, 0.1, "sine", 0.16);
    tone(780, 0.08, 0.14, "sine", 0.16);
  });
}

export function playClick() {
  playIfOn(() => tone(440, 0, 0.06, "square", 0.06));
}

export function playWin() {
  playIfOn(() => {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => tone(n, i * 0.12, 0.3, "triangle", 0.2));
  });
}

export function playLose() {
  playIfOn(() => {
    const notes = [392, 330, 262];
    notes.forEach((n, i) => tone(n, i * 0.16, 0.3, "triangle", 0.16));
  });
}
