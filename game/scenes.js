// scenes.js — tiga scene orisinal "Cari Bedanya", digambar prosedural di kanvas.
// Setiap level punya satu painter: paint(ctx, diffs) menggambar scene dasar,
// lalu menerapkan perbedaan yang id-nya ada di Set `diffs` (panel B).
// Panel A selalu digambar tanpa perbedaan, panel B dengan semuanya.

function circle(ctx, x, y, r, fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}

function skyGradient(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 280);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 560, 280);
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = "rgba(255,244,230,0.95)";
  circle(ctx, x, y, 18 * s, "rgba(255,244,230,0.95)");
  circle(ctx, x + 20 * s, y - 8 * s, 14 * s, "rgba(255,244,230,0.95)");
  circle(ctx, x - 20 * s, y - 4 * s, 13 * s, "rgba(255,244,230,0.95)");
  ellipse(ctx, x, y + 8 * s, 34 * s, 12 * s, "rgba(255,244,230,0.95)");
}

function bird(ctx, x, y, s, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 2.5 * s; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x - 9 * s, y); ctx.quadraticCurveTo(x - 4 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 7 * s, x + 9 * s, y); ctx.stroke();
}

function flower(ctx, x, y, petal) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  circle(ctx, x, y, 5, "#ffd23e");
  ctx.strokeStyle = "#2e7d32"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 26); ctx.stroke();
}

function butterfly(ctx, x, y, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x - 7, y - 4, 8, 6, color);
  ellipse(ctx, x + 7, y - 4, 8, 6, color);
  ellipse(ctx, x - 6, y + 6, 6, 5, color);
  ellipse(ctx, x + 6, y + 6, 6, 5, color);
  ctx.strokeStyle = "#333"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 10); ctx.stroke();
}

