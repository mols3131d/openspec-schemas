import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const schema = "spec-driven-tdd";
const change = "document-increment";
const example = join(root, ".tmp", "openspec-consumer");

function run(project: string, executable: string, args: string[]): string {
  try {
    return execFileSync(executable, args, {
      cwd: project,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        XDG_CONFIG_HOME: join(project, ".xdg-config"),
        XDG_DATA_HOME: join(project, ".xdg-data"),
      },
    });
  } catch (error) {
    const failure = error as Error & { stderr?: string };
    throw new Error(
      [executable, ...args].join(" ") + ": " + (failure.stderr ?? failure.message),
      { cause: error },
    );
  }
}

function initialize(project: string): void {
  rmSync(project, { recursive: true, force: true });
  cpSync(join(root, "tests", "fixtures", "consumer"), project, {
    recursive: true,
  });
  run(project, "openspec", ["init", "--tools", "none"]);
  const destination = join(project, "openspec", "schemas", schema);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(join(root, "src", "schemas", schema), destination, {
    recursive: true,
  });
}

function write(project: string, path: string, content: string): void {
  const destination = join(project, "openspec", "changes", change, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content.trimStart(), "utf8");
}

function check(): void {
  const project = mkdtempSync(join(tmpdir(), "openspec-consumer-"));
  try {
    initialize(project);
    run(project, "node", ["--test"]);
    run(project, "openspec", ["schema", "validate", schema]);
    run(project, "openspec", ["new", "change", change, "--schema", schema]);

    const status = () => JSON.parse(
      run(project, "openspec", ["status", "--change", change, "--json"]),
    ) as {
      isComplete: boolean;
      artifacts: { id: string; status: string }[];
    };
    const state = (id: string) => status().artifacts.find(
      (artifact) => artifact.id === id,
    )?.status;

    assert.equal(state("proposal"), "ready");
    assert.equal(state("specs"), "blocked");

    write(project, "proposal.md", [
      "---",
      "title: Document increment",
      "description: Record the counter's existing increment behavior",
      "type: openspec-spec-driven-tdd-proposal",
      "---",
      "",
      "## Why",
      "Document a minimal working behavior.",
      "",
      "## What Changes",
      "- Describe the existing increment operation.",
      "",
      "## Capabilities",
      "### New Capabilities",
      "#### \`counter\`",
      "- Incrementing an integer returns its successor.",
      "",
    ].join("\n"));

    assert.equal(state("specs"), "ready");
    write(project, "specs/counter/spec.md", [
      "---",
      "category: spec",
      "title: counter",
      "description: Increment behavior",
      "type: openspec-spec-driven-tdd-spec",
      "---",
      "",
      "## Purpose",
      "This capability describes an existing small counter operation,",
      "making its externally observable increment behavior testable.",
      "",
      "## ADDED Requirements",
      "### Requirement: Increment returns the next integer",
      "The counter MUST return the next integer for an increment call.",
      "",
      "#### Scenario: Increment by one",
      "- **WHEN** increment is called with the value 1",
      "- **THEN** the result is 2",
      "",
    ].join("\n"));

    assert.equal(state("design"), "ready");
    write(project, "design.md", [
      "---",
      "title: Counter increment",
      "description: No new technical design is necessary",
      "type: openspec-spec-driven-tdd-design",
      "---",
      "",
      "## Technical Delta",
      "기존 구조를 그대로 따른다.",
      "",
    ].join("\n"));

    assert.equal(state("tasks"), "ready");
    write(project, "tasks.md", [
      "---",
      "category: tasks",
      "title: Counter increment",
      "description: Verify the existing increment function",
      "type: openspec-spec-driven-tdd-tasks",
      "---",
      "",
      "## Tasks",
      "- [x] Verify increment behavior",
      "  - **Done when:** \`node --test\` passes.",
      "",
    ].join("\n"));

    assert.equal(status().isComplete, true);
    assert.equal(status().artifacts.every((item) => item.status === "done"), true);
    assert.ok(run(project, "openspec", [
      "instructions", "apply", "--change", change, "--json",
    ]).trim());
    run(project, "openspec", ["validate", change, "--strict", "--no-interactive"]);

    const result = JSON.parse(run(project, "openspec", [
      "archive", change, "--yes", "--json",
    ])) as { archive: { archivedAs: string; specsUpdated: boolean } };
    assert.equal(result.archive.specsUpdated, true);
    assert.ok(existsSync(join(
      project, "openspec", "changes", "archive", result.archive.archivedAs,
      "tasks.md",
    )));
    assert.match(readFileSync(
      join(project, "openspec", "specs", "counter", "spec.md"), "utf8",
    ), /Requirement: Increment returns the next integer/);

    // Re-initialization must discard all previous generated OpenSpec state.
    initialize(project);
    assert.equal(existsSync(join(project, "openspec", "changes", "archive")), false);
    run(project, "node", ["--test"]);
    console.log("OpenSpec consumer E2E passed");
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
}

if (process.argv[2] === "init" && process.argv.length === 3) {
  initialize(example);
  console.log("Initialized example: " + example);
} else if (process.argv.length === 2) {
  check();
} else {
  throw new Error("Usage: node scripts/check-openspec-e2e.ts [init]");
}
