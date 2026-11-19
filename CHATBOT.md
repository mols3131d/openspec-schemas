# Chatbot Compatibility Entrypoint

Use only when a chat runtime is configured to load this file. It routes discovery to project-owned instructions and assets; it does not redefine policies, Skill behavior or execution permissions.

1. Confirm repository, ref, paths and relevant live GitHub state. Read [AGENTS.md](AGENTS.md) and any path-scoped instructions.
2. For schema work, consult [Development](docs/development.md) and the selected schema under [src/schemas/](src/README.md), including its YAML, templates, README and baseline. For tooling, consult [Tooling](docs/tooling.md).
3. Discover Agent Skills natively when supported. Otherwise inspect [rulesync.jsonc](rulesync.jsonc) and the relevant installed or source-reachable Skill and required references. A declared source is not proof of a loaded Skill.
4. Prefer supported native execution and delegation. If a required capability is unavailable, do only meaning-preserving authorized work and disclose unverified parts. Sequential self-review is not independent delegated review.

This file cannot guarantee that an agent or chat runtime loads these instructions automatically.