// ---------------------------------------------------------------- Level 1: Kebun Senja
function paintGarden(ctx, diffs) {
  skyGradient(ctx, "#ff9e57", "#c86dd7");
  // matahari senja
  circle(ctx, 470, 70, 34, "#ffdf6b");
  circle(ctx, 470, 70, 26, "#ffe98a");
  if (!diffs.has("sun-rays")) {
    ctx.strokeStyle = "#ffdf6b"; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(470 + Math.cos(a) * 42, 70 + Math.sin(a) * 42);
      ctx.lineTo(470 + Math.cos(a) * 54, 70 + Math.sin(a) * 54);
      ctx.stroke();
    }
  }
  // awan
  cloud(ctx, 110, 55, 1);
  if (!diffs.has("cloud")) cloud(ctx, 280, 42, 0.9);
  cloud(ctx, 380, 105, 0.7);
  // burung
  bird(ctx, 200, 95, 1, "#5b3a6e");
  bird(ctx, 245, 72, 0.8, "#5b3a6e");
  // bukit + tanah
  ellipse(ctx, 120, 330, 260, 90, "#7fae5a");
  ellipse(ctx, 460, 340, 280, 100, "#6a9a4e");
  rect(ctx, 0, 300, 560, 120, "#5d8a45");
  // kolam kecil
  ellipse(ctx, 310, 368, 72, 16, "#5db9d6");
  ellipse(ctx, 310, 366, 58, 11, "#8fd4e8");
  // rumah
  rect(ctx, 90, 195, 150, 105, "#ffe0b3");
  poly(ctx, [[78, 198], [165, 138], [252, 198]], "#c65b4e");
  rect(ctx, 150, 245, 36, 55, "#8a5a2b");
  circle(ctx, 180, 272, 3, "#ffd76a");
  rect(ctx, 102, 208, 32, 32, "#fff3c4");
  rect(ctx, 196, 208, 32, 32, diffs.has("window") ? "#4a3566" : "#ffe066");
  ctx.strokeStyle = "#8a5a2b"; ctx.lineWidth = 2;
  ctx.strokeRect(102, 208, 32, 32); ctx.strokeRect(196, 208, 32, 32);
  ctx.beginPath(); ctx.moveTo(118, 208); ctx.lineTo(118, 240); ctx.moveTo(102, 224); ctx.lineTo(134, 224); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(212, 208); ctx.lineTo(212, 240); ctx.moveTo(196, 224); ctx.lineTo(228, 224); ctx.stroke();
  rect(ctx, 216, 158, 16, 34, "#a0522d");
  // pagar
  rect(ctx, 0, 306, 560, 6, "#a9805a");
  rect(ctx, 0, 322, 560, 6, "#a9805a");
  for (let x = 20; x < 560; x += 46) rect(ctx, x, 300, 8, 36, "#c49a6c");
  // pohon apel
  rect(ctx, 428, 212, 18, 92, "#7a4a21");
  circle(ctx, 437, 175, 52, "#3f7d3a");
  circle(ctx, 400, 195, 34, "#4c8f45");
  circle(ctx, 475, 195, 34, "#4c8f45");
  circle(ctx, 437, 155, 30, "#57a04e");
  circle(ctx, 405, 185, 6, "#e74c3c");
  circle(ctx, 460, 165, 6, "#e74c3c");
  circle(ctx, 440, 205, 6, "#e74c3c");
  circle(ctx, 475, 190, 6, "#e74c3c");
  if (!diffs.has("apple")) circle(ctx, 415, 200, 6, "#e74c3c");
  // kucing di pagar
  if (!diffs.has("cat")) {
    ellipse(ctx, 252, 296, 16, 11, "#f2a541");
    circle(ctx, 266, 284, 8, "#f2a541");
    poly(ctx, [[261, 278], [263, 270], [267, 277]], "#f2a541");
    poly(ctx, [[268, 277], [271, 269], [273, 277]], "#f2a541");
    ctx.strokeStyle = "#f2a541"; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(238, 296); ctx.quadraticCurveTo(226, 288, 230, 276); ctx.stroke();
  }
  // kupu-kupu
  if (!diffs.has("butterfly")) butterfly(ctx, 350, 335, "#ff8fd0");
  // bunga-bunga
  flower(ctx, 60, 382, "#ff6b81");
  flower(ctx, 120, 390, "#c58cff");
  flower(ctx, 180, 382, diffs.has("flower") ? "#ffd23e" : "#ff4757");
  flower(ctx, 240, 390, "#ff8fd0");
  flower(ctx, 420, 388, "#ff6b81");
  flower(ctx, 480, 382, "#7ddc7d");
  flower(ctx, 520, 390, "#c58cff");
}

