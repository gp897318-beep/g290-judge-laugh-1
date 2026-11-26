// Make the Judge Laugh in One Line — make.fun entry.
// Writes one funny line to /output/entry.txt, after checking it against
// the competition gate (1-200 characters, one line, UTF-8, not only
// whitespace). No trailing newline: the file holds exactly the line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The winner of 10 compared variants (see judge-laugh-variants.md):
// the cat's "gift" of a dead mouse reframes as the closest anyone has
// ever come to buying me dinner. A concrete, universal image; the
// punchline is the final clause, so the laugh lands at the END; no
// stock pun, no meta-joke, nothing that needs explaining.
const LINE =
  "My cat brought me a dead mouse, which is the closest anyone has ever come to buying me dinner.";

// Gate from the competition rules: 1-200 characters, one line,
// not blank, no control characters.
const MAX_CHARS = 200;
function checkGate(text: string): number {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`gate: ${chars} characters, need 1-${MAX_CHARS}`);
  }
  if (!text.trim()) throw new Error("gate: entry is only whitespace");
  if (/[\r\n]/.test(text)) throw new Error("gate: entry must be one line");
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    throw new Error("gate: entry holds control characters");
  }
  return chars;
}

const chars = checkGate(LINE);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
// Round-trip check: read the file back and re-run the gate on what was
// actually written, so a truncated or altered write cannot pass silently.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) throw new Error("round-trip: file differs from LINE");
checkGate(written);
console.log(`wrote /output/entry.txt (${chars} characters)`);
console.log(LINE);
