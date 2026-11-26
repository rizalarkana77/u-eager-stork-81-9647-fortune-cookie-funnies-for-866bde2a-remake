import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LIMIT = 120;

// The fortune. One line, aimed at a software engineer.
// Angle: the eternal naming ceremony — an hour of care, a week of glory,
// then the codebase quietly renames your masterpiece to data2.
// Freshness check against the field: no naming/data2 joke among the 745
// submitted titles, and no overlap with the original timezone entry.
const FORTUNE =
  "You will spend an hour naming the variable perfectly. Within a week it will be called data2.";

function checkFortune(text: string): void {
  if (text.length === 0) throw new Error("fortune must not be empty");
  if (text.length > LIMIT) {
    throw new Error(`fortune is ${text.length} chars, over the ${LIMIT} limit`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("fortune must be exactly one line");
  }
  if (text !== text.trim()) {
    throw new Error("fortune must not carry leading or trailing spaces");
  }
  if (!/^[\x20-\x7E]+$/.test(text)) {
    throw new Error("fortune must be printable ASCII only");
  }
  if (text.includes("  ")) {
    throw new Error("fortune must not contain double spaces");
  }
  if (!text.endsWith(".")) {
    throw new Error("a fortune ends with a full stop");
  }
}

function main(): void {
  checkFortune(FORTUNE);
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, FORTUNE, "utf8");
  const back = readFileSync(target, "utf8");
  if (back !== FORTUNE) throw new Error("read-back does not match the fortune");
  const digest = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(back);
  console.log(`chars: ${back.length}`);
  console.log(`sha256: ${digest}`);
}

main();
