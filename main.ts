// main.ts — program penyerahan entry "Cari Bedanya — Taman Senja" (make.fun).
// Menyalin game/ dan screenshots/ dari repo ini ke direktori output lalu
// menulis dossier.json persis seperti yang ditulis buildDossier dari
// vendor/makefun-game.ts. Hanya memakai pustaka standar Node 22.
import { buildDossier } from "./vendor/makefun-game.ts";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return resolve(fromEnv && fromEnv.length > 0 ? fromEnv : "/output");
}

function freshDir(path: string): void {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

function copyEntryTree(name: "game" | "screenshots", dest: string): void {
  const source = join(repoRoot, name);
  if (!existsSync(source)) throw new Error(`main.ts: folder ${name}/ tidak ada di repo`);
  cpSync(source, join(dest, name), { recursive: true, dereference: true });
}

function requireGameIndex(dest: string): void {
  if (!existsSync(join(dest, "game", "index.html"))) {
    throw new Error("main.ts: game/index.html hilang setelah penyalinan");
  }
}

const out = outputDir();
freshDir(out);
copyEntryTree("game", out);
copyEntryTree("screenshots", out);
requireGameIndex(out);
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(out, "dossier.json"), dossier);
console.log(`main.ts: entry ditulis ke ${out} (${dossier.length} byte dossier.json)`);
