// Friday Finder — the program that hands the deal finder in.
//
// The site is plain static files under app/ (index.html, style.css, the
// JavaScript modules and the deal data), with no build step and nothing
// loaded over the network at run time. This program copies app/ and
// screenshots/ from beside this file into /output (or MAKEFUN_OUTPUT_DIR
// outside the grader) and writes /output/dossier.json with the kit's
// vendored library, so the sealed scorer can check the hand-in against
// the same dossier it builds itself. vendor/makefun-frontend.ts is the
// kit's copy, unchanged.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// It runs twice in the grader and must write the same bytes both times:
// it copies files and writes the dossier deterministically, with no
// timestamps, random values or network calls of its own.

import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps (from the kit): at most 4 screenshots, each at
// most 256 KiB; app/ at most 993 files and directories and 16 MiB;
// dossier text at most 160 KiB. The dossier is byte for byte what the
// scorer's own copy of the library writes from the same files.
const dossierPath = join(out, "dossier.json");
writeFileSync(
  dossierPath,
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// A short human-readable summary on stdout only; nothing here touches
// /output, so the two grader runs still write identical bytes.
const dossier = JSON.parse(readFileSync(dossierPath, "utf8"));
const shots = dossier.images ?? [];
console.log(
  `Friday Finder handed in: ${shots.length} screenshot(s), dossier ${statSync(dossierPath).size} bytes -> ${out}`,
);
