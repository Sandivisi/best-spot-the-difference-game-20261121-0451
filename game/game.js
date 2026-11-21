// game.js — logika utama "Cari Bedanya — Taman Senja".
// Mengatur level, klik pada dua panel, timer, petunjuk, skor, dan layar menang/kalah.
import { LEVELS } from "./scenes.js";
import * as sfx from "./audio.js";

const canvasLeft = document.getElementById("canvas-left");
const canvasRight = document.getElementById("canvas-right");
const ctxLeft = canvasLeft.getContext("2d");
const ctxRight = canvasRight.getContext("2d");

const hudLevel = document.getElementById("hud-level");
const hudFound = document.getElementById("hud-found");
const hudLeft = document.getElementById("hud-left");
const hudTime = document.getElementById("hud-time");
const hudScore = document.getElementById("hud-score");
const messageEl = document.getElementById("message");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const overlayStats = document.getElementById("overlay-stats");
const btnAgain = document.getElementById("btn-again");
const btnNext = document.getElementById("btn-next");
const btnHint = document.getElementById("btn-hint");
const btnRestart = document.getElementById("btn-restart");
const btnSound = document.getElementById("btn-sound");
const hintCountEl = document.getElementById("hint-count");
const levelButtons = Array.from(document.querySelectorAll(".level-btn"));

const HINTS_PER_LEVEL = 3;
const WRONG_CLICK_PENALTY = 3; // detik
const HINT_COST = 10; // detik

const state = {
  levelIndex: 0,
  found: new Set(),
  hintsLeft: HINTS_PER_LEVEL,
  score: 0,
  timeLeft: 0,
  phase: "playing", // playing | won | lost
  wrongMarks: [], // {x, y, until}
  hintPulse: null, // {diffId, until}
  startedAt: 0,
  lastTick: 0,
};

function level() {
  return LEVELS[state.levelIndex];
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}

function updateHud() {
  const lv = level();
  hudLevel.textContent = "Level " + (state.levelIndex + 1) + "/" + LEVELS.length;
  hudFound.textContent = "Ditemukan " + state.found.size + "/" + lv.differences.length;
  hudLeft.textContent = "Sisa " + (lv.differences.length - state.found.size);
  hudTime.textContent = formatTime(state.timeLeft);
  hudScore.textContent = "Skor " + state.score;
  hudFound.classList.toggle("done", state.found.size === lv.differences.length);
  hudTime.classList.toggle("low", state.timeLeft <= 15 && state.phase === "playing");
  hintCountEl.textContent = "(" + state.hintsLeft + ")";
  btnHint.disabled = state.hintsLeft <= 0 || state.phase !== "playing";
  levelButtons.forEach((b, i) => b.classList.toggle("active", i === state.levelIndex));
}

function setMessage(text) {
  messageEl.textContent = text;
}

function drawMarkers(ctx, now) {
  const lv = level();
  for (const diff of lv.differences) {
    if (!state.found.has(diff.id)) continue;
    ctx.strokeStyle = "#ffd23e";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(diff.x, diff.y, diff.r + 4, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(diff.x, diff.y, diff.r + 8, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#ffd23e";
    ctx.font = "bold 15px Trebuchet MS, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("✓", diff.x, diff.y - diff.r - 16);
  }
  for (const mark of state.wrongMarks) {
    if (now > mark.until) continue;
    ctx.strokeStyle = "#ff4757";
    ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(mark.x - 9, mark.y - 9); ctx.lineTo(mark.x + 9, mark.y + 9);
    ctx.moveTo(mark.x + 9, mark.y - 9); ctx.lineTo(mark.x - 9, mark.y + 9);
    ctx.stroke();
  }
  if (state.hintPulse && now < state.hintPulse.until) {
    const diff = lv.differences.find((d) => d.id === state.hintPulse.diffId);
    if (diff) {
      const pulse = 1 + 0.18 * Math.sin(now / 130);
      ctx.strokeStyle = "#7ddcff";
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(diff.x, diff.y, (diff.r + 8) * pulse, 0, Math.PI * 2); ctx.stroke();
    }
  }
}

function render(now) {
  const lv = level();
  const allIds = new Set(lv.differences.map((d) => d.id));
  lv.paint(ctxLeft, new Set());
  lv.paint(ctxRight, allIds);
  drawMarkers(ctxLeft, now);
  drawMarkers(ctxRight, now);
}

function tick(now) {
  if (state.phase === "playing") {
    const dt = (now - state.lastTick) / 1000;
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      return loseGame();
    }
  }
  state.lastTick = now;
  state.wrongMarks = state.wrongMarks.filter((m) => now < m.until);
  render(now);
  updateHud();
  requestAnimationFrame(tick);
}

function startLevel(index) {
  state.levelIndex = index;
  state.found = new Set();
  state.hintsLeft = HINTS_PER_LEVEL;
  state.timeLeft = level().timeLimit;
  state.phase = "playing";
  state.wrongMarks = [];
  state.hintPulse = null;
  state.startedAt = performance.now();
  state.lastTick = performance.now();
  overlay.classList.add("hidden");
  setMessage("Level " + (index + 1) + ": " + level().name + " — " + level().subtitle);
  updateHud();
}

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function handleClick(event) {
  if (state.phase !== "playing") return;
  const point = canvasPoint(event.currentTarget, event);
  const lv = level();
  const hit = lv.differences.find(
    (d) => !state.found.has(d.id) && Math.hypot(point.x - d.x, point.y - d.y) <= d.r + 8
  );
  if (hit) {
    state.found.add(hit.id);
    state.score += 100;
    sfx.playFound();
    if (state.found.size === lv.differences.length) {
      setMessage("Ketemu! " + hit.label + " — semua perbedaan ditemukan!");
      return winGame();
    }
    setMessage("Ketemu! " + hit.label + " (" + state.found.size + "/" + lv.differences.length + ")");
  } else {
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_PENALTY);
    state.wrongMarks.push({ x: point.x, y: point.y, until: performance.now() + 700 });
    sfx.playWrong();
    setMessage("Bukan di situ… −" + WRONG_CLICK_PENALTY + " detik. Perhatikan baik-baik!");
    event.currentTarget.classList.remove("shake");
    void event.currentTarget.offsetWidth;
    event.currentTarget.classList.add("shake");
  }
  updateHud();
}