// ---------------------------------------------------------------- Level 2: Pantai Pagi
function paintBeach(ctx, diffs) {
  skyGradient(ctx, "#aee3ff", "#fff3b0");
  circle(ctx, 90, 62, 30, "#fff176");
  circle(ctx, 90, 62, 22, "#fff9a8");
  cloud(ctx, 330, 55, 1);
  cloud(ctx, 470, 90, 0.8);
  bird(ctx, 200, 80, 1, "#3a6b8a");
  bird(ctx, 262, 58, 0.9, "#3a6b8a");
  if (!diffs.has("gull")) bird(ctx, 322, 88, 0.9, "#3a6b8a");
  // laut
  rect(ctx, 0, 150, 560, 100, "#2f9fd8");
  ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 3; ctx.lineCap = "round";
  for (const [x, y, w] of [[60, 180, 70], [200, 200, 90], [360, 175, 60], [450, 215, 80], [120, 225, 60]]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + w / 2, y - 8, x + w, y); ctx.stroke();
  }
  // perahu
  if (!diffs.has("boat")) {
    poly(ctx, [[372, 182], [428, 182], [414, 200], [386, 200]], "#b5651d");
    poly(ctx, [[398, 180], [398, 138], [424, 180]], "#ffffff");
    ctx.strokeStyle = "#8a5a2b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(398, 138); ctx.lineTo(398, 182); ctx.stroke();
  }
  // pasir
  rect(ctx, 0, 250, 560, 170, "#f7dc9a");
  ellipse(ctx, 280, 252, 560, 14, "#ffe9b8");
  // pohon palem
  ctx.strokeStyle = "#8a5a2b"; ctx.lineWidth = 14; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(478, 300); ctx.quadraticCurveTo(470, 240, 452, 200); ctx.stroke();
  ctx.strokeStyle = "#2e9e4f"; ctx.lineWidth = 8;
  for (const [dx, dy] of [[-38, -14], [-28, -34], [0, -40], [30, -30], [40, -8]]) {
    ctx.beginPath(); ctx.moveTo(452, 200);
    ctx.quadraticCurveTo(452 + dx * 0.7, 200 + dy * 0.7, 452 + dx, 200 + dy); ctx.stroke();
  }
  circle(ctx, 446, 208, 7, "#7a4a21");
  circle(ctx, 460, 212, 7, "#7a4a21");
  if (!diffs.has("coconut")) circle(ctx, 436, 220, 7, "#7a4a21");
  // payung pantai
  ctx.strokeStyle = "#8a5a2b"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(150, 300); ctx.lineTo(150, 380); ctx.stroke();
  const umbrellaColor = diffs.has("umbrella") ? "#3f8cff" : "#ff4757";
  ctx.beginPath(); ctx.moveTo(150, 252); ctx.arc(150, 300, 52, Math.PI, 0); ctx.closePath();
  ctx.fillStyle = umbrellaColor; ctx.fill();
  ctx.beginPath(); ctx.moveTo(150, 252); ctx.arc(150, 300, 52, Math.PI, Math.PI * 1.5); ctx.closePath();
  ctx.fillStyle = "#ffffff"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(150, 252); ctx.arc(150, 300, 52, Math.PI * 1.5, Math.PI * 2); ctx.closePath();
  ctx.fillStyle = umbrellaColor; ctx.fill();
  // bola pantai
  circle(ctx, 262, 352, 22, "#ffffff");
  ctx.beginPath(); ctx.moveTo(262, 330); ctx.lineTo(262, 374); ctx.strokeStyle = diffs.has("ball") ? "#2ecc71" : "#ffd23e"; ctx.lineWidth = 9; ctx.stroke();
  ctx.beginPath(); ctx.arc(262, 352, 22, 0.4, 1.8); ctx.strokeStyle = "#ff4757"; ctx.lineWidth = 9; ctx.stroke();
  circle(ctx, 262, 352, 6, "#ffffff");
  // ember
  poly(ctx, [[326, 344], [354, 344], [350, 372], [330, 372]], diffs.has("bucket") ? "#e74c3c" : "#3f8cff");
  rect(ctx, 324, 340, 32, 6, diffs.has("bucket") ? "#c0392b" : "#2f6fd8");
  // bintang laut
  if (!diffs.has("starfish")) {
    ctx.fillStyle = "#ff8c42";
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const a2 = a + Math.PI / 5;
      ctx.lineTo(432 + Math.cos(a) * 16, 382 + Math.sin(a) * 16);
      ctx.lineTo(432 + Math.cos(a2) * 7, 382 + Math.sin(a2) * 7);
    }
    ctx.closePath(); ctx.fill();
    circle(ctx, 432, 382, 3, "#e76f1f");
  }
  // kepiting
  if (!diffs.has("crab")) {
    ellipse(ctx, 100, 382, 16, 11, "#ff6b4a");
    circle(ctx, 88, 372, 4, "#ff6b4a");
    circle(ctx, 112, 372, 4, "#ff6b4a");
    ctx.strokeStyle = "#ff6b4a"; ctx.lineWidth = 3;
    for (const dy of [-4, 0, 4]) {
      ctx.beginPath(); ctx.moveTo(86, 384 + dy); ctx.lineTo(74, 388 + dy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(114, 384 + dy); ctx.lineTo(126, 388 + dy); ctx.stroke();
    }
  }
  // kerang
  ellipse(ctx, 500, 395, 12, 8, "#ffb3d9");
  ellipse(ctx, 210, 398, 10, 7, "#c58cff");
}

