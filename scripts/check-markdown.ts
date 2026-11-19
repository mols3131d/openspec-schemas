import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const paths = execFileSync(
  "git",
  ["ls-files", "-z", "*.md", ":!.inbox/**"],
  { cwd: root, encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);

if (paths.length === 0) {
  throw new Error("No tracked Markdown files were found");
}

// Inbox Markdown is formatted by its opt-in pre-commit hook, not CI.
for (const args of [
  ["check", ...paths],
  ["fmt", "--check", ...paths],
]) {
  execFileSync("rumdl", args, { cwd: root, stdio: "inherit" });
}
