---
description: "이 저장소의 자산 관리 스크립트와 실행 명령을 확인할 때 읽습니다."
---

# Scripts

[manage-agent-assets.ts](manage-agent-assets.ts)는 `rulesync.jsonc`에 선택된 자산의 설치·복구·명시적 갱신, 런타임 projection과 ignore 항목을 관리합니다. [mise tasks](../mise.toml)에서 호출합니다.

`agents-check`는 설정만 검증하며, `agents-preview`는 설치된 자산의 생성 결과를 미리 봅니다. `agents-setup`, `agents-restore`, `agents-refresh`는 외부 설치·로컬 쓰기를 포함합니다. `agents-retire`는 기본 dry-run이며 `--apply`를 지정해야 생성물 제거를 적용합니다.

변경 시 [tests](../tests/scripts/manage-agent-assets.test.ts)를 검토합니다.