// ---------------------------------------------------------------- Level 3: Hutan Hujan
function paintForest(ctx, diffs) {
  skyGradient(ctx, "#1d5c33", "#8fce6e");
  // sinar matahari menembus dedaunan
  ctx.fillStyle = "rgba(255,244,180,0.16)";
  poly(ctx, [[180, 0], [230, 0], [330, 420], [250, 420]], "rgba(255,244,180,0.16)");
  poly(ctx, [[380, 0], [410, 0], [480, 420], [430, 420]], "rgba(255,244,180,0.10)");
  // pohon besar kiri & kanan
  rect(ctx, 30, 120, 34, 300, "#6b4423");
  circle(ctx, 48, 105, 72, "#2e7d32");
  circle(ctx, 0, 150, 60, "#388e3c");
  circle(ctx, 100, 140, 52, "#43a047");
  rect(ctx, 500, 100, 36, 320, "#5d3a1a");
  circle(ctx, 518, 88, 76, "#2e7d32");
  circle(ctx, 470, 130, 54, "#388e3c");
  // sulur
  ctx.strokeStyle = "#2e7d32"; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(150, 0); ctx.quadraticCurveTo(140, 90, 160, 170); ctx.stroke();
  if (!diffs.has("vine")) {
    ctx.beginPath(); ctx.moveTo(92, 0); ctx.quadraticCurveTo(82, 100, 100, 190); ctx.stroke();
    circle(ctx, 100, 195, 10, "#43a047");
  }
  // sungai
  poly(ctx, [[0, 420], [560, 420], [560, 360], [300, 330], [0, 350]], "#4db2d8");
  ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(120, 385); ctx.quadraticCurveTo(200, 378, 280, 388); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(340, 400); ctx.quadraticCurveTo(420, 392, 500, 402); ctx.stroke();
  // batang tumbang
  if (!diffs.has("log")) {
    rect(ctx, 360, 352, 90, 16, "#8a5a2b");
    circle(ctx, 450, 360, 8, "#a9805a");
    circle(ctx, 360, 360, 8, "#6b4423");
  }
  // jamur
  function mushroom(x, y, s, cap) {
    rect(ctx, x - 4 * s, y, 8 * s, 12 * s, "#fff3e0");
    ctx.beginPath(); ctx.arc(x, y, 14 * s, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = cap; ctx.fill();
    circle(ctx, x - 5 * s, y - 6 * s, 2.5 * s, "#ffffff");
    circle(ctx, x + 4 * s, y - 9 * s, 2 * s, "#ffffff");
  }
  mushroom(120, 372, 1, "#e74c3c");
  if (!diffs.has("mushroom")) mushroom(152, 368, 0.8, "#ff8c42");
  mushroom(96, 376, 0.7, "#e74c3c");
  // katak di batu
  ellipse(ctx, 282, 356, 34, 12, "#9a9a9a");
  if (!diffs.has("frog")) {
    ellipse(ctx, 280, 344, 16, 11, "#4caf50");
    circle(ctx, 272, 334, 6, "#4caf50");
    circle(ctx, 288, 334, 6, "#4caf50");
    circle(ctx, 271, 332, 2.5, "#ffffff");
    circle(ctx, 289, 332, 2.5, "#ffffff");
    circle(ctx, 271, 332, 1.2, "#222222");
    circle(ctx, 289, 332, 1.2, "#222222");
  }
  // burung beo di dahan
  ctx.strokeStyle = "#6b4423"; ctx.lineWidth = 9; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(390, 170); ctx.quadraticCurveTo(430, 158, 470, 166); ctx.stroke();
  const parrot = diffs.has("parrot") ? "#3f8cff" : "#e74c3c";
  ellipse(ctx, 432, 146, 15, 20, parrot);
  circle(ctx, 432, 122, 11, parrot);
  poly(ctx, [[440, 118], [452, 122], [440, 128]], "#ff9f1a");
  circle(ctx, 428, 119, 2, "#222222");
  ellipse(ctx, 424, 158, 5, 14, "#2e7d32");
  ellipse(ctx, 442, 158, 5, 14, "#2e7d32");
  // kupu-kupu
  if (!diffs.has("butterfly")) butterfly(ctx, 300, 200, "#ffd23e");
  // bunga hutan
  flower(ctx, 200, 382, diffs.has("flower") ? "#ffffff" : "#ff8fd0");
  flower(ctx, 352, 392, "#ff9f1a");
  flower(ctx, 500, 386, "#c58cff");
  // daun besar
  ellipse(ctx, 482, 302, 26, 12, diffs.has("leaf") ? "#ffd23e" : "#2e9e4f");
  ctx.strokeStyle = "#1b5e20"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(458, 302); ctx.lineTo(506, 302); ctx.stroke();
  // kunang-kunang
  const flies = diffs.has("firefly")
    ? [[350, 120], [368, 132], [332, 140]]
    : [[350, 120], [368, 132], [332, 140], [386, 110], [318, 118]];
  for (const [x, y] of flies) {
    circle(ctx, x, y, 7, "rgba(255,241,118,0.35)");
    circle(ctx, x, y, 3, "#fff176");
  }
}

export const LEVELS = [
  {
    id: "kebun-senja",
    name: "Kebun Senja",
    subtitle: "Rumah, pohon apel, dan seekor kucing di pagar.",
    timeLimit: 120,
    paint: paintGarden,
    differences: [
      { id: "sun-rays", label: "Sinar matahari", x: 470, y: 70, r: 44 },
      { id: "cloud", label: "Awan kecil", x: 280, y: 42, r: 34 },
      { id: "apple", label: "Apel kelima", x: 415, y: 200, r: 16 },
      { id: "flower", label: "Warna bunga", x: 180, y: 382, r: 17 },
      { id: "window", label: "Jendela menyala", x: 212, y: 224, r: 22 },
      { id: "cat", label: "Kucing di pagar", x: 252, y: 290, r: 26 },
      { id: "butterfly", label: "Kupu-kupu", x: 350, y: 335, r: 18 },
    ],
  },
  {
    id: "pantai-pagi",
    name: "Pantai Pagi",
    subtitle: "Perahu, palem, dan payung di tepi laut.",
    timeLimit: 120,
    paint: paintBeach,
    differences: [
      { id: "boat", label: "Perahu layar", x: 400, y: 178, r: 30 },
      { id: "coconut", label: "Kelapa ketiga", x: 436, y: 220, r: 14 },
      { id: "umbrella", label: "Warna payung", x: 150, y: 282, r: 30 },
      { id: "ball", label: "Garis bola pantai", x: 262, y: 352, r: 22 },
      { id: "starfish", label: "Bintang laut", x: 432, y: 382, r: 18 },
      { id: "gull", label: "Burung camar ketiga", x: 322, y: 88, r: 16 },
      { id: "crab", label: "Kepiting", x: 100, y: 382, r: 18 },
      { id: "bucket", label: "Warna ember", x: 340, y: 356, r: 20 },
    ],
  },
  {
    id: "hutan-hujan",
    name: "Hutan Hujan",
    subtitle: "Beo, katak, dan kunang-kunang di sungai.",
    timeLimit: 150,
    paint: paintForest,
    differences: [
      { id: "parrot", label: "Warna burung beo", x: 432, y: 140, r: 26 },
      { id: "frog", label: "Katak di batu", x: 280, y: 342, r: 20 },
      { id: "mushroom", label: "Jamur oranye", x: 152, y: 368, r: 16 },
      { id: "flower", label: "Warna bunga hutan", x: 200, y: 382, r: 16 },
      { id: "vine", label: "Sulur menjuntai", x: 96, y: 150, r: 22 },
      { id: "firefly", label: "Kunang-kunang", x: 352, y: 122, r: 20 },
      { id: "butterfly", label: "Kupu-kupu kuning", x: 300, y: 200, r: 16 },
      { id: "leaf", label: "Warna daun besar", x: 482, y: 302, r: 20 },
      { id: "log", label: "Batang tumbang", x: 405, y: 360, r: 24 },
    ],
  },
];
