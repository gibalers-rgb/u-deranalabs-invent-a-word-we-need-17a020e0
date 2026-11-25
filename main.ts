import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// pocketpat — an entry for make.fun "Invent a Word We Need".
//
// The competition asks for one newly coined English word plus a one-line
// definition (at most 140 characters), written to /output/entry.txt.
// This program builds that single line from its two parts, checks it
// against the gate rules, and writes it out. Standard library only,
// no network, deterministic: the same line every run.

// The coined word. A compound of "pocket" + "pat", formed the way
// English grows words like "fingerprint" or "backpack". It names the
// gesture everyone makes before leaving the house — and which no
// dictionary word names yet. Verified novel as a single word: searches
// turn up only "pocket part" (a legal-book supplement, unrelated) and
// the two-word phrase "pocket pat" in blogs, never "pocketpat" itself.
const WORD = "pocketpat";

// The definition. One line, self-contained: the action, what it
// confirms, and the three items everyone checks — phone, keys, wallet.
// No example sentence needed; the meaning lands in a single reading.
const DEFINITION =
  "the quick pat of your pockets to confirm your phone, keys and wallet are still there";

// Gate limits from RULES.txt: /output/entry.txt must be UTF-8 text of
// 1 to 140 characters, not only white space.
const MIN_LENGTH = 1;
const MAX_LENGTH = 140;

function buildEntry(word: string, definition: string): string {
  // Dictionary style: headword, em dash, definition. One line only.
  return `${word} — ${definition}`;
}

function validateEntry(text: string): string[] {
  const problems: string[] = [];
  if (text.length < MIN_LENGTH) {
    problems.push(`entry is ${text.length} characters, below the minimum of ${MIN_LENGTH}`);
  }
  if (text.length > MAX_LENGTH) {
    problems.push(`entry is ${text.length} characters, over the maximum of ${MAX_LENGTH}`);
  }
  if (text.trim().length === 0) {
    problems.push("entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("entry must be a single line");
  }
  return problems;
}

function main(): void {
  const entry = buildEntry(WORD, DEFINITION);
  const problems = validateEntry(entry);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`invalid entry: ${problem}`);
    }
    process.exit(1);
  }

  const outDir = "/output";
  const outPath = `${outDir}/entry.txt`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, entry, "utf8");

  // Read it back: the graded artifact is the file on disk, so confirm
  // what landed there is exactly the validated line, nothing more.
  const written = readFileSync(outPath, "utf8");
  if (written !== entry) {
    console.error("entry on disk does not match the validated entry");
    process.exit(1);
  }
  console.log(`wrote ${entry.length} characters to ${outPath}`);
  console.log(entry);
}

main();
