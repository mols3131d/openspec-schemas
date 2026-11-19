---
description: "OpenSpec schema 저장소의 mise, Rulesync, lint, Git hook과 CI를 설정·검증할 때 사용합니다."
---

# Development Tooling

[mise](../mise.toml)는 CLI와 작업을, [Rulesync](../rulesync.jsonc)는 외부 Agent Skills 및 런타임 대상을 선언합니다. `AGENTS.md`는 에이전트 작업 지침을, 각 `schema.yaml`과 templates는 OpenSpec 계약을 소유합니다.

## Initial setup

외부 다운로드와 로컬 쓰기 전에 설정 및 [asset manager](../scripts/manage-agent-assets.ts)의 동작을 검토하고 승인한 후 실행합니다.

```sh
mise install
mise run setup
mise run check
```

`setup`은 Rulesync 소스를 가져오고 런타임별 projection·ignore 항목과 `rulesync.lock`을 생성하거나 기존 lock을 사용합니다. 이 clone의 Git commit template도 설정합니다. 잠금 파일과 생성 결과는 검토한 뒤 커밋합니다. 설치 및 setup은 이 PR에서 실행한 것으로 간주하지 않습니다.

기존 lock을 재현할 때는 `mise run agents-restore`, upstream을 의도적으로 갱신할 때는 `mise run agents-refresh`를 사용합니다. 설치된 자산의 projection은 `mise run agents-preview`로 확인합니다. `mise run agents-retire -- <targets> --features <features> [--apply]`는 은퇴한 생성물 정리를 미리 보고, 제거를 승인했을 때만 `--apply`를 사용합니다.

## Verification

| Command | Scope |
| --- | --- |
| `mise run check` | Markdown, Biome, Lefthook 구성의 read-only 검사 |
| `mise run agents-check` | Rulesync 설정 검사 (설치나 runtime activation 증거는 아님) |
| `mise exec -- node --test tests/scripts/manage-agent-assets.test.ts` | 자산 관리 스크립트 unit tests |
| `mise run format` | Markdown과 Biome 지원 파일 포맷 변경; diff 확인 필요 |

[GitHub Actions](../.github/workflows/repo-checks.yml)는 정적 저장소 검사만 실행합니다. `.inbox/`만 변경하면 CI가 생략될 수 있으므로 이 workflow를 모든 PR의 필수 check로 간주하지 않습니다. OpenSpec 런타임의 schema validation, artifact parser 및 integration 검증은 별도로 해야 합니다.

Git hook은 기존 hook과 `core.hooksPath`를 검토한 후 `lefthook install`로 **선택적으로** 설치합니다. 기본 setup은 hook을 설치하지 않습니다.
