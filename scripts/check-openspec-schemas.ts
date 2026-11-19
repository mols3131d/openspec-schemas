import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The distributable source tree is not an OpenSpec project schema directory.
// Validate a pristine copy in a temporary project without modifying sources.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const schemas = join(root, "src", "schemas");
const names = readdirSync(schemas, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (names.length === 0) {
  throw new Error("No distributable schemas found in src/schemas/");
}
for (const name of names) {
  if (!existsSync(join(schemas, name, "schema.yaml"))) {
    throw new Error(`Missing schema.yaml for ${name}`);
  }
}

const temp = mkdtempSync(join(tmpdir(), "openspec-schema-check-"));
try {
  const projectSchemas = join(temp, "openspec", "schemas");
  mkdirSync(projectSchemas, { recursive: true });
  for (const name of names) {
    cpSync(join(schemas, name), join(projectSchemas, name), {
      recursive: true,
    });
  }

  const env = {
    ...process.env,
    XDG_CONFIG_HOME: join(temp, "xdg-config"),
    XDG_DATA_HOME: join(temp, "xdg-data"),
  };
  const command = (args: string[]): string => {
    try {
      return execFileSync("openspec", args, {
        cwd: temp,
        env,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (error) {
      const failure = error as Error & {
        stdout?: string;
        stderr?: string;
      };
      throw new Error(
        `openspec ${args.join(" ")} failed: ${failure.stderr ?? failure.message}`,
        { cause: error },
      );
    }
  };

  for (const name of names) {
    const resolution = JSON.parse(
      command(["schema", "which", name, "--json"]),
    ) as { source?: string; name?: string };
    if (resolution.name !== name || resolution.source !== "project") {
      throw new Error(
        `Unexpected schema resolution for ${name}: ${JSON.stringify(resolution)}`,
      );
    }

    command(["schema", "validate", name]);

    const change = `schema-check-${name}`;
    command(["new", "change", change, "--schema", name]);

    const status = JSON.parse(
      command(["status", "--change", change, "--json"]),
    ) as { schemaName?: string };
    if (status.schemaName !== name) {
      throw new Error(`Unexpected change schema for ${change}`);
    }

    const proposal = JSON.parse(
      command(["instructions", "proposal", "--change", change, "--json"]),
    ) as { schemaName?: string; artifactId?: string; template?: string };
    if (
      proposal.schemaName !== name ||
      proposal.artifactId !== "proposal" ||
      !proposal.template
    ) {
      throw new Error(`Missing proposal instructions for ${change}`);
    }
    console.log(`Validated and smoke-tested OpenSpec schema: ${name}`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
