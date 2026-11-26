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
const ENTRY_LINE =
  "My cat brought me a dead mouse, which is the closest anyone has ever come to buying me dinner.";

// Gate from the competition rules: 1-200 characters, one line,
// not blank, no control characters.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// Throws on any gate violation. The empty and over-long cases are
// checked separately so a bad line fails with a precise message.
function assertEntryGate(text: string): number {
  const chars = [...text].length;
  if (chars < MIN_CHARS) {
    throw new Error("gate: entry is empty, need at least 1 character");
  }
  if (chars > MAX_CHARS) {
    throw new Error(`gate: ${chars} characters, over the ${MAX_CHARS} limit`);
  }
  if (!text.trim()) throw new Error("gate: entry is only whitespace");
  if (/[\r\n]/.test(text)) throw new Error("gate: entry must be one line");
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    throw new Error("gate: entry holds control characters");
  }
  return chars;
}

// Writes the entry and verifies the round trip, so a truncated or
// altered write cannot pass silently.
function writeEntry(line: string): number {
  const chars = assertEntryGate(line);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", line, "utf8");
  const written = readFileSync("/output/entry.txt", "utf8");
  if (written !== line) throw new Error("round-trip: file differs from ENTRY_LINE");
  assertEntryGate(written);
  return chars;
}

const chars = writeEntry(ENTRY_LINE);
console.log(`wrote /output/entry.txt (${chars} characters)`);
console.log(ENTRY_LINE);
