---
description: "OpenSpec schema 저장소의 mise, Rulesync, lint, Git hook과 CI를 설정·검증할 때 사용합니다."
---

# Development Tooling

[mise](../mise.toml)는 Node.js, OpenSpec CLI와 작업을, [Rulesync](../rulesync.jsonc)는 외부 Agent Skills 및 런타임 대상을 선언합니다. `AGENTS.md`는 에이전트 작업 지침을, 각 `schema.yaml`과 templates는 OpenSpec 계약을 소유합니다.

## Initial setup

외부 다운로드와 로컬 쓰기 전에 설정 및 [asset manager](../scripts/manage-agent-assets.ts)의 동작을 검토하고 승인한 후 실행합니다.

```sh
mise install
mise run setup
mise run check
```

개발 도구는 `mise.toml`에서 메이저 버전만 선언한다. `mise install`은 해당 메이저의 최신 사용 가능 릴리스를 설치할 수 있으며, 이미 설치된 일치 버전을 계속 사용 중이라면 `mise upgrade`로 같은 메이저 내 최신 버전으로 갱신한다. `rulesync.lock`은 개발 도구 버전과 별개로 외부 Agent Skills의 소스 리비전을 고정한다. 저장소의 `src/schemas/`는 배포 원본이며 OpenSpec의 프로젝트 탐색 경로가 아니다. 검증은 임시 프로젝트의 `openspec/schemas/`에 복사해 진행한다.

`setup`은 Rulesync 소스를 가져오고 런타임별 projection·ignore 항목과 `rulesync.lock`을 생성하거나 기존 lock을 사용합니다. 이 clone의 Git commit template도 설정합니다. 잠금 파일과 생성 결과는 검토한 뒤 커밋합니다. 이 PR에서는 격리된 GitHub Actions 환경에서 최초 설치·잠금 기반 복원·projection 미리보기를 검증하고 `rulesync.lock`을 반영했다. CI의 OpenSpec 임시 검증과 외부 Skills의 설치는 별개다. Agent asset 통합 workflow는 읽기 전용 토큰으로 외부 GitHub 소스를 조회하며 검토된 `rulesync.lock` 기준으로 임시 runner에서 frozen restore와 projection preview를 검증한다. 로컬 자산 설치 결과는 이 PR의 정적 검사만으로 보장되지 않는다.

기존 lock을 재현할 때는 `mise run agents-restore`, upstream을 의도적으로 갱신할 때는 `mise run agents-refresh`를 사용합니다. 설치된 자산의 projection은 `mise run agents-preview`로 확인합니다. `mise run agents-retire -- <targets> --features <features> [--apply]`는 은퇴한 생성물 정리를 미리 보고, 제거를 승인했을 때만 `--apply`를 사용합니다.

## Verification

| Command | Scope |
| --- | --- |
| `mise run check` | 추적 중인 Markdown (`.inbox` 제외), Biome, Lefthook 구성 및 OpenSpec schema runtime smoke 검사 (임시 디렉터리 사용) |
| `mise run markdown-check` | CI와 동일하게 Git이 추적하는 Markdown만 검사 (`.inbox` 제외) |
| `mise run schema-check` | 모든 `src/schemas/` 스키마를 임시 OpenSpec 프로젝트에서 resolve, validate, change 생성, instructions 확인 |
| `mise run agents-check` | Rulesync 설정 검사 (설치나 runtime activation 증거는 아님) |
| `mise run agents-smoke` | 명시적 실행: 설치, projection 확인, 잠금 기반 restore를 다시 실행 (외부 다운로드/로컬 쓰기 발생) |
| `mise exec -- node --test tests/scripts/manage-agent-assets.test.ts` | 자산 관리 스크립트 unit tests |
| `mise run format` | Markdown과 Biome 지원 파일 포맷 변경; diff 확인 필요 |

[GitHub Actions](../.github/workflows/repo-checks.yml)는 lint, 자산 관리자 테스트와 OpenSpec CLI 스키마 smoke 검사를 실행합니다. `.inbox/`의 Markdown은 로컬 pre-commit hook에서 별도로 포맷하며 `markdown-check`와 CI 검사 대상에서 제외한다. `.inbox/`만 변경하면 CI가 생략될 수 있으므로 이 workflow를 모든 PR의 필수 check로 간주하지 않습니다. OpenSpec CLI의 schema validation과 첫 Proposal instructions까지 확인하지만 실제 artifact 내용의 파싱·archive·배포 통합은 별도 검증 대상이다. `push` 검사는 `main`에만 적용하고 PR 브랜치는 `pull_request`로 검사해 중복 실행을 피한다.

GitHub의 `main` 보호와 required checks는 repository settings에서 별도로 활성화해야 한다. 이 설정은 파일 복사나 `mise`로 대체할 수 없다. `.inbox/**`만 변경하는 PR은 check가 실행되지 않으므로 현재 workflow를 무조건적인 required check로 등록하면 안 된다.

Git hook은 기존 hook과 `core.hooksPath`를 검토한 후 `lefthook install`로 **선택적으로** 설치합니다. 기본 setup은 hook을 설치하지 않습니다.
