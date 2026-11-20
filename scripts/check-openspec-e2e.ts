import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
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
      [
        [executable, ...args].join(" "),
        failure.stderr ?? failure.message,
      ].join(": "),
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

function check(): void {
  const project = mkdtempSync(join(tmpdir(), "openspec-consumer-"));
  try {
    initialize(project);
    run(project, "node", ["--test"]);
    run(project, "openspec", ["schema", "validate", schema]);
    run(project, "openspec", ["new", "change", change, "--schema", schema]);

    const status = (): {
      isComplete: boolean;
      artifacts: { id: string; status: string }[];
    } => JSON.parse(
      run(project, "openspec", ["status", "--change", change, "--json"]),
    );
    const state = (id: string) =>
      status().artifacts.find((artifact) => artifact.id === id)?.status;
    const copy = (file: string) => {
      const destination = join(project, "openspec", "changes", change, file);
      mkdirSync(dirname(destination), { recursive: true });
      cpSync(join(root, "tests", "fixtures", "change", file), destination);
    };

    assert.equal(state("proposal"), "ready");
    assert.equal(state("specs"), "blocked");
    copy("proposal.md");
    assert.equal(state("specs"), "ready");
    copy("specs/counter/spec.md");
    assert.equal(state("design"), "ready");
    copy("design.md");
    assert.equal(state("tasks"), "ready");
    copy("tasks.md");

    assert.equal(status().isComplete, true);
    assert.equal(status().artifacts.every((item) => item.status === "done"), true);
    assert.ok(
      run(project, "openspec", [
        "instructions",
        "apply",
        "--change",
        change,
        "--json",
      ]).trim(),
    );
    // OpenSpec v2 warns about custom delta frontmatter; errors still fail.
    run(project, "openspec", ["validate", change, "--no-interactive"]);

    const result = JSON.parse(
      run(project, "openspec", ["archive", change, "--yes", "--json"]),
    ) as { archive: { archivedAs: string; specsUpdated: boolean } };
    assert.equal(result.archive.specsUpdated, true);
    const archivedTasks = join(
      project,
      "openspec",
      "changes",
      "archive",
      result.archive.archivedAs,
      "tasks.md",
    );
    assert.ok(existsSync(archivedTasks));
    const mainSpec = join(project, "openspec", "specs", "counter", "spec.md");
    assert.match(
      readFileSync(mainSpec, "utf8"),
      /Requirement: Increment returns the next integer/,
    );

    initialize(project);
    assert.equal(existsSync(mainSpec), false);
    run(project, "node", ["--test"]);
    console.log("OpenSpec consumer E2E passed");
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
}

if (process.argv[2] === "init" && process.argv.length === 3) {
  initialize(example);
  console.log("Initialized example:", example);
} else if (process.argv.length === 2) {
  check();
} else {
  throw new Error("Usage: node scripts/check-openspec-e2e.ts [init]");
}