function useHint() {
  if (state.phase !== "playing" || state.hintsLeft <= 0) return;
  const lv = level();
  const remaining = lv.differences.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.timeLeft = Math.max(0, state.timeLeft - HINT_COST);
  state.hintPulse = { diffId: pick.id, until: performance.now() + 3000 };
  sfx.playHint();
  setMessage("Petunjuk: ada perbedaan di sekitar lingkaran biru itu! (−" + HINT_COST + " detik)");
  updateHud();
}

function winGame() {
  state.phase = "won";
  const timeBonus = Math.round(state.timeLeft) * 5;
  const hintBonus = state.hintsLeft * 25;
  state.score += timeBonus + hintBonus;
  sfx.playWin();
  const lv = level();
  overlayTitle.textContent = "Hebat! Semua Ketemu 🎉";
  overlayText.textContent =
    "Kamu menemukan semua " + lv.differences.length + " perbedaan di " + lv.name + ".";
  overlayStats.textContent =
    "Bonus waktu +" + timeBonus + " · Bonus petunjuk +" + hintBonus + " · Skor " + state.score;
  btnNext.textContent =
    state.levelIndex + 1 < LEVELS.length ? "Level Berikutnya →" : "Main dari Awal ↻";
  overlay.classList.remove("hidden");
  updateHud();
}

function loseGame() {
  state.phase = "lost";
  sfx.playLose();
  const lv = level();
  overlayTitle.textContent = "Waktu Habis ⏰";
  overlayText.textContent =
    "Kamu menemukan " + state.found.size + " dari " + lv.differences.length +
    " perbedaan di " + lv.name + ". Coba lagi, pasti bisa!";
  overlayStats.textContent = "Skor " + state.score;
  btnNext.textContent = "Coba Lagi";
  overlay.classList.remove("hidden");
  updateHud();
}

function nextStep() {
  if (state.phase === "won" && state.levelIndex + 1 < LEVELS.length) {
    startLevel(state.levelIndex + 1);
  } else {
    startLevel(state.phase === "won" ? 0 : state.levelIndex);
  }
}

canvasLeft.addEventListener("click", handleClick);
canvasRight.addEventListener("click", handleClick);
btnHint.addEventListener("click", () => { sfx.playClick(); useHint(); });
btnRestart.addEventListener("click", () => { sfx.playClick(); startLevel(state.levelIndex); });
btnSound.addEventListener("click", () => {
  sfx.setSoundOn(!sfx.isSoundOn());
  btnSound.textContent = sfx.isSoundOn() ? "🔊 Suara: Nyala" : "🔇 Suara: Mati";
  btnSound.setAttribute("aria-pressed", String(sfx.isSoundOn()));
});
btnAgain.addEventListener("click", () => { sfx.playClick(); startLevel(state.levelIndex); });
btnNext.addEventListener("click", () => { sfx.playClick(); nextStep(); });
levelButtons.forEach((b) =>
  b.addEventListener("click", () => { sfx.playClick(); startLevel(Number(b.dataset.level)); })
);

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "h") useHint();
  else if (key === "r") startLevel(state.levelIndex);
  else if (key === "1" || key === "2" || key === "3") startLevel(Number(key) - 1);
  else if (key === "enter" && state.phase !== "playing") nextStep();
});

// Dipakai playtest otomatis: membaca status game dari luar.
window.__cariBedanya = {
  state,
  level,
  startLevel,
  useHint,
};

startLevel(0);
requestAnimationFrame(tick);
